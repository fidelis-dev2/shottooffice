/* Shotto Free Drawing — MIT; Copyright (c) 2026 COHEMA */
(function(){
"use strict";
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;", "'":"&#39;"}[c]));

const categories={"Lines": ["line", "arrow", "doubleArrow", "elbow", "curve", "connector", "scribble"], "Rectangles": ["rect", "roundRect", "snipRect", "roundSingle", "parallelogram", "trapezoid"], "Basic shapes": ["text", "ellipse", "triangle", "rightTriangle", "diamond", "pentagon", "hexagon", "octagon", "plus", "cross", "bracket", "brace", "arc", "pie", "heart", "lightning", "sun", "moon", "cloud"], "Block arrows": ["rightArrow", "leftArrow", "upArrow", "downArrow", "leftRightArrow", "upDownArrow", "chevron", "uTurnArrow", "bentArrow"], "Flowchart": ["flowProcess", "flowDecision", "flowData", "flowDocument", "flowTerminator", "flowDatabase", "flowPreparation", "flowConnector"], "Callouts": ["calloutRect", "calloutRound", "calloutOval"], "Stars and banners": ["star4", "star5", "star8", "ribbon", "wavyBanner"]};
const geometry={"line": "<path d=\"M4 22L28 4\"/>", "arrow": "<path d=\"M3 22L27 4M17 4h10v10\"/>", "doubleArrow": "<path d=\"M3 13h26M3 13l6-6m-6 6 6 6m20-6-6-6m6 6-6 6\"/>", "elbow": "<path d=\"M4 23V7h22M20 3l6 4-6 4\"/>", "curve": "<path d=\"M4 23C7 2 23 2 28 13\"/>", "connector": "<path d=\"M4 22V8h23M22 4l5 4-5 4\"/>", "rect": "<rect x=\"4\" y=\"5\" width=\"24\" height=\"18\"/>", "roundRect": "<rect x=\"4\" y=\"5\" width=\"24\" height=\"18\" rx=\"5\"/>", "snipRect": "<path d=\"M9 5h19v18H4V10z\"/>", "roundSingle": "<path d=\"M4 5h19a5 5 0 0 1 5 5v13H4z\"/>", "parallelogram": "<path d=\"M10 5h19l-6 18H4z\"/>", "trapezoid": "<path d=\"M9 5h14l6 18H3z\"/>", "ellipse": "<ellipse cx=\"16\" cy=\"14\" rx=\"12\" ry=\"9\"/>", "triangle": "<path d=\"M16 4L29 24H3z\"/>", "rightTriangle": "<path d=\"M4 4v20h24z\"/>", "diamond": "<path d=\"M16 3L29 14 16 25 3 14z\"/>", "pentagon": "<path d=\"M16 3l13 9-5 13H8L3 12z\"/>", "hexagon": "<path d=\"M9 4h14l7 10-7 10H9L2 14z\"/>", "octagon": "<path d=\"M10 3h12l7 8v8l-7 8H10l-7-8v-8z\"/>", "plus": "<path d=\"M13 3h6v8h8v6h-8v8h-6v-8H5v-6h8z\"/>", "cross": "<path d=\"M5 5l22 18M27 5L5 23\"/>", "bracket": "<path d=\"M12 4H5v20h7M20 4h7v20h-7\"/>", "brace": "<path d=\"M13 3c-5 0-2 8-7 11 5 3 2 11 7 11m6-22c5 0 2 8 7 11-5 3-2 11-7 11\"/>", "arc": "<path d=\"M4 23A12 12 0 0 1 28 23\"/>", "pie": "<path d=\"M16 3v11h13A13 13 0 1 1 16 3z\"/>", "heart": "<path d=\"M16 25S3 17 3 9a6 6 0 0 1 13-3 6 6 0 0 1 13 3c0 8-13 16-13 16z\"/>", "lightning": "<path d=\"M18 2L6 16h9l-2 11 12-16h-9z\"/>", "sun": "<circle cx=\"16\" cy=\"14\" r=\"6\"/><path d=\"M16 1v5m0 16v5M3 14h5m16 0h5M6 4l4 4m12 12 4 4m0-20-4 4M10 20l-4 4\"/>", "moon": "<path d=\"M25 18A12 12 0 0 1 12 4a12 12 0 1 0 13 14z\"/>", "cloud": "<path d=\"M8 22h15a6 6 0 0 0 0-12 8 8 0 0 0-15-1 6 6 0 0 0 0 13z\"/>", "rightArrow": "<path d=\"M3 9h16V3l10 11-10 11v-6H3z\"/>", "leftArrow": "<path d=\"M29 9H13V3L3 14l10 11v-6h16z\"/>", "upArrow": "<path d=\"M10 27V11H3L16 2l13 9h-7v16z\"/>", "downArrow": "<path d=\"M10 2v16H3l13 9 13-9h-7V2z\"/>", "leftRightArrow": "<path d=\"M10 5L2 14l8 9v-6h12v6l8-9-8-9v6H10z\"/>", "upDownArrow": "<path d=\"M16 2l-9 9h6v6H7l9 9 9-9h-6v-6h6z\"/>", "chevron": "<path d=\"M4 4h11l13 10-13 10H4l13-10z\"/>", "uTurnArrow": "<path d=\"M27 24V14H10V7L2 14l8 7v-4h12v7z\"/>", "bentArrow": "<path d=\"M4 25V8h15V3l9 9-9 9v-5H10v9z\"/>", "flowProcess": "<rect x=\"4\" y=\"5\" width=\"24\" height=\"18\"/>", "flowDecision": "<path d=\"M16 3L30 14 16 25 2 14z\"/>", "flowData": "<path d=\"M9 5h20l-7 18H2z\"/>", "flowDocument": "<path d=\"M4 4h24v16q-6 7-12 0-6 7-12 0z\"/>", "flowTerminator": "<rect x=\"3\" y=\"6\" width=\"26\" height=\"16\" rx=\"8\"/>", "flowDatabase": "<path d=\"M4 7c0-5 24-5 24 0v14c0 5-24 5-24 0zM4 7c0 5 24 5 24 0M4 14c0 5 24 5 24 0\"/>", "flowPreparation": "<path d=\"M9 5h14l6 9-6 9H9l-6-9z\"/>", "flowConnector": "<circle cx=\"16\" cy=\"14\" r=\"10\"/>", "calloutRect": "<path d=\"M4 4h24v15H16l-7 7v-7H4z\"/>", "calloutRound": "<path d=\"M10 4h12a6 6 0 0 1 6 6v6a6 6 0 0 1-6 6h-5l-7 5v-5a6 6 0 0 1-6-6v-6a6 6 0 0 1 6-6z\"/>", "calloutOval": "<path d=\"M16 3c8 0 13 4 13 10s-5 10-13 10q-4 0-7-2l-5 5 1-9q-2-2-2-4c0-6 5-10 13-10z\"/>", "star4": "<path d=\"M16 2l4 10 10 2-10 3-4 9-4-9-10-3 10-2z\"/>", "star5": "<path d=\"M16 2l4 9 10 1-8 7 2 10-8-5-8 5 2-10-8-7 10-1z\"/>", "star8": "<path d=\"M16 1l4 8 8-4-4 8 8 4-8 4 4 8-8-4-4 8-4-8-8 4 4-8-8-4 8-4-4-8 8 4z\"/>", "ribbon": "<path d=\"M3 5h26v15H3zM8 20l-3 8 11-5 11 5-3-8\"/>", "wavyBanner": "<path d=\"M3 6q7 4 13 0t13 0v14q-7-4-13 0T3 20z\"/>"};
const shapeName = k => k.replace(/([a-z])([A-Z])/g,'$1 $2').replace(/^./,c=>c.toUpperCase());
function shapeSVG(o, icon=false) {
 const id='g'+String(o.id||'icon').replace(/[^a-z0-9]/gi,'');
 let path=geometry[o.kind]||geometry.rect;
 if(o.kind==='text')path='<rect x="0.5" y="0.5" width="31" height="27"/>';
 if(o.kind==='roundRect')path=`<rect x="1" y="1" width="30" height="26" rx="${Number(o.radius)||0}"/>`;
 if(o.kind==='scribble')path=`<polyline points="${(o.points||[]).map(p=>p.map(Number).join(',')).join(' ')}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
 if(o.kind==='rightArrow'){const neck=32*(1-(Number(o.adjust)||.35));path=`<path d="M.5 8h${neck-.5}V.5L31.5 14 ${neck} 27.5v-7H.5z"/>`;}
 if(o.kind==='leftArrow'){const neck=32*(Number(o.adjust)||.35);path=`<path d="M31.5 8H${neck}V.5L.5 14 ${neck} 27.5v-7h${31.5-neck}z"/>`;}
 const line=['line','arrow','doubleArrow','elbow','curve','connector','scribble','cross','arc','brace','bracket','sun'].includes(o.kind);
 const fill=line||o.transparent?'none':o.gradient?`url(#${id})`:esc(o.fill||'#e7f1ff');
 const stroke=esc(o.stroke||'#17617d'),width=icon?1.4:Math.max(0,(o.strokeWidth??2)*32/(o.w||180));
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 28" preserveAspectRatio="none" width="${icon?32:o.w||180}" height="${icon?28:o.h||120}" aria-hidden="true"><defs><linearGradient id="${id}" x2="1" y2="1"><stop stop-color="${esc(o.fill||'#17617d')}"/><stop offset="1" stop-color="${esc(o.fill2||'#a8e3d0')}"/></linearGradient></defs><g fill="${fill}" stroke="${stroke}" stroke-width="${width}" stroke-dasharray="${o.dash==='dash'?'2 1':o.dash==='dot'?'.4 1':'none'}">${path}</g></svg>`;
}

Object.assign(geometry,{
 rect:'<rect x=".5" y=".5" width="31" height="27"/>',
 roundRect:'<rect x=".5" y=".5" width="31" height="27" rx="4"/>',
 ellipse:'<ellipse cx="16" cy="14" rx="15.5" ry="13.5"/>',
 text:'<rect x=".5" y=".5" width="31" height="27"/>',
 minus:'<path d="M3 11h26v6H3z"/>',multiply:'<path d="M7 3l9 8 9-8 4 4-9 7 9 7-4 4-9-8-9 8-4-4 9-7-9-7z"/>',
 divide:'<circle cx="16" cy="5" r="3"/><path d="M3 12h26v4H3z"/><circle cx="16" cy="23" r="3"/>',
 equal:'<path d="M3 7h26v4H3zM3 18h26v4H3z"/>',
 notEqual:'<path d="M3 7h26v4H3zM3 18h26v4H3zM23 2L9 26"/>',
 cube:'<path d="M3 8L12 2h17v19l-9 5H3zM3 8h17l9-6M20 8v18"/>',
 cylinder:'<path d="M3 6c0-6 26-6 26 0v16c0 6-26 6-26 0zM3 6c0 6 26 6 26 0"/>',
 smile:'<circle cx="16" cy="14" r="13"/><path d="M8 16q8 13 16 0" fill="none"/><circle cx="11" cy="10" r="1"/><circle cx="21" cy="10" r="1"/>',
 donut:'<path fill-rule="evenodd" d="M16 1a13 13 0 1 1 0 26 13 13 0 1 1 0-26m0 6a7 7 0 1 0 0 14 7 7 0 1 0 0-14"/>',
 rightTriangle:'<path d="M1 1v26h30z"/>',triangle:'<path d="M16 1L31 27H1z"/>',diamond:'<path d="M16 .5L31.5 14 16 27.5.5 14z"/>'
});
categories['Basic shapes'].push('cube','cylinder','smile','donut');
categories['Equation shapes']=['plus','minus','multiply','divide','equal','notEqual'];
tinymce.PluginManager.add('shotto_drawing',function(editor){
 let selected=null,overlay=null,drag=null,sequence=0,updateQueue=Promise.resolve();
 const report=e=>editor.notificationManager.open({type:'error',text:e.message||'Drawing could not be changed.'});
 const safe=fn=>()=>Promise.resolve().then(fn).catch(report);
 const read=n=>{try{return JSON.parse(decodeURIComponent(n?.getAttribute('data-shotto-object')||''));}catch{return {};}};
 const clamp=(v,a,b,f=a)=>Number.isFinite(Number(v))?Math.max(a,Math.min(b,Number(v))):f;
 const color=(v,f)=>/^#[0-9a-f]{6}$/i.test(v)?v:f;
 const pageOf=n=>n?.closest?.('[data-shotto-page]')||editor.getBody();
 const zoom=()=>parseFloat(editor.getBody().style.zoom)||1;
 const inDocument=n=>!!n && editor.getBody()?.contains(n) && !n.closest('[data-mce-bogus="all"]');
 const current=()=>inDocument(selected)?selected:null;
 const objects=()=>Array.from(editor.getBody().querySelectorAll('[data-shotto-object]')).filter(inDocument);
 const shapeKinds=()=>Object.values(categories).flat().filter(k=>k!=='scribble');
 const defaults=(kind)=>({id:'shape-'+Date.now()+'-'+(++sequence),kind,w:kind==='text'?240:180,h:kind==='text'?70:120,fill:'#4472c4',stroke:'#2f528f',strokeWidth:1.5,text:kind==='text'?'Your text':'',textColor:'#172b4d',fontSize:16,align:'center',rotation:0,radius:4,transparent:kind==='text',wrap:'inline',z:10,x:30,y:30});
 function normalize(o){const d={...defaults(o.kind),...o};d.w=clamp(d.w,20,1800,180);d.h=clamp(d.h,15,1800,120);d.rotation=clamp(d.rotation,-360,360,0);d.strokeWidth=clamp(d.strokeWidth,0,20,1.5);d.fontSize=clamp(d.fontSize,8,120,16);d.fill=color(d.fill,'#4472c4');d.stroke=color(d.stroke,'#2f528f');d.textColor=color(d.textColor,'#172b4d');d.text=String(d.text||'').slice(0,5000);d.x=clamp(d.x,-500,5000,0);d.y=clamp(d.y,0,100000,0);d.z=clamp(d.z,0,999,10);if(!['inline','square-left','square-right','top-bottom','front','behind'].includes(d.wrap))d.wrap='inline';return d;}
 function remember(n,o){n.setAttribute('data-shotto-object',encodeURIComponent(JSON.stringify(o)));}
 async function rasterize(svg,w,h){const image=new Image(),uri=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));try{await new Promise((r,j)=>{image.onload=r;image.onerror=()=>j(Error('The shape could not render.'));image.src=uri;});const c=document.createElement('canvas');c.width=Math.round(w*2);c.height=Math.round(h*2);c.getContext('2d').drawImage(image,0,0,c.width,c.height);return c.toDataURL('image/png');}finally{URL.revokeObjectURL(uri);}}
 function findAnchor(page,id){return Array.from(page.querySelectorAll('[data-shotto-anchor]')).find(node=>node.dataset.shottoAnchor===id);}
 function floatOnPage(node,page){
  if(node.parentNode===page)return;
  const anchor=editor.getDoc().createElement('span');
  anchor.dataset.shottoAnchor=node.id;anchor.setAttribute('aria-hidden','true');anchor.style.display='none';anchor.textContent='\u2060';
  node.before(anchor);page.append(node);
 }
 function returnToText(node,page){
  const anchor=findAnchor(page,node.id);
  if(anchor){anchor.replaceWith(node);return;}
  if(node.parentNode===page){const block=page.querySelector('p,h1,h2,h3');if(block)block.prepend(node);}
 }
 function layout(n,o){
  n.style.cssText=`display:inline-block;position:relative;vertical-align:middle;width:${o.w}px;height:${o.h}px;max-width:none;transform:rotate(${o.rotation}deg) scale(${o.flipH?-1:1},${o.flipV?-1:1});transform-origin:center;box-sizing:border-box;margin:5px;cursor:move;user-select:none;touch-action:none;z-index:${o.z};${o.shadow?'filter:drop-shadow(3px 4px 3px #0005);':''}`;
  if(o.wrap==='square-left'||o.wrap==='square-right'){n.style.float=o.wrap==='square-left'?'left':'right';n.style.margin='8px 16px 8px 8px';}
  if(o.wrap==='top-bottom'){n.style.display='block';n.style.clear='both';n.style.margin='14px auto';}
  if(o.wrap==='front'||o.wrap==='behind'){n.style.position='absolute';n.style.left=o.x+'px';n.style.top=o.y+'px';n.style.margin='0';n.style.zIndex=o.wrap==='behind'?'-1':String(o.z);}
  const img=n.matches('img')?n:n.querySelector('img');if(img){img.width=o.w;img.height=o.h;img.style.cssText='display:block;width:100%;height:100%;max-width:none;pointer-events:none;';}
  let text=n.querySelector('.shotto-shape-text');
  if(!text && !n.matches('img')){text=n.ownerDocument.createElement('span');text.className='shotto-shape-text';n.append(text);}
  if(text){text.textContent=o.text;text.style.cssText=`position:absolute;inset:8px;display:flex;align-items:center;justify-content:${o.align==='left'?'flex-start':o.align==='right'?'flex-end':'center'};white-space:pre-wrap;overflow-wrap:anywhere;overflow:hidden;text-align:${o.align};font:normal ${o.fontSize}px/1.25 Arial,sans-serif;color:${o.textColor};pointer-events:none;`;}
  n.removeAttribute('data-mce-style');if(img)img.removeAttribute('data-mce-style');if(text)text.removeAttribute('data-mce-style');remember(n,o);
 }
 async function renderNode(n,o){
  if(o.kind==='freehand')return;
  const original=n.getAttribute('data-shotto-object'), png=await rasterize(shapeSVG(o),o.w,o.h);
  if(!inDocument(n)||n.getAttribute('data-shotto-object')!==original)return;
  const img=n.querySelector('img');if(img){img.src=png;img.removeAttribute('data-mce-src');}
 }
 function dispatch(){editor.dispatch('ShottoShapeSelect',{shape:current()?read(selected):null,node:current()});}
 function deselect(){selected=null;overlay?.remove();overlay=null;dispatch();}
 function positionOverlay(){const n=current();if(!n){overlay?.remove();overlay=null;return;}if(!overlay)return;const o=read(n),r=n.getBoundingClientRect(),b=editor.getBody().getBoundingClientRect(),z=zoom();Object.assign(overlay.style,{left:((r.left+r.width/2-b.left)/z-o.w/2)+'px',top:((r.top+r.height/2-b.top)/z-o.h/2)+'px',width:o.w+'px',height:o.h+'px',transform:`rotate(${o.rotation||0}deg)`});let adjust=overlay.querySelector('[data-handle=adjust]');const adjustable=['rightArrow','leftArrow','roundRect'].includes(o.kind);if(adjustable&&!adjust){adjust=editor.getDoc().createElement('button');adjust.type='button';adjust.className='shotto-handle adjust';adjust.dataset.handle='adjust';adjust.setAttribute('aria-label','Adjust shape geometry');adjust.title='Adjust shape geometry';overlay.append(adjust);}if(adjust){adjust.hidden=!adjustable;adjust.style.left=(o.kind==='roundRect'?((o.radius||4)/32*100):o.kind==='leftArrow'?((o.adjust||.35)*100):((1-(o.adjust||.35))*100))+'%';}}
 function select(n){if(!n?.matches?.('[data-shotto-object]')||!inDocument(n))return;selected=n;if(!overlay){const d=editor.getDoc();overlay=d.createElement('div');overlay.className='shotto-selection';overlay.dataset.mceBogus='all';overlay.contentEditable='false';overlay.innerHTML='<span class="shotto-rotation-line"></span><button type="button" class="shotto-handle rotate" data-handle="rotate" aria-label="Rotate shape" title="Rotate shape">↻</button>'+['nw','n','ne','e','se','s','sw','w'].map(k=>`<button type="button" class="shotto-handle ${k}" data-handle="${k}" aria-label="Resize ${k}" title="Resize shape"></button>`).join('');editor.getBody().append(overlay);overlay.addEventListener('pointerdown',startHandle);}
  positionOverlay();dispatch();
 }
 // A selected TinyMCE object can have a temporary copy outside the visible document.
 // Keep a live insertion range in the document, independent of that object selection.
 let insertQueue=Promise.resolve(), pendingPoint=null;
 function insertionPoint(){
  const range=editor.selection.getRng().cloneRange();
  const object=current() || editor.selection.getNode()?.closest?.('[data-shotto-object]');
  const page=pageOf(inDocument(object)?object:editor.selection.getNode());
  if(inDocument(object)){
   range.setStartAfter(findAnchor(page,object.id)||object);
   range.collapse(true);
  }else if(!range.collapsed && objects().some(node=>range.intersectsNode(node))){
   range.collapse(false);
  }
  const element=range.startContainer.nodeType===1?range.startContainer:range.startContainer.parentElement;
  if(!inDocument(element) || element.closest('[contenteditable="false"]')){
   range.selectNodeContents(page);range.collapse(false);
  }
  if(pendingPoint && pendingPoint.origin.compareBoundaryPoints(0,range)===0 && pendingPoint.origin.compareBoundaryPoints(2,range)===0)return pendingPoint;
  return {origin:range.cloneRange(),range,page};
 }
 function insertAtPoint(node,point){
  const doc=editor.getDoc(), range=point.range;
  // Only delete text the user explicitly selected. Shape ranges are already collapsed.
  if(!range.collapsed)range.deleteContents();
  const parent=range.startContainer;
  if(parent===editor.getBody() || parent.nodeType===1 && parent.hasAttribute('data-shotto-page')){
   const block=doc.createElement('p');
   if(parent===editor.getBody() && point.page!==parent)point.page.append(block);
   else range.insertNode(block);
   range.selectNodeContents(block);range.collapse(false);
  }
  const gap=doc.createTextNode(' '), fragment=doc.createDocumentFragment();
  fragment.append(node,gap);range.insertNode(fragment);
  range.setStart(gap,1);range.collapse(true);
  editor.selection.setRng(range.cloneRange());select(node);
 }
 function insert(kind){
  if(kind==='scribble')return sketch();
  if(!geometry[kind])return Promise.resolve();
  const point=insertionPoint(), o=defaults(kind);
  pendingPoint=point;
  const add=async()=>{
   const png=await rasterize(shapeSVG(o),o.w,o.h);
   if(editor.removed || !inDocument(point.page))return;
   const doc=editor.getDoc();
   editor.undoManager.transact(()=>{
    const node=doc.createElement('span');
    node.id=o.id;node.className='shotto-drawing';node.contentEditable='false';
    const picture=doc.createElement('img');picture.src=png;picture.alt=shapeName(kind);
    node.append(picture);layout(node,o);
    insertAtPoint(node,point);
   });
   editor.nodeChanged();editor.dispatch('change');
  };
  const result=insertQueue.then(add);
  insertQueue=result.catch(()=>{});
  const queue=insertQueue;
  queue.then(()=>{if(insertQueue===queue)pendingPoint=null;});
  return result;
 }
 function update(patch){const n=current();if(!n)return Promise.resolve();updateQueue=updateQueue.catch(()=>{}).then(()=>applyPatch(n,patch));return updateQueue;}
 async function applyPatch(n,patch){if(!inDocument(n))return;let old=read(n),o=normalize({...old,...patch});if(o.kind==='freehand'){o.strokes=old.strokes;o.kind='freehand';}
  if((o.wrap==='front'||o.wrap==='behind')&&!['front','behind'].includes(old.wrap)){const r=n.getBoundingClientRect(),p=pageOf(n).getBoundingClientRect(),z=zoom();o.x=patch.x??(r.left-p.left)/z;o.y=patch.y??(r.top-p.top)/z;}
  const png=o.kind==='freehand'?null:await rasterize(shapeSVG(o),o.w,o.h);
  if(!inDocument(n))return;editor.undoManager.transact(()=>{if(['front','behind'].includes(o.wrap))floatOnPage(n,pageOf(n));else if(['front','behind'].includes(old.wrap))returnToText(n,pageOf(n));if(png){const img=n.querySelector('img');img.src=png;img.removeAttribute('data-mce-src');}layout(n,o);});if(current()===n)select(n);editor.nodeChanged();editor.dispatch('change');
 }
 function deleteSelected(){const n=current();if(!n)return;editor.undoManager.transact(()=>{findAnchor(pageOf(n),n.id)?.remove();n.remove();});deselect();editor.nodeChanged();editor.dispatch('change');}
 function duplicate(){const n=current();if(!n)return;const o=normalize({...read(n),id:'shape-'+Date.now()+'-'+(++sequence)});if(o.wrap==='front'||o.wrap==='behind'){o.x+=20;o.y+=20;}let clone;editor.undoManager.transact(()=>{clone=n.cloneNode(true);clone.id=o.id;n.after(clone);layout(clone,o);});select(clone);editor.dispatch('change');}
 function editText(){const n=current();if(!n)return;const o=read(n);if(o.kind==='freehand')return sketch(n);editor.windowManager.open({title:'Shape text',body:{type:'panel',items:[{type:'textarea',name:'text',label:'Text'},{type:'input',name:'fontSize',label:'Font size (px)'},{type:'colorinput',name:'textColor',label:'Text colour'},{type:'selectbox',name:'align',label:'Alignment',items:[{text:'Left',value:'left'},{text:'Centre',value:'center'},{text:'Right',value:'right'}]}]},initialData:{text:o.text||'',fontSize:String(o.fontSize||16),textColor:o.textColor||'#172b4d',align:o.align||'center'},buttons:[{type:'cancel',text:'Cancel'},{type:'submit',text:'Apply',primary:true}],onSubmit:api=>{selected=n;update(api.getData()).catch(report);api.close();}});}
 function point(e){return {x:e.clientX,y:e.clientY};}
 function startHandle(e){if(drag||e.button!==0)return;const handle=e.target.closest('[data-handle]');if(!handle||!current())return;e.preventDefault();e.stopPropagation();const r=selected.getBoundingClientRect();editor.undoManager.add();drag={type:handle.dataset.handle,node:selected,old:read(selected),start:point(e),rect:r,changed:false};trackPointer(e);}
 function startMove(e){if(drag||e.button!==0||e.isPrimary===false)return;const n=e.target.closest?.('[data-shotto-object]');if(!n){if(!e.target.closest?.('.shotto-selection'))deselect();return;}if(!inDocument(n))return;e.preventDefault();select(n);const p=pageOf(n),r=n.getBoundingClientRect(),pr=p.getBoundingClientRect(),z=zoom();editor.undoManager.add();drag={type:'move',node:n,old:normalize(read(n)),start:point(e),rect:r,page:p,x:(r.left-pr.left)/z,y:(r.top-pr.top)/z,changed:false};trackPointer(e);}
 function trackPointer(e){
  drag.pointerId=e.pointerId;drag.threshold=e.pointerType==='touch'?7:3;
  const doc=editor.getDoc();
  doc.addEventListener('pointermove',move);
  doc.addEventListener('pointerup',stop);doc.addEventListener('pointercancel',stop);
  editor.getWin().addEventListener('blur',stop);
 }
 function move(e){if(!drag||e.pointerId!==drag.pointerId)return;const dx=(e.clientX-drag.start.x)/zoom(),dy=(e.clientY-drag.start.y)/zoom();if(!drag.changed && Math.hypot(e.clientX-drag.start.x,e.clientY-drag.start.y)<drag.threshold)return;e.preventDefault();drag.changed=true;const n=drag.node,o={...drag.old};
  if(drag.type==='move'){floatOnPage(n,drag.page);o.wrap=drag.old.wrap==='behind'?'behind':'front';o.x=clamp(drag.x+dx,0,Math.max(0,drag.page.clientWidth-o.w),0);o.y=clamp(drag.y+dy,0,Math.max(0,drag.page.clientHeight-o.h),0);}
  else if(drag.type==='adjust'){if(o.kind==='roundRect')o.radius=clamp((drag.old.radius||4)+dx/o.w*32,0,13,4);else o.adjust=clamp((drag.old.adjust||.35)+(o.kind==='leftArrow'?dx:-dx)/o.w,.12,.8,.35);}
  else if(drag.type==='rotate'){const cx=drag.rect.left+drag.rect.width/2,cy=drag.rect.top+drag.rect.height/2;let a=Math.atan2(e.clientY-cy,e.clientX-cx)*180/Math.PI+90;o.rotation=e.shiftKey?Math.round(a/15)*15:Math.round(a);}
  else{const theta=-(drag.old.rotation||0)*Math.PI/180,lx=dx*Math.cos(theta)-dy*Math.sin(theta),ly=dx*Math.sin(theta)+dy*Math.cos(theta),h=drag.type;
   if(h.includes('e'))o.w=clamp(o.w+lx,20,1800);if(h.includes('w'))o.w=clamp(o.w-lx,20,1800);if(h.includes('s'))o.h=clamp(o.h+ly,15,1800);if(h.includes('n'))o.h=clamp(o.h-ly,15,1800);
   if(e.shiftKey&&h.length===2)o.h=o.w*(drag.old.h/drag.old.w);
   if(['front','behind'].includes(o.wrap)){const sx=h.includes('w')?(drag.old.w-o.w)/2:(o.w-drag.old.w)/2,sy=h.includes('n')?(drag.old.h-o.h)/2:(o.h-drag.old.h)/2;const a=-theta;o.x=drag.old.x+sx*Math.cos(a)-sy*Math.sin(a)-(o.w-drag.old.w)/2;o.y=drag.old.y+sx*Math.sin(a)+sy*Math.cos(a)-(o.h-drag.old.h)/2;}
  }
  if(!n.hasPointerCapture(e.pointerId) && editor.getDoc().hasFocus()){try{n.setPointerCapture(e.pointerId);}catch{/* A cancelled pointer can already be released. */}}
  layout(n,o);positionOverlay();editor.dispatch('ShottoShapeTransform',{shape:o});
 }
 async function stop(e){
  const d=drag;if(!d || (e.pointerId!==undefined && e.pointerId!==d.pointerId))return;
  drag=null;
  const doc=editor.getDoc();doc.removeEventListener('pointermove',move);
  doc.removeEventListener('pointerup',stop);doc.removeEventListener('pointercancel',stop);
  editor.getWin().removeEventListener('blur',stop);
  if(d.node.hasPointerCapture(d.pointerId))d.node.releasePointerCapture(d.pointerId);
  if(!d.changed || !inDocument(d.node))return;
  try{
   if(d.type!=='move' && d.type!=='rotate')await renderNode(d.node,read(d.node));
   if(!inDocument(d.node))return;
   editor.undoManager.add();positionOverlay();editor.nodeChanged();editor.dispatch('change');
  }catch(error){report(error);}
 }
 function sketch(target){
  const point=target?null:insertionPoint();
  const old=read(target);let strokes=Array.isArray(old.strokes)?old.strokes:[],current=null;
  const id='shotto-canvas-'+Math.random().toString(36).slice(2);
  const dlg=editor.windowManager.open({title:'Shotto Freehand Drawing',size:'large',body:{type:'panel',items:[
   {type:'grid',columns:2,items:[{type:'colorinput',name:'ink',label:'Pen colour'},{type:'selectbox',name:'weight',label:'Pen thickness',items:[1,2,4,8,12].map(n=>({text:n+' px',value:String(n)}))}]},
   {type:'htmlpanel',html:`<p>Draw using your mouse, finger or pen. Double-click the inserted drawing to edit.</p><canvas id="${id}" width="900" height="450" style="display:block;width:100%;height:auto;touch-action:none;border:1px solid #b8cbd0;border-radius:8px;background:#fff" aria-label="Drawing canvas"></canvas>`}
  ]},initialData:{ink:'#17617d',weight:'4'},buttons:[{type:'cancel',text:'Cancel'},{type:'custom',name:'undo',text:'Undo stroke'},{type:'custom',name:'clear',text:'Clear canvas'},{type:'submit',text:target?'Update drawing':'Insert drawing',primary:true}],
  onAction:(api,d)=>{if(d.name==='undo')strokes.pop();if(d.name==='clear')strokes=[];paint();},
  onSubmit:api=>{if(!strokes.length){report(Error('Draw something first.'));return;}const url=canvas.toDataURL('image/png');
   editor.undoManager.transact(()=>{
    if(target && !inDocument(target))return;
    const node=target||editor.getDoc().createElement('img');
    const o=normalize({...old,kind:'freehand',strokes,w:old.w||600,h:old.h||300});
    node.className='shotto-sketch';node.contentEditable='false';node.id=o.id;
    node.src=url;node.removeAttribute('data-mce-src');node.alt='Freehand drawing';
    if(target){remember(node,o);select(node);}
    else{node.width=o.w;node.height=o.h;remember(node,o);insertAtPoint(node,point);}
   });
   editor.nodeChanged();editor.dispatch('change');api.close();}
  });
  const canvas=document.getElementById(id),ctx=canvas.getContext('2d');
  function paint(){ctx.clearRect(0,0,900,450);ctx.lineCap='round';ctx.lineJoin='round';for(const s of strokes){ctx.strokeStyle=s.color;ctx.lineWidth=s.width;ctx.beginPath();s.points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));if(s.points.length===1){ctx.lineTo(s.points[0][0]+.1,s.points[0][1]+.1);}ctx.stroke();}}
  const pos=e=>{const r=canvas.getBoundingClientRect();return [Math.max(0,Math.min(900,(e.clientX-r.left)*900/r.width)),Math.max(0,Math.min(450,(e.clientY-r.top)*450/r.height))];};
  canvas.onpointerdown=e=>{e.preventDefault();if(strokes.reduce((n,s)=>n+s.points.length,0)>=12000){report(Error('This sketch is full. Insert it and start another drawing.'));return;}const d=dlg.getData();current={color:color(d.ink,'#17617d'),width:clamp(d.weight,1,12,4),points:[pos(e)]};strokes.push(current);canvas.setPointerCapture(e.pointerId);paint();};
  canvas.onpointermove=e=>{if(current&&current.points.length<2000){current.points.push(pos(e));paint();}};
  canvas.onpointerup=canvas.onpointercancel=()=>{current=null;};paint();
 }
 function install(){const doc=editor.getDoc(),style=doc.createElement('style');style.textContent=`body,[data-shotto-page]{isolation:isolate}.shotto-drawing{line-height:0}.shotto-drawing img{user-select:none}.shotto-selection{position:absolute;border:1px solid #858585;pointer-events:none;z-index:10000;box-sizing:border-box;transform-origin:center}.shotto-handle{position:absolute;width:9px;height:9px;border:1.5px solid #777;border-radius:50%;background:white;pointer-events:auto;padding:0;transform:translate(-50%,-50%);touch-action:none}.shotto-handle.nw{left:0;top:0;cursor:nwse-resize}.shotto-handle.n{left:50%;top:0;cursor:ns-resize}.shotto-handle.ne{left:100%;top:0;cursor:nesw-resize}.shotto-handle.e{left:100%;top:50%;cursor:ew-resize}.shotto-handle.se{left:100%;top:100%;cursor:nwse-resize}.shotto-handle.s{left:50%;top:100%;cursor:ns-resize}.shotto-handle.sw{left:0;top:100%;cursor:nesw-resize}.shotto-handle.w{left:0;top:50%;cursor:ew-resize}.shotto-handle.rotate{left:50%;top:-27px;border:0;background:white;width:23px;height:23px;font:24px Arial;line-height:23px;color:#666;cursor:grab}.shotto-handle.adjust{top:0;background:#ffdc19;border-color:#9a8829;border-radius:0;width:9px;height:9px;transform:translate(-50%,-50%) rotate(45deg);cursor:ew-resize}.shotto-handle.adjust[hidden]{display:none}.shotto-rotation-line{position:absolute;left:50%;height:25px;top:-25px;border-left:1px solid #888}@media print{.shotto-selection{display:none!important}}`;doc.head.append(style);doc.addEventListener('pointerdown',startMove);doc.addEventListener('dragstart',e=>{if(e.target.closest?.('[data-shotto-object]'))e.preventDefault();});doc.addEventListener('keydown',e=>{if(!current()||e.target.closest?.('input,textarea'))return;if(e.key==='Escape'){deselect();return;}if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();deleteSelected();}else if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();const o=read(selected),step=e.shiftKey?10:1;update({wrap:'front',x:(o.x||0)+(e.key==='ArrowLeft'?-step:e.key==='ArrowRight'?step:0),y:(o.y||0)+(e.key==='ArrowUp'?-step:e.key==='ArrowDown'?step:0)}).catch(report);}});editor.getWin().addEventListener('resize',positionOverlay);}
 editor.on('init',install);editor.on('ScrollWindow ShottoZoom ShottoPageSetup',positionOverlay);editor.on('Undo Redo SetContent',()=>{deselect();});editor.on('remove',()=>{overlay?.remove();});
 editor.on('DblClick',e=>{const n=e.target.closest?.('[data-shotto-object]');if(inDocument(n)){select(n);editText();}});
 editor.addCommand('ShottoInsertShape',(ui,value)=>insert(value||'rect').catch(report));
 editor.ui.registry.addButton('shotto_shapes',{text:'Shapes',onAction:()=>editor.dispatch('ShottoOpenShapes')});
 editor.ui.registry.addButton('shotto_drawing',{text:'Shapes',onAction:()=>editor.dispatch('ShottoOpenShapes')});
 editor.ui.registry.addButton('shotto_sketch',{text:'Draw',onAction:safe(()=>sketch())});
 return {getMetadata:()=>({name:'Shotto Drawing Ribbon 2.0'}),categories,shapeName,icon:kind=>shapeSVG({kind,fill:'#fff',stroke:'#444',strokeWidth:1},true),insert,update,select,deselect,selected:()=>current()?read(selected):null,node:current,editText,remove:deleteSelected,duplicate,objects,openSketch:sketch,positionOverlay};
});})();
