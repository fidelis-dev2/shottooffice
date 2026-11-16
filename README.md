# Shotto Office — Mathematics na Plugin Studio 6.0

Project kamili ya HTML, CSS na JavaScript yenye ribbon inayofuata mpangilio wa screenshots zako. Hakuna malipo, activation key, akaunti, database au backend inayohitajika. Hakuna npm/build wala Node.js runtime.

## Kuanza

1. Extract ZIP yote; usifungue HTML ikiwa bado ndani ya ZIP.
2. Fungua `ShottoOffice/index.html` kwa Chrome au Edge ya kisasa.
3. Weka internet wakati TinyMCE inapakiwa kutoka jsDelivr. Plugins za Shotto na mathematics zipo ndani ya folder.
4. Tumia **File → Save JSON** au Ctrl+S kuhifadhi nakala; **Open JSON** kuendelea kuhariri.

Script ya TinyMCE ni ile uliyoomba:

```html
<script src="https://cdn.jsdelivr.net/npm/tinymce@6/tinymce.min.js" referrerpolicy="origin"></script>
```

CDN ina maana ZIP hii si kifurushi cha 100% offline. TinyMCE core/themes/icons/skins/plugins hazijajumuishwa local. Usibadili major version bila kupima integration. Browser hufanya kazi za document; hakuna endpoint ya kutuma document iliyoongezwa.

## Spell Check ya Kiswahili na Kiingereza

1. Fungua **Review → Spell Check**. Kwenye **Lugha ya hati**, chagua **Kiswahili** au **English (UK)**.
2. Kwa hati ya lugha mbili, chagua kwa mouse au keyboard kifungu kama *centrifugal pump*. Kwenye **Lugha ya sehemu**, chagua **English (UK)**, kisha bonyeza **Weka kwa uteuzi**. Lugha ya kifungu huhifadhiwa katika HTML.
3. Weka kishale juu ya neno lenye mstari wa mawimbi kisha **bofya kulia** kwa mouse au kwa kitufe cha kulia cha touchpad. Menyu hujitokeza karibu na neno. Kuchagua pendekezo kwa kubofya kushoto hubadilisha neno mara moja. Menyu inaonyesha hadi mapendekezo sita tofauti ya lugha hiyo kadiri kamusi inavyoyapata. Unaweza pia kuandika **Neno mbadala** kisha **Badilisha**. Ukibadilisha au kupuuza, menyu au paneli ya Review hujifunga na kishale hubaki mwishoni mwa neno. Unaweza kuendelea kuandika hapo au kutumia Undo. Ukiwa kwenye Review unaweza kuvinjari kwa kitufe cha **Neno linalofuata**.
4. **Puuza** huruka tukio hilo katika ukaguzi wa sasa. **Ongeza kwenye kamusi yangu** huhifadhi neno kwa lugha hiyo katika browser na tovuti unayotumia. Majina binafsi hayahamishwi kwenye plugin unayotengeneza.
5. Kwa plugin ya kutumia kwenye fomu nyingine, extract **examples/shotto_spellcheck.zip**. Fungua **example.html** kujaribu, au fuata **INSTALL.txt** kuunganisha kitufe kwenye TinyMCE yako. Unaweza pia kutumia **Tengeneza Plugin** na kuchagua **Spell Check · Kiswahili + English (UK)** pamoja na zana nyingine.

Plugin inatumia kamusi za ndani za sw_TZ na en_GB na sheria za maumbo ya maneno. Inakagua tahajia. Baadhi ya majina, istilahi na maumbo ya Kiswahili yanaweza kuhitaji kuongezwa. Maandishi hayatumwi kwenye huduma ya ukaguzi. Fomula, code na shapes zinarukwa. Browser yenye CSS Custom Highlight huonyesha mistari kwenye hati; kwenye browser isiyokuwa nayo, paneli bado ina orodha ya maneno. Demo ya TinyMCE hutumia CDN kama awali. Plugin inaweza kutumiwa bila internet kwenye mfumo ambao tayari unapakia TinyMCE kutoka mafaili yake ya ndani.

## Fomula kwa kuona na kuchagua

Bonyeza **Mathematics → All formulas** au kundi lililo kwenye ribbon. Kila kadi ina mfano wa fomula uliochorwa. Tafuta kwa jina au chagua kundi. Kuna templates 92 katika makundi 12. Unaweza kuandika namba, herufi na alama moja kwa moja kwenye kisanduku. Ukibadili thamani, preview hubadilika.

