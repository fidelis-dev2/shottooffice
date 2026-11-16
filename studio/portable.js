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
    let activeDialog;
    const doc = editor.getElement().ownerDocument;
    function chooser() {
      if (activeDialog?.open) return;
      const bookmark = editor.selection.getBookmark(2, true);
      const dialog = doc.createElement('dialog');
      activeDialog = dialog;
      dialog.className = 'shotto-tools-dialog';
      dialog.setAttribute('aria-label', config.label);
      // Keep the exported plugin independent of the Office page and its stylesheets.
      if (!doc.getElementById('shotto-tools-chooser-css')) {
        const style = doc.createElement('style');
        style.id = 'shotto-tools-chooser-css';
        style.textContent = `
          .shotto-tools-dialog {
            box-sizing:border-box;width:min(430px,calc(100% - 24px));max-width:none;
            max-height:calc(100% - 24px);margin:auto;padding:0;overflow:auto;
            border:1px solid #c8d5e1;border-radius:14px;background:#fff;color:#1c3448;
            box-shadow:0 18px 60px #132a452e;font:14px/1.3 "Segoe UI",Arial,sans-serif;
          }
          .shotto-tools-dialog::backdrop {background:rgb(28 44 59 / 28%)}
          .shotto-tools-dialog header {
            display:flex;align-items:center;justify-content:space-between;gap:12px;
            padding:16px 18px;border-bottom:1px solid #e4eaf0;background:#fff;color:inherit;
          }
          .shotto-tools-dialog h2 {margin:0;font:600 20px/1.2 "Segoe UI",Arial,sans-serif;color:inherit;overflow-wrap:anywhere}
          .shotto-tools-dialog .st-close {
            display:grid;place-items:center;flex:none;width:32px;height:32px;padding:0;
            border:0;border-radius:6px;background:transparent;color:#526777;cursor:pointer;
          }
          .shotto-tools-dialog .st-close:hover {background:#edf2f6}
          .shotto-tools-dialog .st-grid {
            display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;padding:14px;
          }
          .shotto-tools-dialog .st-tool {
            box-sizing:border-box;display:flex;flex-direction:column;align-items:center;justify-content:center;
            gap:7px;min-width:0;min-height:85px;margin:0;padding:9px 4px;border:1px solid #dce4eb;
            border-radius:8px;background:#fff;color:#243a4c;text-align:center;cursor:pointer;
            font:500 13px/1.2 "Segoe UI",Arial,sans-serif;overflow-wrap:anywhere;
          }
          .shotto-tools-dialog .st-tool:hover {background:#f1f7fc;border-color:#87a9cb}
          .shotto-tools-dialog button:focus-visible {outline:2px solid #2167ad;outline-offset:1px}
          .shotto-tools-dialog .st-glyph {display:block;width:32px;height:32px;color:#196da0}
          .shotto-tools-dialog .st-glyph[data-family="math"] {color:#604ba3}
          .shotto-tools-dialog .st-glyph[data-family="draw"] {color:#147563}
          .shotto-tools-dialog svg {width:100%;height:100%;display:block}
          .shotto-tools-dialog .st-close svg {width:16px;height:16px}
          @media(max-width:350px){.shotto-tools-dialog .st-grid{gap:5px;padding:8px}.shotto-tools-dialog .st-tool{font-size:12px}}
        `;
        doc.head.append(style);
      }

      const outlines = {
        spell: '<path d="M2 16l3.5-10L9 16m-5.8-3h4.7M12 16V6h3a2.5 2.5 0 0 1 0 5h-3m3 0a2.5 2.5 0 1 1 0 5h-3m12-9.2a4 4 0 0 0-6 3.5v1.5a4 4 0 0 0 5.8 3.6"/><path d="m10 22 3.5 3.5L23 17" stroke="#208259" stroke-width="2.4"/>',
        math: '<path d="M22 7V4H6l9 10-9 10h16v-3" stroke-width="2.3"/>',
        calculator: '<rect x="5" y="2.5" width="18" height="23" rx="2.5"/><rect x="8" y="5.5" width="12" height="5" rx="1" fill="currentColor" fill-opacity=".12"/><path d="M9 15h1m3.5 0h1m3.5 0h1M9 19h1m3.5 0h1m3.5 0h1M9 22h1m3.5 0h1m3.5 0h1" stroke-width="2.2"/>',
        graph: '<path d="M5 3v20h20M9 5v14m5-14v14m5-14v14M8 8h15M8 13h15M8 18h15" stroke-opacity=".23"/><path d="M5 3v20h20M7 19c5 0 5-11 10-11 2 0 3 3 6-4"/>',
        shapes: '<rect x="3" y="4" width="14" height="14" rx="2" fill="#e3f3ee"/><circle cx="18" cy="18" r="7" fill="#fff"/><path d="M14 21h8" opacity=".35"/>',
        draw: '<path d="m6 16 12-12a2.5 2.5 0 0 1 3.5 0l1 1a2.5 2.5 0 0 1 0 3.5l-12 12L4 22z" fill="currentColor" fill-opacity=".09"/><path d="m16 6 6 6M6 16l4.5 4.5M4 25c4-2 7 2 11 0s6 1 9-1"/>',
        setup: '<path d="M5 24V3h12l4 4v4M16 3v5h5M8 12h5M8 15h3"/><circle cx="18" cy="19" r="4.5"/><circle cx="18" cy="19" r="1.4"/><path d="M18 12v2m0 10v2m-7-7h2m10 0h2m-12-5 1.5 1.5M21.5 22.5l1.5 1.5m0-10-1.5 1.5m-7 7L13 24"/>',
        blank: '<path d="M6 2.5h11l5 5V25H6z" fill="currentColor" fill-opacity=".07"/><path d="M16.5 3v5h5M10 16h8m-4-4v8"/>',
        brk: '<path d="M6 11V3h16v8M6 17v8h16v-8"/><path d="M2 14h24" stroke-dasharray="2 3"/><path d="M9 7h9m-9 14h9" stroke-opacity=".55"/>'
      };
      const svg = (paths, size) => '<svg viewBox="0 0 '+size+' '+size+'" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">'+paths+'</svg>';

      const header = doc.createElement('header');
      const title = doc.createElement('h2');
      title.textContent = config.label;
      const close = doc.createElement('button');
      close.className = 'st-close';
      close.type = 'button';
      close.setAttribute('aria-label', 'Close');
      close.title = 'Close';
      close.innerHTML = svg('<path d="m4 4 8 8m0-8-8 8"/>', 16);
      close.onclick = () => dialog.close();
      header.append(title, close);

      const grid = doc.createElement('div');
      grid.className = 'st-grid';
      for (const [id, label, run, family] of actions) {
        const button = doc.createElement('button');
        button.type = 'button';
        button.className = 'st-tool';
        const glyph = doc.createElement('span');
        glyph.className = 'st-glyph';
        glyph.dataset.family = family;
        glyph.setAttribute('aria-hidden', 'true');
        glyph.innerHTML = svg(outlines[id], 28);
        const caption = doc.createElement('span');
        caption.textContent = label;
        button.append(glyph, caption);
        button.onclick = () => {
          dialog.close();
          if (id === 'math' && editor.shottoInline?.isActive()) {
            editor.shottoInline.focus();
          } else {
            editor.shottoInline?.finish();
            editor.focus();
            editor.selection.moveToBookmark(bookmark);
          }
          Promise.resolve().then(run).catch(error => {
            editor.notificationManager.open({type:'error',text:error.message});
          });
        };
        grid.append(button);
      }
      dialog.append(header, grid);
      dialog.addEventListener('close', () => {
        if (activeDialog === dialog) activeDialog = null;
        dialog.remove();
      }, {once:true});
      doc.body.append(dialog);
      dialog.showModal();
      grid.firstElementChild.focus();
    }
    editor.on('remove', () => activeDialog?.close());
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
          for(const node of drawing.objects()){
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
    const actions = [];
    if (spelling) actions.push(['spell', 'Spell Check', () => spelling.open(), 'text']);
    if (visual) actions.push(['math', 'Mathematics', () => visual.open(), 'math']);
    if (tools.includes('calculator')) actions.push(['calculator', 'Calculator', () => math.calculator(), 'math']);
    if (tools.includes('graph')) actions.push(['graph', 'Function Graph', () => math.graph(), 'math']);
    if (tools.includes('shapes')) actions.push(['shapes', 'Shapes', () => shapeRibbon?.show('shapes'), 'draw']);
    if (tools.includes('draw')) actions.push(['draw', 'Draw', () => drawing.openSketch(), 'draw']);
    const pagesOnly = pages && !actions.length;
    if (pages) {
      actions.push(['setup', 'Page Setup', () => pages.open(), 'page']);
      actions.push(['blank', 'Blank Page', () => pages.insertBlank(), 'page']);
      actions.push(['brk', 'Page Break', () => pages.insertBreak(), 'page']);
    }
    function open() {
      if (pagesOnly) return pages.open({insertButtons:true});
      if (actions.length === 1) return actions[0][2]();
      chooser();
    }
    editor.ui.registry.addButton(config.id,{text:config.label,tooltip:config.label,onAction:open});
    editor.ui.registry.addMenuItem(config.id,{text:config.label,onAction:open});
    return {open, getMetadata:()=>({name:config.label,version:'6.0'})};
  });
}
