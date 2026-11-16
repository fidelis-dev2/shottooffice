/* The page keeps portable, printable equation markup. MathLive edits exactly the
   equation under the pointer, in a field aligned to its location on the page. */
(function () {
  'use strict';
  function install(editor) {
    if (editor.shottoInline) return editor.shottoInline;
    let current = null, frameRequest = 0, pressed = null;
    const outerDoc = editor.getElement().ownerDocument;
    const win = outerDoc.defaultView;
    const disposers = [];

    function listen(node, event, handler, options) {
      node.addEventListener(event, handler, options);
      disposers.push(()=>node.removeEventListener(event, handler, options));
    }
    function addStyles() {
      if (outerDoc.getElementById('shotto-inline-style')) return;
      const style=outerDoc.createElement('style');
      style.id='shotto-inline-style';
      style.textContent=`
        .si-field{position:fixed;z-index:1500;display:inline-block;box-sizing:border-box;max-width:calc(100vw - 16px);min-width:28px;min-height:22px;padding:0 3px;margin:0;border:1px solid #4482c9;border-radius:4px;background:#fff;color:#152f4d;line-height:normal;box-shadow:0 0 0 2px #dcecff;overflow-x:auto}
        .si-field[hidden],.si-tools[hidden]{display:none!important}
        .si-field::part(container){padding:0}.si-field::part(menu-toggle),.si-field::part(virtual-keyboard-toggle){display:none}
        .si-tools{position:fixed;z-index:1501;display:flex;align-items:center;gap:3px;max-width:calc(100vw - 12px);overflow:auto;padding:4px;border-radius:6px;border:1px solid #b5c6d8;background:#fff;box-shadow:0 3px 10px #18304426;font:13px "Segoe UI",Arial,sans-serif}
        .si-tools button{border:1px solid #d7e0ea;border-radius:4px;background:white;color:#16385b;padding:4px 7px;cursor:pointer;white-space:nowrap;font:inherit}
        .si-tools button:hover,.si-tools button:focus-visible{background:#e6f1ff}.si-tools button:last-child{background:#15569a;color:white}
        @media print{.si-tools,.si-field{display:none!important}}`;
      outerDoc.head.append(style);
    }
    // Translate an editor-viewport rectangle to the document hosting the toolbar.
    function toHostRect(rect) {
      const frame=editor.iframeElement;
      if(!frame)return {left:rect.left,top:rect.top,width:rect.width,height:rect.height};
      const view=frame.getBoundingClientRect();
      const sx=view.width/(frame.offsetWidth || view.width || 1),sy=view.height/(frame.offsetHeight || view.height || 1);
      return {left:view.left+(frame.clientLeft+rect.left)*sx,top:view.top+(frame.clientTop+rect.top)*sy,width:rect.width*sx,height:rect.height*sy};
    }
    function locate() {
      if(!current)return;
      const {node,field,tools}=current;
      if(!node.isConnected){finish(false);return;}
      const rect=toHostRect(node.getBoundingClientRect());
      const frame=editor.iframeElement?.getBoundingClientRect();
      const top=Math.max(0,frame?.top ?? 0),bottom=Math.min(win.innerHeight,frame?.bottom ?? win.innerHeight);
      const hidden=rect.top+rect.height<=top || rect.top>=bottom;
      field.hidden=tools.hidden=hidden;
      if(hidden)return;
      const x=Math.max(4,Math.min(win.innerWidth-field.offsetWidth-4,rect.left-4));
      field.style.left=x+'px';
      const y=rect.top+(rect.height-field.offsetHeight)/2;
      field.style.top=y+'px';
      tools.style.left=Math.max(4,Math.min(win.innerWidth-tools.offsetWidth-5,x))+'px';
      const below=y+field.offsetHeight+6;
      tools.style.top=(below+tools.offsetHeight<=bottom || y-tools.offsetHeight<top?below:y-tools.offsetHeight-6)+'px';
    }
    function schedulePosition() {
      win.cancelAnimationFrame(frameRequest);frameRequest=win.requestAnimationFrame(locate);
    }
    function sync() {
      if(!current || !current.node.isConnected)return;
      const {node,field}=current, value=field.value;
      if(node.getAttribute('data-latex')===value)return;
      editor.undoManager.ignore(()=>{
        node.setAttribute('data-latex',value);
        node.removeAttribute('data-shotto-fields');
        node.innerHTML=window.ShottoMath.renderLatex(value || '\\square');
      });
      current.changed=true;
      editor.setDirty(true);
      editor.dispatch('input');schedulePosition();
    }
    function finish(focusAfter=false, discard=false) {
      if(!current)return;
      if(!discard)sync();
      const {node,field,tools,observer,changed}=current;
      current=null;
      observer?.disconnect();
      field.remove();tools.remove();
      if(!discard && changed && node.isConnected){editor.undoManager.add();editor.dispatch('change');}
      if(focusAfter && node.isConnected){
        editor.focus();
        let next=node.nextSibling;
        if(!next || next.nodeType!==3){
          next=node.ownerDocument.createTextNode('\u00a0');
          node.after(next);
        }
        editor.selection.setCursorLocation(next,next.data.startsWith('\u00a0')?1:0);
        editor.nodeChanged();
      }
    }
    function selectedLatex() {
      const field=current?.field;
      return field && !field.selectionIsCollapsed ? field.getValue(field.selection,'latex') : '';
    }
    function capture() {
      if(!current)return null;
      return {session:current,selection:JSON.parse(JSON.stringify(current.field.selection)),value:selectedLatex()};
    }
    function insert(latex, bookmark=capture()) {
      if(!bookmark || current!==bookmark.session || !current.node.isConnected)return false;
      const field=current.field;
      field.focus();field.selection=bookmark.selection;
      field.insert(latex,{format:'latex',insertionMode:'replaceSelection',selectionMode:'placeholder',focus:true});
      sync();return true;
    }
    function wrap(kind) {
      const bookmark=capture();if(!bookmark)return;
      const value=bookmark.value || '#?';
      const latex={root:'\\sqrt{'+value+'}',fraction:'\\frac{'+value+'}{#?}',power:'{'+value+'}^{#?}'}[kind];
      insert(latex,bookmark);
    }
    function makeButton(bar,caption,label,action){
      const b=outerDoc.createElement('button');b.type='button';b.textContent=caption;b.setAttribute('aria-label',label);b.title=label;
      b.addEventListener('mousedown',e=>e.preventDefault());b.onclick=action;bar.append(b);
    }
    function chooseAtom(field,hit) {
      // MathLive's public coordinates refer to the live field. Map the pointer
      // through the rendered equation, favouring the exact glyph that was hit.
      const atoms=[];
      const length=field.lastOffset;
      if(length<=1000){
        for(let pos=1;pos<=length;pos++){
          const item=field.getElementInfo(pos);
          if(item?.bounds?.width>0 && item.bounds.height>0 && item.latex)atoms.push({pos,...item});
        }
      }
      const fallback=field.getBoundingClientRect();
      const left=atoms.length?Math.min(...atoms.map(a=>a.bounds.left)):fallback.left;
      const right=atoms.length?Math.max(...atoms.map(a=>a.bounds.right)):fallback.right;
      const top=atoms.length?Math.min(...atoms.map(a=>a.bounds.top)):fallback.top;
      const bottom=atoms.length?Math.max(...atoms.map(a=>a.bounds.bottom)):fallback.bottom;
      const x=left+hit.x*(right-left),y=top+hit.y*(bottom-top);
      const matching=hit.glyph?atoms.filter(a=>a.latex===hit.glyph):[];
      if(matching.length){
        const distance=a=>Math.hypot(x-a.bounds.left-a.bounds.width/2,y-a.bounds.top-a.bounds.height/2);
        matching.sort((a,b)=>distance(a)-distance(b));
        const pos=matching[0].pos;
        field.selection={ranges:[[pos-1,pos]]};return;
      }
      const offset=field.getOffsetFromPoint(x,y);
      if(offset>=0)field.position=offset;
    }
    function glyphAtPoint(node,x,y) {
      // A noneditable TinyMCE object can receive events on its wrapper. Text
      // ranges still identify the glyph below the pointer, including in a matrix.
      const doc=node.ownerDocument;
      const walker=doc.createTreeWalker(node,4);
      const range=doc.createRange();
      let text,closest='',best=Infinity;
      while((text=walker.nextNode())){
        range.selectNodeContents(text);
        const rect=range.getBoundingClientRect();
        if(x<rect.left-1 || x>rect.right+1 || y<rect.top-1 || y>rect.bottom+1)continue;
        let start=0;
        for(const char of text.data){
          range.setStart(text,start);start+=char.length;range.setEnd(text,start);
          const r=range.getBoundingClientRect();
          if(!r.width || !char.trim() || x<r.left-1 || x>r.right+1 || y<r.top-1 || y>r.bottom+1)continue;
          const distance=Math.hypot(x-r.left-r.width/2,y-r.top-r.height/2);
          if(distance<best){best=distance;closest=char;}
        }
      }
      return closest;
    }
    function activate(node,event) {
      finish();
      addStyles();
      const rect=node.getBoundingClientRect(), text=event.target?.textContent?.trim() || '';
      const hit={x:Math.max(0,Math.min(1,(event.clientX-rect.left)/Math.max(1,rect.width))),y:Math.max(0,Math.min(1,(event.clientY-rect.top)/Math.max(1,rect.height))),glyph:Array.from(text).length===1?text:glyphAtPoint(node,event.clientX,event.clientY)};
      const field=outerDoc.createElement('math-field'),tools=outerDoc.createElement('div');
      field.className='si-field';field.setAttribute('aria-label','Edit equation on page');field.setAttribute('math-virtual-keyboard-policy','manual');
      field.value=node.getAttribute('data-latex') || '';
      field.style.fontSize=(parseFloat(editor.getWin().getComputedStyle(node).fontSize)*(parseFloat(editor.getBody().style.zoom)||1))+'px';
      tools.className='si-tools';tools.setAttribute('role','toolbar');tools.setAttribute('aria-label','Equation tools');
      makeButton(tools,'√','Square root of selection',()=>wrap('root'));
      makeButton(tools,'a/b','Fraction at selection',()=>wrap('fraction'));
      makeButton(tools,'xⁿ','Power at selection',()=>wrap('power'));
      makeButton(tools,'Formulas','Insert formula at cursor',()=>{
        const api=editor.shottoEquationOwners?.get(node.getAttribute('data-shotto-owner'))||editor.shottoVisual;
        api?.open();
      });
      makeButton(tools,'Done','Finish editing equation',()=>finish(true));
      editor.undoManager.add();
      outerDoc.body.append(field,tools);
      const session={node,field,tools,changed:false,observer:null};current=session;
      field.addEventListener('input',sync);
      field.addEventListener('keydown',e=>{
        if(e.key==='Escape' || (e.key==='Enter' && !e.shiftKey)){e.preventDefault();e.stopPropagation();finish(true);}
      },true);
      locate();field.focus();
      const position=()=>{if(current===session){locate();field.focus();chooseAtom(field,hit);}};
      position();
      // A freshly connected MathLive field needs one paint to expose atom bounds.
      win.requestAnimationFrame(()=>{if(current===session && !session.changed)position();});
      if(win.ResizeObserver){session.observer=new win.ResizeObserver(schedulePosition);session.observer.observe(field);session.observer.observe(node);}
    }
    function contentPointer(e){
      const node=e.target.closest?.('.shotto-equation[data-latex]');
      pressed=null;
      if(!node){finish();return;}
      if(e.button!==0||editor.mode.isReadOnly())return;
      pressed={node,event:e};
      e.preventDefault();e.stopImmediatePropagation();
    }
    editor.on('init',()=>{
      const doc=editor.getDoc();
      listen(editor.getBody(),'pointerdown',contentPointer,true);
      listen(doc,'click',e=>{
        const hit=pressed;pressed=null;
        if(!hit || !hit.node.contains(e.target))return;
        e.preventDefault();e.stopImmediatePropagation();
        activate(hit.node,hit.event);
      },true);
      listen(doc,'dblclick',e=>{if(e.target.closest?.('.shotto-equation')){e.preventDefault();e.stopImmediatePropagation();}},true);
      listen(doc,'scroll',schedulePosition,true);
      listen(win,'scroll',schedulePosition,true);listen(win,'resize',schedulePosition);
      listen(outerDoc,'pointerdown',e=>{
        if(!current || current.field.contains(e.target) || current.tools.contains(e.target))return;
        if(e.target.closest?.('.sv-dialog,.shotto-tools-dialog,.shotto-ribbon,.tox-toolbar,.tox-toolbar__primary,.tox-toolbar__overflow,.tox-menu'))return;
        if(doc!==outerDoc || !editor.getBody().contains(e.target))finish();
      },true);
    });
    editor.on('Undo Redo SetContent',()=>finish(false,true));
    editor.on('ShottoZoom ResizeEditor',schedulePosition);
    editor.on('remove',()=>{finish(false,true);win.cancelAnimationFrame(frameRequest);disposers.forEach(dispose=>dispose());});
    const api={capture,insert,finish,isActive:()=>!!current,focus:()=>current?.field.focus()};
    editor.shottoInline=api;return api;
  }
  window.ShottoInlineEquations={install};
})();