- **Fraction** ina kisanduku cha juu na cha chini. Weka 3 na 4, kisha bonyeza **Insert equation**.
- **Matrices & vectors → 2 × 2 matrix** ina visanduku vinne. Bofya **Insert equation** kuiweka kwenye page.
- **New formula** inafungua kisanduku cha kutunga fomula. Unaweza kuingiza sehemu, root, power au alama nyingine ndani ya expression unayoandika. Tumia mshale au Tab kusogeza cursor baina ya sehemu.
- Weka jina kisha **Save to My formulas**. Utaiona kwenye **My formulas** katika browser hiyo. Ukichagua **Jumuisha My formulas** wakati wa kutengeneza plugin, fomula ulizohifadhi zinaingia kwenye ZIP ya plugin.
- Bofya namba au herufi ndani ya fomula kwenye hati. Andika badala yake, au tumia **√**, **a/b** na **xⁿ** kwenye upau wa karibu. Unaweza pia kuchagua sehemu ya fomula kwa kuburuta au kwa Shift pamoja na mishale.
- Kwa mfano, kwenye sehemu yenye 3 juu na 4 chini, bofya 4 kisha **√**. Utapata 3 juu na √4 chini. Bofya **Done**, bofya 4 ndani ya mzizi na uandike 5. Ili kuweka sehemu ndani ya huo mzizi, chagua 5, bofya **Formulas**, chagua **Fraction**, jaza denominator na bonyeza **Insert at cursor**.
- **Done** au Enter hurudisha kishale kwenye hati. Mabadiliko huhifadhiwa kwenye HTML ya equation pamoja na alama zinazoonekana. Fomula za zamani zenye `data-latex` pia hufunguka kwa kubofya.

## Kutengeneza plugin ya mfumo mwingine

1. Fungua tab **Tengeneza Plugin** au **studio/index.html** moja kwa moja.
2. Weka jina litakaloonekana kwenye toolbar. Plugin ID hujazwa kutoka kwenye jina na unaweza kuibadili. Mfano ni `shotto_exam_math`.
3. Chagua makundi ya fomula. Ukipenda ongeza calculator, function graph, **Shapes + Shape Format**, freehand drawing au pages.
4. **Jaribu plugin** hufungua TinyMCE ya mfano. Kitufe chenye jina uliloweka hufungua zana ulizochagua.
5. **Pakua ZIP**. Extract ZIP na ufungue `example.html` kujaribu nje ya Shotto Office.
6. Kwa fomu iliyopo, nakili folder ya plugin kwenye `plugins/` ya mfumo wako. Ongeza ID kwenye plugins, external_plugins na toolbar ya `tinymce.init` iliyopo. Hifadhi options na plugins za awali za fomu. `INSTALL.txt` ina snippet inayolingana na ID yako.

```javascript
// Sehemu zinazoongezwa kwenye configuration ya fomu yako
plugins: 'lists link shotto_exam_math',
external_plugins: {
  shotto_exam_math: new URL('./plugins/shotto_exam_math/plugin.js', document.baseURI).href
},
toolbar: 'undo redo | bold italic | shotto_exam_math'
```

**examples/shotto_exam_math.zip** ina fomula 92 za makundi yote 12, Shapes, Shape Format na Spell Check. **examples/shotto_shapes.zip** ina michoro na Shape Format pekee. Katika fomu yoyote yenye plugin hiyo, tab ya Shapes huonekana juu ya TinyMCE. Ichague kufungua icons. Ukiuchagua mchoro, ribbon huonyesha Shape Format. Kubofya maandishi huificha. Plugin inabeba zana zake. Fomu ya mteja inaweza kupakia TinyMCE yake yenyewe. Kabla ya kusoma textarea, tumia `tinymce.triggerSave()`. Ukionyesha HTML ya equation nje ya TinyMCE, pakia `equation.css` kutoka kwenye ZIP hiyo kwenye ukurasa wa kusoma. Hifadhi markup ya equation na sifa zake za `data-*` ili baadaye iweze kuhaririwa tena.

Kitendo cha kutengeneza ZIP ni local. Internet inahitajika katika demo na preview kwa TinyMCE 6 inayopakuliwa kupitia CDN. Ili kuwasilisha update, tengeneza ZIP mpya kwa ID ileile kisha badilisha plugin.js na equation.css ya zamani kwenye mfumo uliyoifunga.

## Ribbon

