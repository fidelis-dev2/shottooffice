/* Visual equation authoring for Shotto Office and exported TinyMCE 6 plugins. */
(function () {
  'use strict';
  const css = `
    .sv-dialog,.sp-preview {padding:0;border:1px solid #bdc9d8;border-radius:12px;background:white;color:#203247;box-shadow:0 20px 70px #20324740;font:14px/1.45 "Segoe UI",Arial,sans-serif}
    .sv-dialog::backdrop,.sp-preview::backdrop {background:#182a4057}
    .sv-dialog {width:min(1060px,96vw);max-width:96vw;max-height:92vh;overflow:auto}
    .sv-dialog *,.sp-preview * {box-sizing:border-box}
    .sv-top,.sv-foot {display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 18px}
    .sv-top {border-bottom:1px solid #dce3eb}.sv-top h2{font:600 19px/1.2 "Segoe UI",Arial;margin:0}
    .sv-dialog button,.sp-preview button {font:inherit;color:#24374b;cursor:pointer;background:white;border:1px solid #b9c6d5;border-radius:5px;padding:5px 10px}
    .sv-dialog button:hover,.sv-dialog button[aria-pressed=true]{background:#eaf3ff;border-color:#719bd2}
    .sv-dialog :focus-visible {outline:2px solid #2369b7;outline-offset:2px}
    .sv-body {display:grid;grid-template-columns:minmax(260px,0.95fr) minmax(320px,1.2fr);min-height:350px}
    .sv-library,.sv-work{padding:15px 18px;min-width:0}.sv-library{border-right:1px solid #dce3eb;background:#f6f8fb}
    .sv-filters {display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap}.sv-filters input,.sv-filters select,.sv-save-row input{height:33px;min-width:0;border:1px solid #b9c6d5;border-radius:5px;background:white;padding:5px 8px;font:inherit;color:inherit}
    .sv-filters input,.sv-filters select{flex:1 1 140px}.sv-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(116px,1fr));align-content:start;gap:7px;max-height:44vh;overflow:auto;padding:2px}
    .sv-cards .sv-card{display:grid;align-content:center;gap:6px;min-height:71px;padding:7px 4px;overflow:hidden}.sv-card .sv-sign{font-size:15px;overflow:hidden;line-height:1.2}.sv-card small{font-size:11px;line-height:1.2}
    .sv-work h3{margin:0 0 10px;font:600 16px "Segoe UI",Arial}.sv-fields{display:grid;gap:8px;grid-template-columns:repeat(2,minmax(0,1fr))}
    .sv-fields.sv-one{grid-template-columns:1fr}.sv-fields.sv-three{grid-template-columns:repeat(3,minmax(0,1fr))}
    .sv-fields label{font-size:12px;color:#42546b;min-width:0}.sv-fields math-field{display:block;min-height:36px;max-width:100%;font-size:19px;border:1px solid #adbccc;border-radius:5px;background:white;padding:1px 4px;color:#172a42;overflow-x:auto}
    .sv-fields math-field:focus-within{border-color:#2469b5;box-shadow:0 0 0 1px #2469b5}
    .sv-fields math-field::part(menu-toggle),.sv-fields math-field::part(virtual-keyboard-toggle){display:none}
    .sv-fields.sv-fraction{grid-template-columns:minmax(100px,200px);justify-content:center;gap:4px}.sv-fraction label:first-child{border-bottom:2px solid #334765;padding-bottom:6px}
    .sv-live{padding:15px 12px;margin:13px 0;min-height:65px;display:grid;align-items:center;overflow:auto;text-align:center;font-size:23px;background:#f3f7fc;border:1px solid #d8e3ef;border-radius:6px}
    .sv-keys {display:flex;gap:4px;flex-wrap:wrap}.sv-keys button{min-width:30px;padding:3px 6px;font:18px Georgia,serif}
    .sv-save-row{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px}.sv-save-row input{flex:1 1 140px}
    .sv-foot{border-top:1px solid #dce3eb}.sv-message{font-size:12px;color:#415970;flex:1}.sv-dialog .sv-primary,.sp-preview .sv-primary{background:#175ba5;color:white;border-color:#175ba5}
    .sv-dialog .sv-primary:hover{background:#124b88}.sv-ribbon-picks{display:flex;flex-wrap:wrap;gap:4px;max-width:690px}
    .sv-ribbon-picks button{display:flex;flex-direction:column;align-items:center;justify-content:center;min-width:65px;height:55px;gap:3px;background:white;border:1px solid #ccd4dd;border-radius:4px;color:#263a50;cursor:pointer}.sv-ribbon-picks button:hover{background:#eaf3ff}
    .sv-ribbon-picks button span{font:20px Georgia,serif}.sv-ribbon-picks small{font:10px "Segoe UI",Arial}
    @media(max-width:700px){.sv-body{display:block;min-height:0}.sv-library{border-right:0;border-bottom:1px solid #dce3eb}.sv-cards{max-height:155px}.sv-dialog{max-height:94vh}.sv-library,.sv-work{padding:10px}.sv-foot{position:sticky;bottom:0;background:white}.sv-top{padding:10px}}
  `;
  function style(doc, id, text) {
    if (!text || doc.getElementById(id)) return;
    const sheet = doc.createElement('style');
    sheet.id = id;
    sheet.textContent = text;
    doc.head.append(sheet);
  }
  function addStyles() {
    style(document, 'shotto-visual-ui', css);
    style(document, 'shotto-visual-mathfonts', window.ShottoFreeMathCSS);
  }
  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function button(text, action, className) {
    const node = element('button', className, text);
    node.type = 'button';
    node.addEventListener('click', action);
    return node;
  }
  function interpolate(item, values) {
    return item.pattern.replace(/@(\d+)/g, (_, n) => values[Number(n)-1] || '\\square');
  }
  function readSaved(key) {
    try {
      const rows = JSON.parse(localStorage.getItem(key) || '[]');
      return Array.isArray(rows) ? rows.filter(row=>typeof row?.label==='string' && typeof row.latex==='string').slice(0,100) : [];
    } catch { return []; }
  }
  function configure(editor, groups, presets = [], storeKey = 'shotto:formulas:v3', owner = 'shotto_math') {
    const all = groups.flatMap(group => group.items.map(item=>({...item,group:group.id})));
    const index = new Map(all.map(item=>[item.id,item]));
    const inline=window.ShottoInlineEquations?.install(editor);
    let openDialog;
    editor.on('init', () => style(editor.getDoc(), 'shotto-visual-output', window.ShottoFreeMathCSS));
    editor.on('remove', () => openDialog?.close());
    function open(options = {}) {
      if (openDialog?.open) return;
      addStyles();
      const target = options.target;
      const nesting=!target && inline?.capture();
      let prior = {};
      try { prior = JSON.parse(decodeURIComponent(target?.getAttribute('data-shotto-fields') || '')); } catch {}
      const bookmark = editor.selection.getBookmark(2,true);
      const dialog = element('dialog','sv-dialog');
      openDialog = dialog;
      dialog.setAttribute('aria-label','Visual equation editor');
      const heading = element('div','sv-top');
      heading.append(element('h2','',nesting?'Insert inside equation':'Mathematics'),button('Close',()=>dialog.close()));
      const body = element('div','sv-body'), lib = element('section','sv-library'), work = element('section','sv-work');
      const filters = element('div','sv-filters'), search = element('input'), category = element('select');
      search.type = 'search'; search.placeholder = 'Search formulas'; search.setAttribute('aria-label','Search formulas');
      category.setAttribute('aria-label','Formula category');
      category.append(new Option('All formulas','all'), ...groups.map(g=>new Option(g.label,g.id)), new Option('My formulas · Zangu','saved'));
      category.value = options.group || 'all';
      filters.append(search,category);
      const cards = element('div','sv-cards');lib.append(filters,cards);
      const sub = element('h3'), fields = element('div','sv-fields'), keys = element('div','sv-keys');
      const live = element('div','sv-live');live.setAttribute('aria-label','Equation preview');
      const saveRow = element('div','sv-save-row'), name = element('input');
      name.placeholder = 'Formula name'; name.setAttribute('aria-label','Formula name');
      const status = element('span','sv-message');status.setAttribute('role','status');
      const save = button('Save to My formulas',storeFormula);
      saveRow.append(name,save);
      work.append(sub,fields,live,keys,saveRow);
      body.append(lib,work);
      const foot=element('div','sv-foot');
      foot.append(status,button('New formula',()=>edit(null,[''])),button(nesting?'Insert at cursor':target?'Update equation':'Insert equation',commit,'sv-primary'));
      dialog.append(heading,body,foot);
      document.body.append(dialog);
      let current = null, activeField, inputs = [], finished = false;
      const savedRows = ()=>[...presets,...readSaved(storeKey)];
      function latex() {
        const values = inputs.map(input=>input.value.trim());
        return current ? interpolate(current,values) : values[0] || '';
      }
      function preview() {
        const content=latex();
        live.innerHTML=content ? window.ShottoMath.renderLatex(content) : '';
        status.textContent='';
      }
      function edit(item, initial) {
        current=item;inputs=[];activeField=null;fields.replaceChildren();
        const specs=item ? item.fields : [{name:'Equation · Andika au chagua alama',value:''}];
        sub.textContent=item?.label || 'Compose a formula';
        fields.className='sv-fields '+(item?.id==='fraction'?'sv-fraction':item?.id==='matrix3'?'sv-three':specs.length===1?'sv-one':'');
        specs.forEach((spec,i)=>{
          const label=element('label','',spec.name), input=element('math-field');
          input.setAttribute('aria-label',spec.name);
          input.setAttribute('math-virtual-keyboard-policy','manual');
          input.setAttribute('smart-mode','false');
          input.value=initial?.[i] ?? ((i===0 && nesting?.value) || (item?.id==='fraction' ? '' : spec.value));
          input.setAttribute('placeholder',spec.value || '□');
          input.addEventListener('focusin',()=>{activeField=input;});
          input.addEventListener('input',preview);
          label.append(input);fields.append(label);inputs.push(input);
        });
        activeField=inputs[0];
        name.value='';
        drawCards();
        preview();
      }
      function drawCards() {
        cards.replaceChildren();
        const term=search.value.toLocaleLowerCase().trim();
        let rows=category.value==='saved'?savedRows().map(r=>({label:r.label,latex:r.latex,saved:true})):all;
        rows.filter(row=>(category.value==='all'||category.value==='saved'||row.group===category.value) &&
          (row.label+' '+(groups.find(g=>g.id===row.group)?.label||'')).toLocaleLowerCase().includes(term)).forEach(row=>{
          const card=button('',()=>{edit(row.saved?null:row,row.saved?[row.latex]:undefined);},'sv-card');
          const sign=element('span','sv-sign');sign.setAttribute('aria-hidden','true');
          sign.innerHTML=window.ShottoMath.renderLatex(row.saved?row.latex:interpolate(row,row.fields.map(f=>f.value)));
          card.setAttribute('aria-label',row.label);card.title=row.label;
          card.setAttribute('aria-pressed',String(!!current && row.id===current.id));
          card.append(sign,element('small','',row.label));cards.append(card);
        });
        if (!cards.children.length) cards.append(element('p','',category.value==='saved'?'Save a formula using the name field.':'No matching formulas.'));
      }
      function storeFormula() {
        const label=name.value.trim(),value=latex();
        if(!label||!value||inputs.some(i=>!i.value.trim())){status.textContent='Complete your formula and enter a name.';return;}
        const mine=readSaved(storeKey).filter(row=>row.label!==label);
        try {
          localStorage.setItem(storeKey,JSON.stringify([{label:label.slice(0,80),latex:value},...mine].slice(0,100)));
          status.textContent='Saved in My formulas.';drawCards();
        } catch {status.textContent='Browser storage is unavailable.';}
      }
      function commit() {
        const value=latex();
        if (!value || inputs.some(i=>!i.value.trim())) {status.textContent='Fill in each equation box.';return;}
        if(value.length>5000){status.textContent='The equation exceeds 5,000 characters.';return;}
        if(nesting){
          if(nesting.session!==inline.capture()?.session){status.textContent='The equation has changed. Close and select it again.';return;}
          finished=true;dialog.close();inline.insert(value,nesting);return;
        }
        const wrapper=element('span','shotto-equation');
        wrapper.contentEditable='false';wrapper.setAttribute('data-latex',value);wrapper.setAttribute('data-shotto-owner',owner);
        if(current)wrapper.setAttribute('data-shotto-fields',encodeURIComponent(JSON.stringify({id:current.id,values:inputs.map(i=>i.value)})));
        wrapper.innerHTML=window.ShottoMath.renderLatex(value);
        finished=true;dialog.close();editor.focus();
        editor.undoManager.transact(()=>{
          if(target?.isConnected) editor.dom.setOuterHTML(target,wrapper.outerHTML);
          else {if(bookmark)editor.selection.moveToBookmark(bookmark);editor.insertContent(wrapper.outerHTML+'&nbsp;');}
        });
        editor.nodeChanged();editor.dispatch('change');
      }
      const tools=[['a/b','\\frac{#?}{#?}'],['√','\\sqrt{#?}'],['x²','^{#?}'],['xᵢ','_{#?}'],['( )','\\left(#?\\right)'],['π','\\pi'],['θ','\\theta'],['±','\\pm'],['×','\\times'],['≤','\\le'],['≥','\\ge'],['∞','\\infty'],['∫','\\int_{#?}^{#?}'],['∑','\\sum_{#?}^{#?}']];
      tools.forEach(([glyph,pattern])=>{
        const key=button(glyph,()=>{
          if(!activeField)return;activeField.focus();activeField.insert(pattern,{selectionMode:'placeholder',format:'latex'});preview();
        });key.addEventListener('mousedown',e=>e.preventDefault());keys.append(key);
      });
      const next=button('Next box',()=>{
        if(!activeField)return;
        if(inputs.length>1)inputs[(inputs.indexOf(activeField)+1)%inputs.length].focus();
        else{activeField.focus();activeField.executeCommand('moveToNextPlaceholder');}
      });keys.append(next);
      category.onchange=drawCards;search.oninput=drawCards;
      dialog.addEventListener('close',()=>{dialog.remove();if(openDialog===dialog)openDialog=null;if(!finished && !editor.removed){if(nesting)inline.focus();else editor.focus();}},{once:true});
      dialog.showModal();
      const restored=index.get(prior?.id);
      if(target){
        if(restored && Array.isArray(prior.values) && prior.values.length===restored.fields.length) edit(restored,prior.values);
        else edit(null,[target.getAttribute('data-latex')||'']);
      }else if(options.group==='saved')edit(null,['']);
      else edit(index.get(options.id)||all.find(item=>item.group===options.group)||all[0]||null);
    }
    const api={ open, groups, saved:()=>readSaved(storeKey) };
    editor.shottoEquationOwners ||= new Map();
    editor.shottoEquationOwners.set(owner,api);
    return api;
  }
  window.ShottoVisual={configure,addStyles,readSaved};
})();
