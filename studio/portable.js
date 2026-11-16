/* Factory included in each downloadable plugin. Only selected tools are exposed. */
function registerShottoPlugin(config) {
  'use strict';
  tinymce.PluginManager.add(config.id, function (editor, url) {
    const tools = config.tools;
    function dependency(name) {
      if (!editor.plugins[name]) {
        const setup = tinymce.PluginManager.get(name);
        if (!setup) throw new Error('Missing plugin component: '+name);
        editor.plugins[name] = setup(editor, url);
      }
      return editor.plugins[name];
    }
    const needsMath = config.groups.length || tools.includes('calculator') || tools.includes('graph') || config.presets.length;
    const math = needsMath ? dependency('shotto_math') : null;
    const visual = config.groups.length || config.presets.length
      ? window.ShottoVisual.configure(editor,config.groups,config.presets,'shotto:formulas:'+config.id,config.id) : null;
    if (visual && !editor.shottoVisual) editor.shottoVisual = visual;
    const drawing = tools.includes('shapes') || tools.includes('draw') ? dependency('shotto_drawing') : null;
    const spelling = tools.includes('spell') ? dependency('shotto_proofing') : null;
    const pages = tools.includes('pages') ? dependency('shotto_page_layout') : null;
    function chooser(title, build) {
      const bookmark=editor.selection.getBookmark(2,true);
      const dialog=document.createElement('dialog');
      dialog.setAttribute('aria-label',title);
      dialog.style.cssText='width:min(560px,94vw);max-height:80vh;overflow:auto;padding:18px;border:1px solid #acbdce;border-radius:10px;color:#283e56;font:14px Arial,sans-serif';
      const heading=document.createElement('h2'); heading.textContent=title;dialog.append(heading);
      const list=document.createElement('div');list.style.cssText='display:flex;flex-wrap:wrap;gap:6px';dialog.append(list);
      function option(label, action, svg) {
        const b=document.createElement('button');b.type='button';b.title=label;b.setAttribute('aria-label',label);
        b.style.cssText='min-width:36px;min-height:34px;border:1px solid #bdcad9;border-radius:4px;background:white;cursor:pointer';
        if(svg){b.innerHTML=svg;const icon=b.querySelector('svg');if(icon){icon.style.width='26px';icon.style.height='23px';}}else b.textContent=label;
        b.onclick=()=>{dialog.close();editor.focus();editor.selection.moveToBookmark(bookmark);Promise.resolve().then(action).catch(e=>editor.notificationManager.open({type:'error',text:e.message}));};
        list.append(b);
      }
      build(option);
      const close=document.createElement('button');close.type='button';close.textContent='Close';close.style.marginTop='15px';close.onclick=()=>dialog.close();dialog.append(close);
      dialog.onclose=()=>dialog.remove();document.body.append(dialog);dialog.showModal();
    }
    let shapeRibbon;
    if(tools.includes('shapes')){
      editor.on('init',()=>{
        if(editor.shottoPortableShapeRibbon){shapeRibbon=editor.shottoPortableShapeRibbon;return;}
        const host=document.createElement('div');
        host.setAttribute('aria-label','Shotto shape ribbon');
        const shadow=host.attachShadow({mode:'open'});
        const css=document.createElement('style');
        css.textContent=window.ShottoPortableRibbonCSS;
        const root=document.createElement('div');
        shadow.append(css,root);
        editor.getContainer().before(host);
        let layers;
        function toggleLayers(){
          if(layers){layers.remove();layers=null;return;}
          layers=document.createElement('div');
          layers.style.cssText='display:flex;flex-wrap:wrap;gap:5px;background:white;padding:6px;font:13px Arial';
          for(const node of editor.getBody().querySelectorAll('[data-shotto-object]')){
            let data;try{data=JSON.parse(decodeURIComponent(node.getAttribute('data-shotto-object')));}catch{continue;}
            const button=document.createElement('button');button.type='button';button.textContent=drawing.shapeName(data.kind)+' '+(layers.children.length+1);
            button.onclick=()=>{drawing.select(node);node.scrollIntoView({block:'nearest'});layers?.remove();layers=null;};layers.append(button);
          }
          const close=document.createElement('button');close.type='button';close.textContent='Close';close.onclick=toggleLayers;layers.append(close);shadow.append(layers);
        }
        shapeRibbon=window.ShottoRibbon.mount(editor,{container:root,shapesOnly:true,onAction:name=>{if(name==='layers')toggleLayers();}});
        editor.shottoPortableShapeRibbon=shapeRibbon;
        if(!editor.inline && !pages)editor.dom.addStyle('body{position:relative;min-height:calc(100vh - 2em)}');
        editor.on('remove',()=>host.remove());
      });
    }
    function shapes(){shapeRibbon?.show('shapes');}
    const actions=[];
    if(spelling)actions.push(['Spell Check',()=>spelling.open()]);
    if(visual)actions.push(['Mathematics',()=>visual.open()]);
    if(tools.includes('calculator'))actions.push(['Calculator',()=>math.calculator()]);
    if(tools.includes('graph'))actions.push(['Function graph',()=>math.graph()]);
    if(tools.includes('shapes'))actions.push(['Shapes',shapes]);
    if(tools.includes('draw'))actions.push(['Draw',()=>drawing.openSketch()]);
    if(pages)actions.push(['Page setup',()=>pages.open()],['Blank page',()=>pages.insertBlank()],['Page break',()=>pages.insertBreak()]);
    function open() {
      if(visual && editor.shottoInline?.isActive())return visual.open();
      if(actions.length===1) return actions[0][1]();
      chooser(config.label, option=>actions.forEach(([label,action])=>option(label,action)));
    }
    editor.ui.registry.addButton(config.id,{text:config.label,tooltip:config.label,onAction:open});
    editor.ui.registry.addMenuItem(config.id,{text:config.label,onAction:open});
    return {open, getMetadata:()=>({name:config.label,version:'6.0'})};
  });
}