| Tab | Matumizi |
| --- | --- |
| Home | Font, size, rangi, bold/italic/underline, lists, alignment, styles, find |
| Insert | Blank page, page break, table, picture, shape icons, links, text box, symbols |
| Draw | Freehand canvas kwa mouse, touch au pen |
| Shapes | Gallery ya SVG icons kwenye ribbon, imepangwa kwa aina |
| Shape Format | Fill, outline, shadow, text, position, wrap, layers, size na rotation |
| Design | Theme ya headings, page colour na border |
| Layout | A4/A3/A5/Letter/Legal/custom, portrait/landscape, margins na page breaks |
| References | Contents kutoka headings, bookmark na footnote ya kawaida |
| Review | Spell Check ya Kiswahili na Kiingereza, word count, find/replace, source HTML |
| Mathematics | Fomula za kuchagua na kujaza, My formulas, calculator na function graph |
| Tengeneza Plugin | Chagua zana, jaribu kwenye TinyMCE na pakua plugin ZIP |
| View | Navigation, ruler, Selection pane, zoom na Focus |
| File | New/Open/Save JSON, Export HTML, Print/PDF na form content |

**Shapes si dropdown.** Bonyeza tab yake kama Home. Majina yanapatikana kama tooltip na accessible label; uchaguzi unaonekana kwa icons. Insert ina gallery ndogo pia.

## Kutumia shapes

1. Weka cursor kwenye page; fungua Shapes na bonyeza icon.
2. Bonyeza shape: **Shape Format** itafunguka hapo hapo juu.
3. Vuta shape yenyewe kuisogeza. Drag huibadili kuwa In Front of Text.
4. Vuta handles nane kubadili ukubwa; Shift huhifadhi uwiano.
5. Vuta handle ya juu kuizungusha; Shift hutumia hatua za digrii 15. W/H za ribbon ni cm, na angle ni degrees.
6. Handle ya njano hubadili kichwa cha left/right arrow au pembe za rounded rectangle; haipo kwa kila shape.
7. Double-click au Edit Text kuandika ndani ya shape. Double-click freehand drawing kufungua strokes zake tena.
8. Shape Fill/Outline hubadili rangi, No Fill huondoa kujaza, Shape Effects huwasha/kuzima shadow.
9. Wrap Text ina Inline, Square Left/Right, Top and Bottom, Behind Text na In Front of Text. Tumia Selection Pane kuchagua shape iliyofichika nyuma ya maandishi.
10. Arrow keys husogeza selected shape, Delete huiondoa, Escape huondoa selection. Undo/Redo zipo juu.

Shapes huhifadhiwa kama PNG pamoja na metadata ya kuhariri ndani ya HTML. Handles za selection haziingii kwenye document iliyohifadhiwa.

## Pages na files

- Blank page huweka karatasi tupu kwenye cursor; tail ya maandishi huendelea kwenye page inayofuata.
- Page break huanza page mpya kwenye cursor. Paper size na margins hutumika kwa document nzima.
- Floating shapes hubaki kwenye page yake blank page inapoongezwa.
- JSON huhifadhi HTML, shape metadata, title, theme na page settings. Format ya free edition ya awali bado inakubalika.
- AutoSave ni nakala ya browser/device hiyo. Save JSON ni backup ya kuhamisha, hasa ukiweka picha kubwa.
- HTML export ina shapes, equations na fonts za mathematics ndani yake; haina script ya kuhariri.
- Print/PDF hufungua print dialog ya browser. Chagua Save as PDF na paper size inayolingana; zima browser headers/footers inapohitajika.

## Kuunganisha kwenye fomu yako

**Mfano kamili ni `examples/integration.html`.** Una form, ribbon, navigation, file actions na callbacks zote. Unaweza kuunakili kisha kubadili sehemu za fomu yako.

Files hupakiwa kwa mpangilio huu:

```html
<link rel="stylesheet" href="ribbon/ribbon.css">
<link rel="stylesheet" href="studio/builder.css">
<div id="office-ribbon"></div>
<textarea id="my-editor" name="content"></textarea>
<input type="hidden" id="page-settings" name="page_settings">
<script src="https://cdn.jsdelivr.net/npm/tinymce@6/tinymce.min.js" referrerpolicy="origin"></script>
<script src="plugins/spelling/engine.js"></script>
<script src="plugins/spelling/dictionaries.js"></script>
<script src="plugins/spelling/plugin.js"></script>
<script src="plugins/drawing/plugin.js"></script>
<script src="plugins/mathematics/plugin.js"></script>
<script src="plugins/page-layout/plugin.js"></script>
<script src="studio/catalog.js"></script>
<script src="studio/inline-equations.js"></script>
<script src="studio/visual.js"></script>
<script src="studio/fflate.min.js"></script>
<script src="studio/sources.js"></script>
<script src="studio/portable.js"></script>
<script src="studio/builder.js"></script>
<script src="ribbon/ribbon.js"></script>
```

