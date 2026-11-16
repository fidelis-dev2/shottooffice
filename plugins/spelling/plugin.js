/* Shotto Office — local spelling for TinyMCE 6. No network calls. */
(function () {
  'use strict';
  const engines = new Map();
  let sequence = 0;
  const labels = { sw: 'Kiswahili', en: 'English (UK)' };
  const tags = { sw: 'sw-TZ', en: 'en-GB' };
  const skip = 'script,style,code,pre,math,svg,textarea,[contenteditable="false"],[data-shotto-object],.shotto-equation,[data-mce-bogus="all"],[spellcheck="false"]:not(body)';
  const blocks = 'address,article,aside,blockquote,caption,dd,details,div,dt,figcaption,h1,h2,h3,h4,h5,h6,li,p,section,td,th';
  const language = value => /^(sw|en)(?:-|$)/i.exec(value || '')?.[1].toLowerCase();
  const normal = word => word.normalize('NFC').replace(/’/g,"'");

  function engine(lang) {
    if (!engines.has(lang)) {
      const dict = window.ShottoNSpell(window.ShottoProofDictionaries[lang]);
      if (lang === 'sw') {
        // Productive positive subject/tense forms of these regular multisyllabic verbs.
        const stems = 'soma andika fanya penda cheza fundisha jifunza sema uliza jibu eleza hesabu chora funga fungua tumia saidia tafuta pima panga badili angalia sikiliza sikia jenga linda endesha chagua hifadhi jadili chunguza pokea andaa anza maliza nunua uza safisha onyesha chapisha tafsiri tuma shinda shiriki'.split(' ');
        const additions = new Set(['Shotto','TEHAMA']);
        for (const stem of stems) {
          additions.add('ku'+stem);
          for (const subject of ['ni','u','a','tu','m','wa'])
            for (const tense of ['na','li','ta','me']) additions.add(subject+tense+stem);
        }
        dict.dictionary(additions.size+'\n'+Array.from(additions).join('\n'));
      }
      engines.set(lang,dict);
    }
    return engines.get(lang);
  }

  // Keep the spell engine's ordering. For sparse results, look for nearby
  // dictionary entries sharing the beginning or end, then verify the spelling.
  const wordIndexes = new Map();
  function lookupKeys(word) {
    const keys=['^'+word.slice(0,2),'$'+word.slice(-2)];
    if(word.length>=5) keys.push('~'+word.slice(-4,-1));
    return keys;
  }
  function similarEntries(lang,word) {
    if (!wordIndexes.has(lang)) {
      const buckets = new Map();
      for (const line of window.ShottoProofDictionaries[lang].dic.split('\n')) {
        const entry=line.split('/')[0].trim();
        if (!/^\p{L}{3,40}$/u.test(entry)) continue;
        const lower=entry.toLowerCase();
        for (const key of lookupKeys(lower)) {
          if (!buckets.has(key)) buckets.set(key,[]);
          buckets.get(key).push(entry);
        }
      }
      wordIndexes.set(lang,buckets);
    }
    const buckets=wordIndexes.get(lang);
    return new Set(lookupKeys(word).flatMap(key=>buckets.get(key)||[]));
  }
  function distanceWithin(a,b,limit) {
    if (Math.abs(a.length-b.length)>limit) return limit+1;
    let prev=Array.from({length:b.length+1},(_,i)=>i);
    for(let i=1;i<=a.length;i++) {
      const row=[i];
      let min=i;
      for(let j=1;j<=b.length;j++){
        row[j]=Math.min(row[j-1]+1,prev[j]+1,prev[j-1]+Number(a[i-1]!==b[j-1]));
        min=Math.min(min,row[j]);
      }
      if(min>limit)return limit+1;
      prev=row;
    }
    return prev[b.length];
  }
  function suggestions(hit) {
    if (!hit || hit.word.length>40) return [];
    const dict=engine(hit.lang), original=normal(hit.word), lower=original.toLowerCase();
    const found=new Set([lower]), values=[];
    function add(value){
      const key=value.toLowerCase();
      if(!found.has(key)){found.add(key);values.push(value);}
    }
    for (const candidate of dict.suggest(original)) add(candidate);
    if(values.length<3 && lower.length>=3) {
      const limit=lower.length>=5?2:1, matches=[];
      for(const entry of similarEntries(hit.lang,lower)){
        const key=entry.toLowerCase();
        if(found.has(key) || (original===lower && key!==entry)) continue;
        const distance=distanceWithin(lower,key,limit);
        if(distance<=limit && dict.correct(entry)) matches.push({entry,distance});
      }
      matches.sort((a,b)=>a.distance-b.distance || Math.abs(a.entry.length-lower.length)-Math.abs(b.entry.length-lower.length) || a.entry.localeCompare(b.entry));
      for(const {entry} of matches) {
        const cased=original[0]!==lower[0]?entry[0].toUpperCase()+entry.slice(1):entry;
        add(cased);if(values.length>=6)break;
      }
    }
    return values.slice(0,6);
  }

  function storageWords(editor,lang) {
    try { return JSON.parse(editor.getElement().ownerDocument.defaultView.localStorage.getItem('shotto.spelling.v1.'+lang) || '[]'); }
    catch { return []; }
  }

  function install(editor) {
    if (editor.shottoSpelling) return editor.shottoSpelling;
    const outer = editor.getElement().ownerDocument;
    const hostWindow = outer.defaultView;
    const defaultLanguage = language(editor.getElement().closest('[lang]')?.lang) || language(outer.documentElement.lang) || 'sw';
    let docLanguage = defaultLanguage, live = true, timer, panel, ui, current = 0;
    let issues = [], selection = null, ignored = new WeakMap(), selectedIssue = null;
    const personal = {}, transient = {en:new Set(),sw:new Set()};
    function reloadPersonal() {
      for (const lang of ['sw','en']) {
        const words = storageWords(editor,lang);
        personal[lang] = new Set([...(Array.isArray(words)?words:[]), ...transient[lang]]);
      }
    }
    reloadPersonal();
    const accepted = {en:new Map(),sw:new Map()};
    const name = 'shotto-spelling-'+(++sequence);
    function status(message) { if (ui) ui.message.textContent = message; }
    function langOf(node) {
      const parent = node.nodeType===1 ? node : node.parentElement;
      const tagged = parent?.closest('[lang]');
      if (!tagged || !editor.getBody().contains(tagged) || tagged===editor.getBody()) return docLanguage;
      return language(tagged.lang) || 'other';
    }
    function captureSelection() {
      const r = editor.selection.getRng();
      if (editor.getBody().contains(r.commonAncestorContainer)) {
        selection = r.collapsed ? null : r.cloneRange();
        if (ui) { ui.apply.disabled = !selection || editor.mode.isReadOnly(); if (selection) ui.section.value = langOf(r.startContainer)==='en'?'en':'sw'; }
      }
    }
    function correctlySpelled(word,lang) {
      const key = normal(word), cache=accepted[lang];
      if (personal[lang].has(key.toLowerCase())) return true;
      if (!cache.has(key)) {
        if (cache.size>20000) cache.clear();
        cache.set(key,engine(lang).correct(key));
      }
      return cache.get(key);
    }
    function check() {
      clearTimeout(timer);
      const body = editor.getBody();
      if (!body) return;
      const previous = selectedIssue;
      issues = [];
      let text='', pieces=[], activeLang;
      function flush() {
        if (pieces.length && activeLang!=='other') {
          let part=0;
          // URLs and email addresses are consumed as whole tokens.
          const tokens=/(?:https?:\/\/|www\.)[^\s]+|[\p{L}\p{N}._%+-]+@[\p{L}\p{N}.-]+\.[\p{L}]{2,}|[\p{L}\p{M}\p{N}_]+(?:['’][\p{L}\p{M}]+)*/giu;
          for (const match of text.matchAll(tokens)) {
            const word=match[0];
            if (word.includes('@') || /^(?:https?:\/\/|www\.)/i.test(word) || /[\d_]/u.test(word) || word.length>100) continue;
            if (correctlySpelled(word,activeLang)) continue;
            const start=match.index, end=start+word.length;
            while (part+1<pieces.length && pieces[part].end<=start) part++;
            const slices=[];
            for (let i=part;i<pieces.length && pieces[i].start<end;i++) {
              const p=pieces[i]; slices.push({node:p.node,from:Math.max(0,start-p.start),to:Math.min(p.end,end)-p.start});
            }
            const first=slices[0], last=slices[slices.length-1];
            if (ignored.get(first.node)?.some(item=>item.lang===activeLang && item.range.startOffset===first.from && item.word===word && item.range.toString()===word)) continue;
            const range=editor.getDoc().createRange();
            range.setStart(first.node,first.from);range.setEnd(last.node,last.to);
            issues.push({word,lang:activeLang,range,slices});
          }
        }
        text='';pieces=[];
      }
      function walk(node) {
        if (node.nodeType===3) {
          if (!node.data) return;
          const lang=langOf(node);if (activeLang!==lang){flush();activeLang=lang;}
          pieces.push({node,start:text.length,end:text.length+node.length});text+=node.data;return;
        }
        if (node.nodeType!==1) return;
        if (node!==body && (node.matches(skip) || node.matches('br,hr,img'))){flush();return;}
        const boundary=node!==body && node.matches(blocks);
        if (boundary) flush();
        for(const child of node.childNodes) walk(child);
        if (boundary) flush();
      }
      walk(body);flush();
      if(previous){
        const i=issues.findIndex(h=>h.word===previous.word && h.slices[0].node===previous.slices[0].node && h.slices[0].from===previous.slices[0].from);
        if(i>=0)current=i;
        else if(panel?.classList.contains('sp-context'))close();
      }
      current=Math.max(0,Math.min(issues.length-1,current));
      paint();
      if(panel) render();
    }
    function paint() {
      const win=editor.getWin(), registry=win.CSS?.highlights;
      if (!registry || !win.Highlight) return;
      registry.delete(name);registry.delete(name+'-active');
      if (live && issues.length) {
        const hl=new win.Highlight();
        for(const issue of issues)hl.add(issue.range);
        registry.set(name,hl);
      }
      if(panel && issues[current])registry.set(name+'-active',new win.Highlight(issues[current].range));
    }
    function schedule() {
      clearTimeout(timer);
      if(live || panel)timer=setTimeout(check,260);
    }
    function inheritDefault(){
      const stored=editor.getBody()?.querySelector('[data-shotto-proof-default]');
      docLanguage=language(stored?.dataset.shottoProofDefault) || defaultLanguage;
      if(ui)ui.doc.value=docLanguage;
      editor.dispatch('ShottoProofLanguage',{language:labels[docLanguage]});
    }
    function persistDefault(lang){
      if(editor.mode.isReadOnly())return;
      editor.undoManager.transact(()=>{
        const body=editor.getBody();
        for(const child of body.children){
          if(child.matches(skip) || child.hasAttribute('data-mce-bogus'))continue;
          if(!child.lang || child.dataset.shottoProofInherit==='1'){child.lang=tags[lang];child.dataset.shottoProofInherit='1';}
          child.dataset.shottoProofDefault=lang;
        }
      });
      docLanguage=lang;ignored=new WeakMap();editor.setDirty(true);editor.dispatch('change');
      editor.dispatch('ShottoProofLanguage',{language:labels[lang]});check();
    }
    function applyLanguage(){
      if(!selection || selection.collapsed || !editor.getBody().contains(selection.commonAncestorContainer) || editor.mode.isReadOnly())return;
      const lang=ui.section.value, saved=selection.cloneRange();
      editor.focus();editor.selection.setRng(saved);
      editor.undoManager.transact(()=>editor.formatter.apply('shottoprooflanguage',{language:tags[lang]}));
      captureSelection();editor.nodeChanged();editor.setDirty(true);editor.dispatch('change');check();
      status('Lugha ya maandishi yaliyochaguliwa ni '+labels[lang]+'.');
    }
    function reveal(){
      const hit=issues[current];
      if(hit)hit.range.startContainer.parentElement.scrollIntoView({block:'nearest',inline:'nearest'});
      paint();
    }
    function finishAt(node,offset) {
      close();
      if(node && editor.getBody().contains(node)){
        const caret=editor.getDoc().createRange();
        caret.setStart(node,Math.min(offset,node.length));caret.collapse(true);
        editor.focus();editor.selection.setRng(caret);editor.nodeChanged();
      }
      check();
    }
    function usableHit(){
      const hit=issues[current];
      if(hit && hit.slices.every(s=>s.node.isConnected) && hit.slices.map(s=>s.node.data.slice(s.from,s.to)).join('')===hit.word)return hit;
      close();check();return null;
    }
    function replace(value) {
      const hit=usableHit();value=value.trim();
      if(!hit || !value || editor.mode.isReadOnly())return;
      let endNode,endOffset;
      editor.undoManager.transact(()=>{
        let rest=value;
        hit.slices.forEach(({node,from,to},i)=>{
          const fragment=i===hit.slices.length-1?rest:rest.slice(0,to-from);
          node.replaceData(from,to-from,fragment);rest=rest.slice(fragment.length);
          if(fragment){endNode=node;endOffset=from+fragment.length;}
        });
        finishAt(endNode,endOffset);
      });
      editor.setDirty(true);editor.dispatch('change');
    }
    function ignoreWord(){
      const hit=usableHit();if(!hit)return;
      const first=hit.slices[0].node, last=hit.slices[hit.slices.length-1];
      if(!ignored.has(first))ignored.set(first,[]);
      ignored.get(first).push({word:hit.word,lang:hit.lang,range:hit.range.cloneRange()});
      finishAt(last.node,last.to);
    }
    function addWord(){
      const hit=usableHit();if(!hit)return;
      const key=normal(hit.word).toLowerCase();reloadPersonal();
      personal[hit.lang].add(key);transient[hit.lang].add(key);
      try{hostWindow.localStorage.setItem('shotto.spelling.v1.'+hit.lang,JSON.stringify([...personal[hit.lang]]));}
      catch{editor.notificationManager.open({type:'info',text:'Neno linatunzwa kwa kipindi hiki kwa sababu browser haikuruhusu kulihifadhi.'});}
      const last=hit.slices[hit.slices.length-1];finishAt(last.node,last.to);
    }
    function button(text,fn){const b=outer.createElement('button');b.type='button';b.textContent=text;b.onclick=fn;return b;}
    function render(){
      const hit=issues[current];selectedIssue=hit || null;
      ui.doc.value=docLanguage;ui.live.checked=live;ui.details.hidden=!hit;ui.empty.hidden=!!hit;
      ui.count.textContent=hit?(current+1)+' / '+issues.length:'';
      ui.prev.disabled=ui.next.disabled=issues.length<2;
      ui.apply.disabled=!selection || selection.collapsed || editor.mode.isReadOnly();
      ui.doc.disabled=editor.mode.isReadOnly();
      if(!hit)return;
      ui.word.textContent=hit.word;ui.tag.textContent=labels[hit.lang];
      const cacheKey=hit.lang+'/'+hit.word;
      if(ui.choices.dataset.key!==cacheKey) {
        ui.choices.replaceChildren();ui.choices.dataset.key=cacheKey;
        const choices=suggestions(hit);
        ui.input.value=choices[0] || '';
        for(const option of choices){
          const b=button(option,()=>replace(option));b.disabled=editor.mode.isReadOnly();ui.choices.append(b);
        }
        if(!choices.length)ui.choices.textContent='Andika neno sahihi hapa chini.';
      }
      ui.replace.disabled=editor.mode.isReadOnly();
    }
    function close(){
      panel?.remove();panel=null;ui=null;selectedIssue=null;paint();
    }
    function open(index,point){
      if(!panel){
        captureSelection();
        panel=outer.createElement('aside');panel.className='shotto-proof-panel';
        panel.setAttribute('role','dialog');panel.setAttribute('aria-label','Spell Check');panel.tabIndex=-1;
        panel.innerHTML='<header><strong>Spell Check</strong><button type="button" data-close aria-label="Funga">×</button></header><label>Lugha ya hati<select data-doc></select></label><div class="sp-scope"><label>Lugha ya sehemu<select data-section></select></label><button type="button" data-apply>Weka kwa uteuzi</button></div><label class="sp-live"><input data-live type="checkbox"> Pigia mstari maneno yanayohitaji ukaguzi</label><section data-details><div class="sp-navigate"><span data-tag></span><span data-count></span><button type="button" data-prev aria-label="Neno lililotangulia">‹</button><button type="button" data-next aria-label="Neno linalofuata">›</button></div><h3 data-word></h3><div data-choices class="sp-suggestions" aria-label="Mapendekezo"></div><div class="sp-edit"><input data-input type="text" aria-label="Neno mbadala" placeholder="Neno sahihi"><button type="button" data-replace>Badilisha</button></div><div class="sp-secondary"><button type="button" data-ignore>Puuza</button><button type="button" data-add>Ongeza kwenye kamusi yangu</button></div></section><p data-empty>Hakuna neno linalohitaji ukaguzi.</p><small data-message role="status"></small>';
        outer.body.append(panel);
        ui=Object.fromEntries(['doc','section','live','apply','details','count','tag','word','choices','input','replace','ignore','add','prev','next','empty','message'].map(k=>[k,panel.querySelector('[data-'+k+']')]));
        for(const select of [ui.doc,ui.section])for(const [lang,label] of Object.entries(labels)){
          const option=outer.createElement('option');option.value=lang;option.textContent=label;select.append(option);
        }
        ui.section.value=selection?language(langOf(selection.startContainer))||docLanguage:docLanguage;
        ui.doc.onchange=()=>persistDefault(ui.doc.value);ui.apply.onclick=applyLanguage;
        ui.live.onchange=()=>{live=ui.live.checked;paint();};
        ui.ignore.onclick=ignoreWord;ui.add.onclick=addWord;ui.replace.onclick=()=>replace(ui.input.value);
        ui.input.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();replace(ui.input.value);}};
        for(const [b,delta] of [[ui.prev,-1],[ui.next,1]])b.onclick=()=>{current=(current+delta+issues.length)%issues.length;render();reveal();};
        panel.querySelector('[data-close]').onclick=close;
        panel.onkeydown=e=>{
          if(e.key==='Escape'){e.preventDefault();const hit=issues[current];if(panel.classList.contains('sp-context') && hit){const last=hit.slices[hit.slices.length-1];finishAt(last.node,last.to);}else{close();editor.focus();}}
          else if((e.key==='ArrowDown' || e.key==='ArrowUp') && panel.classList.contains('sp-context') && e.target.tagName!=='INPUT'){
            const buttons=[...panel.querySelectorAll('button:not(:disabled)')].filter(b=>b.offsetWidth);
            if(!buttons.length)return;
            e.preventDefault();const i=buttons.indexOf(outer.activeElement);
            buttons[(i+(e.key==='ArrowDown'?1:-1)+buttons.length)%buttons.length].focus();
          }
        };
      }
      panel.classList.toggle('sp-context',!!point);
      panel.setAttribute('aria-label',point?'Mapendekezo ya tahajia':'Spell Check');
      if(typeof index==='number'){current=index;selectedIssue=null;}
      reloadPersonal();check();
      if(point && panel){
        const w=panel.offsetWidth,h=panel.offsetHeight,gap=4;
        panel.style.left=Math.max(gap,Math.min(point.x,hostWindow.innerWidth-w-gap))+'px';
        const y=point.y+gap+h<=hostWindow.innerHeight?point.y+gap:point.y-h-gap;
        panel.style.top=Math.max(gap,Math.min(y,hostWindow.innerHeight-h-gap))+'px';
      }else if(panel){panel.style.removeProperty('top');panel.style.removeProperty('left');}
      panel?.focus({preventScroll:true});
    }
    function dismissContext(e){
      if(panel?.classList.contains('sp-context') && !panel.contains(e.target))close();
    }
    function onContextMenu(e){
      if(!live || !editor.getBody().contains(e.target) || editor.mode.isReadOnly())return;
      // Contextmenu covers a mouse or touchpad secondary button, including a
      // two-finger tap where the operating system maps it to secondary click.
      check();
      const keyboard=e.clientX===0 && e.clientY===0 && e.button!==2;
      const caret=keyboard?editor.selection.getRng():null;
      let index=-1,box;
      for(const [i,hit] of issues.entries()){
        if(keyboard){
          if(!hit.range.isPointInRange(caret.startContainer,caret.startOffset))continue;
          box=hit.range.getBoundingClientRect();
        }else{
          if(!hit.slices.some(s=>e.target.contains(s.node)))continue;
          box=[...hit.range.getClientRects()].find(r=>e.clientX>=r.left && e.clientX<=r.right && e.clientY>=r.top && e.clientY<=r.bottom);
          if(!box)continue;
        }
        index=i;break;
      }
      if(index<0){dismissContext(e);return;}
      e.preventDefault();e.stopImmediatePropagation();
      const frame=editor.iframeElement, rect=frame?.getBoundingClientRect();
      const sx=frame?rect.width/(frame.offsetWidth||rect.width):1,sy=frame?rect.height/(frame.offsetHeight||rect.height):1;
      open(index,{x:(rect?.left||0)+((frame?.clientLeft||0)+(keyboard?box.left:e.clientX))*sx,
        y:(rect?.top||0)+((frame?.clientTop||0)+(keyboard?box.bottom:e.clientY))*sy});
    }
    const sharedStyle='shotto-proof-panel-style';
    if(!outer.getElementById(sharedStyle)){
      const style=outer.createElement('style');style.id=sharedStyle;
      style.textContent='.shotto-proof-panel{position:fixed;top:clamp(12px,12vh,100px);right:14px;z-index:2100;box-sizing:border-box;width:min(350px,calc(100vw - 28px));max-height:82vh;overflow:auto;background:#fff;color:#182c40;padding:15px 17px;border:1px solid #b6c6d8;border-radius:8px;box-shadow:0 6px 28px #19395735;font:14px/1.45 "Segoe UI",Arial,sans-serif}.shotto-proof-panel *{box-sizing:border-box}.shotto-proof-panel header,.shotto-proof-panel .sp-navigate,.shotto-proof-panel .sp-scope,.shotto-proof-panel .sp-secondary,.shotto-proof-panel .sp-edit{display:flex;align-items:center;gap:7px}.shotto-proof-panel header{justify-content:space-between;margin-bottom:11px}.shotto-proof-panel strong{font-size:19px}.shotto-proof-panel label{display:block;font-size:12px;margin-bottom:7px}.shotto-proof-panel select,.shotto-proof-panel input[type=text]{width:100%;margin-top:2px;background:white;color:inherit;border:1px solid #97acc0;border-radius:4px;padding:5px;font:inherit}.shotto-proof-panel button{font:inherit;cursor:pointer;border:1px solid #b8c8d8;background:#fff;color:#164878;border-radius:4px;padding:4px 8px}.shotto-proof-panel button:hover{background:#eaf3fc}.shotto-proof-panel button:disabled{opacity:.52;cursor:default}.shotto-proof-panel .sp-scope label,.shotto-proof-panel .sp-edit input{flex:1;min-width:0}.shotto-proof-panel .sp-live{display:flex;align-items:center;gap:6px}.shotto-proof-panel section{border-top:1px solid #d3dce5;padding-top:10px}.shotto-proof-panel [data-tag]{margin-right:auto;color:#5d6d79}.shotto-proof-panel h3{font-size:18px;margin:8px 0;overflow-wrap:anywhere}.shotto-proof-panel .sp-suggestions,.shotto-proof-panel .sp-secondary{display:flex;gap:5px;flex-wrap:wrap;margin:8px 0}.shotto-proof-panel [data-replace]{background:#19578e;color:white}.shotto-proof-panel small{display:block;color:#475b6e}.shotto-proof-panel [hidden]{display:none!important}@media print{.shotto-proof-panel{display:none!important}}';
      style.textContent+='.shotto-proof-panel.sp-context{right:auto;width:min(255px,calc(100vw - 12px));max-height:calc(100vh - 12px);padding:9px 11px;line-height:1.25;z-index:65532}.sp-context header,.shotto-proof-panel.sp-context>label,.sp-context .sp-scope,.sp-context .sp-navigate,.sp-context>small{display:none}.shotto-proof-panel.sp-context section{border:0;padding:0}.sp-context h3{font-size:13px;color:#4b6174;margin:2px 0 6px}.sp-context .sp-suggestions{display:grid;gap:0;border-top:1px solid #e0e6ec;padding-top:4px}.sp-context .sp-suggestions button{border:0;text-align:left;font-size:14px;line-height:1.25;padding:5px 8px}.sp-context .sp-edit input{margin:0}.sp-context .sp-secondary{margin:8px 0 1px}.sp-context .sp-secondary button{font-size:12px}.sp-context button:focus-visible{outline:2px solid #2062a1;outline-offset:-2px}';
      outer.head.append(style);
    }
    function storageChanged(e){if(!e.key || e.key.startsWith('shotto.spelling.v1.')){reloadPersonal();schedule();}}
    editor.on('init',()=>{
      const body=editor.getBody();body.spellcheck=false;
      editor.formatter.register('shottoprooflanguage',{inline:'span',attributes:{lang:'%language'},exact:true});
      editor.dom.addStyle('::highlight('+name+'){text-decoration:underline wavy #b32839}::highlight('+name+'-active){background:#ffe6a2;color:#172e45}');
      editor.getDoc().addEventListener('contextmenu',onContextMenu,true);
      editor.getDoc().addEventListener('pointerdown',dismissContext,true);
      if(editor.getDoc()!==outer)outer.addEventListener('pointerdown',dismissContext,true);
      hostWindow.addEventListener('storage',storageChanged);
      inheritDefault();schedule();
    });
    editor.on('SelectionChange mouseup keyup',()=>{if(editor.hasFocus())captureSelection();});
    editor.on('input change',schedule);
    editor.on('SetContent Undo Redo',()=>{if(panel?.classList.contains('sp-context'))close();selection=null;ignored=new WeakMap();inheritDefault();schedule();});
    editor.on('remove',()=>{clearTimeout(timer);if(panel)close();const reg=editor.getWin()?.CSS?.highlights;reg?.delete(name);reg?.delete(name+'-active');editor.getDoc()?.removeEventListener('contextmenu',onContextMenu,true);editor.getDoc()?.removeEventListener('pointerdown',dismissContext,true);outer.removeEventListener('pointerdown',dismissContext,true);hostWindow.removeEventListener('storage',storageChanged);});
    const api={open:()=>open(),getLanguage:()=>docLanguage};
    editor.shottoSpelling=api;return api;
  }
  tinymce.PluginManager.add('shotto_proofing', install);
})();