Katika `tinymce.init` ya fomu yako, weka:

```javascript
plugins: 'lists link table code searchreplace visualblocks wordcount shotto_drawing shotto_math shotto_page_layout shotto_proofing',
menubar: false,
toolbar: false,
statusbar: false,
object_resizing: false,
setup: function (editor) {
  editor.shottoVisual = ShottoVisual.configure(editor, ShottoCatalog);
  ShottoVisual.addStyles();
  editor.on('init', function () {
    queueMicrotask(function () {
      ShottoRibbon.mount(editor, {
        container: '#office-ribbon',
        onAction: handleHostAction
      });
    });
  });
}
```

`handleHostAction` ni function ya host yako kwa File, Pictures, navigation, theme na zoom. Mfano kamili ni `onAction` katika `assets/office.js`. Copy integration example yote ukitaka buttons zote zifanye kazi mara moja. Usipakie office.js kwenye form tofauti bila elements zake, kwa sababu hutumia IDs zilizopo kwenye example.

Kabla ya form submit:

```javascript
tinymce.triggerSave();
const ed = tinymce.get('my-editor');
document.getElementById('page-settings').value =
  JSON.stringify(ed.plugins.shotto_page_layout.getSetup());
```

Textarea ina HTML. Hifadhi page_settings pia ili paper size na margins zirudi. Demo haisubmit kwa server: File → Form content huonyesha payload. Ukiunganisha mfumo wenye backend tumia form submission yako ya kawaida. Weka IDs tofauti kwa editor na ribbon kila unapoweka zaidi ya moja.

API zinazopatikana:

```javascript
editor.plugins.shotto_drawing.insert('rect');
editor.plugins.shotto_drawing.update({fill:'#4472c4',rotation:30});
editor.plugins.shotto_drawing.openSketch();
editor.plugins.shotto_page_layout.insertBlank();
editor.plugins.shotto_page_layout.insertBreak();
editor.plugins.shotto_page_layout.setSetup({size:'A4',orientation:'landscape',margin:20});
editor.plugins.shotto_math.equation();
editor.plugins.shotto_math.calculator();
editor.plugins.shotto_math.graph();
```

update() hutumika kwa selected shape na hurudisha Promise. Shape IDs zipo katika editor.plugins.shotto_drawing.categories.

## Folder

- index.html: app kuu.
- studio/: catalogue, visual editor, generator na assets za kutengeneza ZIP offline. Ukihariri source za plugins, fungua studio/repack.html kuhuisha studio/sources.js.
- examples/shotto_spellcheck.zip: plugin ya Spell Check na mfano wa fomu.
- plugins/spelling/: zana ya ukaguzi, kamusi zilizofungashwa, mafaili ya awali ya kamusi na leseni.
- examples/shotto_shapes.zip: plugin ya michoro na Shape Format kwa fomu nyingine.
- examples/shotto_exam_math.zip: plugin iliyotengenezwa na Studio kwa matumizi kwenye TinyMCE ya mfumo mwingine.
- assets/office.css na office.js: layout, form, autosave na file actions.
- ribbon/ribbon.css na ribbon.js: reusable tabbed ribbon.
- plugins/drawing/plugin.js: shape icons, manipulation na freehand.
- plugins/page-layout/plugin.js: pages, sizes na print CSS.
- plugins/mathematics/plugin.js: math runtime pamoja na fonts.
- examples/integration.html: mfano kamili wa form.
- LICENSE.txt, licenses/ na app.js.LEGAL.txt: notices za source/dependencies.
- VALIDATION.txt: ukaguzi uliofanywa na mipaka yake.

## Mipaka ya toleo hili

Muonekano unafuata screenshots; hakuna kipimo cha kuthibitisha mfanano wa 99%. Hili ni Shotto Office, halitumii brand ya Microsoft.

Page breaks/blank pages ni za mkono. Maandishi marefu yanaweza kuongeza urefu wa page; automatic Word pagination haijatekelezwa. Square wrap hutumia browser floats. Tight/Through contour wrap, linked diagram connectors, automatic headers/footers/page numbering, SmartArt, track changes, collaboration na DOCX import/export hazipo. TOC na footnotes ni HTML ya kawaida, si fields zinazojisahihisha kila page ikibadilika.

Mathematics ina formula rendering, calculations na graphs zilizotajwa; si solver ya kila swali la hisabati. Clipboard, localStorage na print hutegemea ruhusa na tabia za browser. Picha na JSON za user hufunguliwa kupitia file picker.

Source ya Shotto imepewa MIT katika LICENSE.txt. Hifadhi notices za dependencies unapogawa project.
