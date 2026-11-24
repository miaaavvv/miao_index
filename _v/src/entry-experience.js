/* A small, classic-script entrance: readable before the WebGL modules load. */
(function () {
  'use strict';
  var root = document.documentElement;
  var screen = document.getElementById('entry-screen');
  var lake = document.querySelector('.lake');
  var ua = navigator.userAgent || '';
  var wechat = /MicroMessenger/i.test(ua);
  var reading = false;
  var ready = false;
  var failed = false;
  var loadFailed = false;
  var pendingModules = 0;
  var loadTimer = 0;
  var opener;
  var guide = document.getElementById('browser-guide');
  var language = 'zh-Hans';
  var copy = {
    'zh-Hans': {
      role:'产品经理 · AI 交互与 Agent 工作流', headline:'MIAO', siteTitle:'MIAO · 产品与 AI',
      intro:'我是 MIAO。关注模型能力如何成为可参与、可验证、可交付的产品体验。',
      waiting:'页面正在加载中...', slow:'湖面还在准备，先认识一下我。',
      slowNote:'加载比平时稍慢，你可以先读项目摘要，不必等待动效。',
      unsupported:'使用 Chrome 或者 Safari 打开', unsupportedNote:'当前环境无法运行完整的动态体验。你仍然可以在这里阅读简介和项目摘要。',
      failed:'动态场景暂时没有到达', failedNote:'网络或浏览器可能影响了场景加载。建议使用 Chrome 或 Safari 打开，也可以先阅读下方内容。',
      timeout:'湖面加载有些久', timeoutNote:'场景资源暂未就绪。可以重新加载，或先读项目摘要；湖面准备好后会自动进入。',
      ready:'湖面已经就绪', enter:'进入湖面', read:'先读项目摘要', hideRead:'收起项目摘要', retry:'重新加载',
      browser:'使用系统浏览器打开', browserHint:'查看打开方式', guideTitle:'换一个窗口，继续这段旅程。',
      guideNote:'在微信中，请通过右上角菜单切换到系统浏览器。',
      step1:'点击微信右上角「···」', step2:'选择「在浏览器打开」，或类似名称的选项',
      guideOther:'如果没有这个选项，复制链接后粘贴到 Chrome 或 Safari。',
      copy:'复制链接', copied:'链接已复制', select:'请长按链接复制', close:'关闭打开方式', projects:'我正在做的事',
      rotate1:'在格拉斯哥艺术学院，读过服务设计硕士', rotate2:'本科在宁波诺丁汉，学习工业设计', rotate3:'做过 C 端产品，也做过 B 端 SaaS', rotate4:'在潮汐，探索冥想与睡眠产品', rotate5:'让 AI 混音，保留继续编辑的空间', rotate6:'让 AI 拆出的书摘，走进岛读 App', rotate7:'让 Agent 一起工作，也让审核可追溯', rotate8:'为整夜睡眠监测，推进更稳的方案', rotate9:'在 36 氪，把用户访谈变成产品设计', rotate10:'做过面向美股投资者的 AI 产品', rotate11:'优化 RAG，让检索结果更准确', rotate12:'用 200 条 Case，检验 AI 生成质量', rotate13:'用批量评测工具，减少重复测试', rotate14:'从用户访谈，走到 A/B 实验与验证', rotate15:'借助 AI，参与从需求到上线的交付', rotate16:'和 Codex、AirBuild 一起，把想法做出来',
      mix:'AI 交互式混音', mixNote:'设计生成、编辑与质量评测的完整体验。',
      agent:'Multi-Agent 内容生产', agentNote:'AI 拆书、审核，再发布到岛读 App。',
      sleep:'睡眠监测可靠性', sleepNote:'从进程消耗、平台能力与官方沟通推进保活方案。',
      small:'C 端产品经验 · B 端 SaaS 实践 · 从需求到交付',
      nojs:'当前浏览器未运行 JavaScript。你可以先阅读这些内容，或使用启用 JavaScript 的 Chrome / Safari 打开。'
    },
    'zh-Hant': {
      role:'產品經理 · AI 互動與 Agent 工作流程', headline:'MIAO', siteTitle:'MIAO · 產品與 AI',
      intro:'我是 MIAO。關注模型能力如何成為可參與、可驗證、可交付的產品體驗。',
      waiting:'頁面正在載入中...', slow:'湖面還在準備，先認識一下我。', slowNote:'載入比平時稍慢，你可以先讀專案摘要，不必等待動效。',
      unsupported:'使用 Chrome 或 Safari 開啟', unsupportedNote:'目前環境無法執行完整的動態體驗。你仍然可以在這裡閱讀簡介與專案摘要。',
      failed:'動態場景暫時沒有到達', failedNote:'網路或瀏覽器可能影響了場景載入。建議使用 Chrome 或 Safari 開啟，也可以先閱讀下方內容。',
      timeout:'湖面載入有些久', timeoutNote:'場景資源尚未就緒。可以重新載入，或先讀專案摘要；湖面準備好後會自動進入。',
      ready:'湖面已經就緒', enter:'進入湖面', read:'先讀專案摘要', hideRead:'收起專案摘要', retry:'重新載入',
      browser:'使用系統瀏覽器開啟', browserHint:'檢視開啟方式', guideTitle:'換一個視窗，繼續這段旅程。',
      guideNote:'在微信中，請透過右上角選單切換到系統瀏覽器。',
      step1:'點擊微信右上角「···」', step2:'選擇「在瀏覽器開啟」，或類似名稱的選項', guideOther:'如果沒有這個選項，複製連結後貼到 Chrome 或 Safari。',
      copy:'複製連結', copied:'連結已複製', select:'請長按連結複製', close:'關閉開啟方式', projects:'我正在做的事',
      rotate1:'在格拉斯哥藝術學院，讀過服務設計碩士', rotate2:'本科在寧波諾丁漢，學習工業設計', rotate3:'做過 C 端產品，也做過 B 端 SaaS', rotate4:'在潮汐，探索冥想與睡眠產品', rotate5:'讓 AI 混音，保留繼續編輯的空間', rotate6:'讓 AI 拆出的書摘，走進島讀 App', rotate7:'讓 Agent 一起工作，也讓審核可追溯', rotate8:'為整夜睡眠監測，推進更穩的方案', rotate9:'在 36 氪，把使用者訪談變成產品設計', rotate10:'做過面向美股投資者的 AI 產品', rotate11:'最佳化 RAG，讓檢索結果更準確', rotate12:'用 200 條 Case，檢驗 AI 生成品質', rotate13:'用批次評測工具，減少重複測試', rotate14:'從使用者訪談，走到 A/B 實驗與驗證', rotate15:'藉助 AI，參與從需求到上線的交付', rotate16:'和 Codex、AirBuild 一起，把想法做出來',
      mix:'AI 互動式混音', mixNote:'設計生成、編輯與品質評測的完整體驗。', agent:'Multi-Agent 內容生產', agentNote:'AI 拆書、審核，再發布到島讀 App。',
      sleep:'睡眠監測可靠性', sleepNote:'從程序消耗、平台能力與官方溝通推進保活方案。',
      small:'C 端產品經驗 · B 端 SaaS 實踐 · 從需求到交付', nojs:'目前瀏覽器未執行 JavaScript。可先閱讀內容，或使用啟用 JavaScript 的 Chrome / Safari 開啟。'
    },
    en: {
      role:'Product Manager · AI Interaction & Agent Workflows', headline:'MIAO', siteTitle:'MIAO · Product & AI',
      intro:'I’m MIAO. I turn model capabilities into product experiences people can shape, evaluate and use.',
      waiting:'The page is loading...', slow:'While the lake takes shape, meet MIAO.', slowNote:'Loading is taking a little longer. You can read the project summaries without waiting for the animation.',
      unsupported:'Open in Chrome or Safari', unsupportedNote:'This environment cannot run the full interactive experience. You can still read my introduction and project summaries here.',
      failed:'The scene could not arrive just yet', failedNote:'The network or browser may have interrupted loading. Try Chrome or Safari, or read the summaries below.',
      timeout:'The lake is taking a little longer', timeoutNote:'The scene resources are not ready yet. Reload or read the project summaries; the lake will open when ready.',
      ready:'The lake is ready', enter:'Enter the lake', read:'Read project summaries', hideRead:'Hide project summaries', retry:'Reload',
      browser:'Open in your system browser', browserHint:'See how to open', guideTitle:'A new window. The same journey.',
      guideNote:'In WeChat, use the top-right menu to continue in your system browser.',
      step1:'Tap ··· at the top right in WeChat', step2:'Choose “Open in browser”, or a similarly named option', guideOther:'If that option is missing, copy the link and paste it into Chrome or Safari.',
      copy:'Copy link', copied:'Link copied', select:'Press and hold the link to copy it', close:'Close browser instructions', projects:'What I work on',
      rotate1:'Master’s · Glasgow School of Art', rotate2:'Industrial design at Nottingham Ningbo', rotate3:'Consumer products and B2B SaaS', rotate4:'Meditation and sleep products at TIDE', rotate5:'AI sound mixing that users can still edit', rotate6:'AI book notes, published in Daodu', rotate7:'Agents working together, traceable reviews', rotate8:'More reliable overnight sleep monitoring', rotate9:'User interviews shaping products at 36Kr', rotate10:'AI tools for US-equity investors', rotate11:'Better retrieval through RAG improvements', rotate12:'200 cases to evaluate AI generation', rotate13:'Batch evaluation, less repetitive testing', rotate14:'From interviews to A/B experiments', rotate15:'With AI, from requirements to release', rotate16:'Building ideas with Codex and AirBuild',
      mix:'AI interactive mixing', mixNote:'A complete experience for generating, editing and evaluating creative output.', agent:'Multi-agent content production', agentNote:'AI book extraction and review, published to Daodu.',
      sleep:'Reliable sleep monitoring', sleepNote:'Background reliability through resource efficiency, platform capabilities and official communication.',
      small:'Consumer products · B2B SaaS · From requirements to delivery', nojs:'JavaScript is unavailable. Read the content here, or open in Chrome / Safari with JavaScript enabled.'
    }
  };
  // Shuffle once per entrance; translated text keeps the same fact IDs.
  function prepareTicker(){
    var order=[], nodes=[], all=document.querySelectorAll('[data-entry-text]'), i;
    for(i=1;copy.en['rotate'+i];i++)order.push(i);
    for(i=0;i<all.length;i++)if(/^rotate\d+$/.test(all[i].getAttribute('data-entry-text')))nodes.push(all[i]);
    if(nodes.length!==order.length+1)return;
    for(i=order.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),swap=order[i];order[i]=order[j];order[j]=swap;}
    try{
      var last=Number(sessionStorage.getItem('miao.entry.lastFact'));
      if(order.length>1&&order[0]===last){var other=1+Math.floor(Math.random()*(order.length-1)),first=order[0];order[0]=order[other];order[other]=first;}
      sessionStorage.setItem('miao.entry.lastFact',String(order[0]));
    }catch(e){/* Random order still works when storage is unavailable. */}
    for(i=0;i<order.length;i++)nodes[i].setAttribute('data-entry-text','rotate'+order[i]);
    nodes[order.length].setAttribute('data-entry-text','rotate'+order[0]);
  }
  function t(key) { return copy[language][key] || copy.en[key] || key; }
  function translate() {
    var nodes = document.querySelectorAll('[data-entry-text]');
    for (var i=0;i<nodes.length;i++) nodes[i].textContent=t(nodes[i].getAttribute('data-entry-text'));
    document.getElementById('entry-read').textContent=t(reading?'hideRead':'read');
    document.getElementById('entry-headline').textContent=t(failed ? screen.getAttribute('data-state') : 'headline');
    var note=screen.getAttribute('data-state');
    document.getElementById('entry-note').textContent=t(failed?note+'Note':note==='slow'?'slowNote':'intro');
    document.getElementById('entry-status').textContent=t(ready?'ready':'waiting');
    document.getElementById('entry-note').hidden=!failed;
    document.getElementById('entry-loading').hidden=failed || ready;
    document.getElementById('entry-read').hidden=!failed && !reading;
    document.getElementById('browser-guide-close').setAttribute('aria-label',t('close'));
    document.getElementById('entry-browser').hidden=!wechat || screen.hidden || screen.getAttribute('data-state')==='ready';
    document.title=t('siteTitle');
    screen.setAttribute('lang',language); guide.setAttribute('lang',language);
  }
  try { language=localStorage.getItem('miao.language.v1') || ''; } catch(e) { language=''; }
  if (!copy[language]) {
    var lang=(navigator.language || '').toLowerCase();
    language=/^zh.*(?:tw|hk|mo|hant)/.test(lang)?'zh-Hant':/^zh/.test(lang)?'zh-Hans':'en';
  }
  function show(mode) {
    failed=mode==='unsupported'||mode==='failed'||mode==='timeout';
    if(failed)ready=false;
    screen.setAttribute('data-state',mode);screen.hidden=false;if(lake&&!lake.inert)lake.inert=true;
    document.getElementById('entry-retry').hidden=!failed;
    document.getElementById('entry-enter').hidden=!ready;
    translate();
  }
  function dismiss() { screen.hidden=true; document.getElementById('entry-browser').hidden=true; if (lake&&lake.inert) lake.inert=false; }
  function openGuide(event) {
    opener=event.currentTarget;guide.hidden=false;
    document.getElementById('browser-guide-close').focus();
  }
  function closeGuide() { guide.hidden=true; if(opener&&!screen.hidden)opener.focus();else {var brand=document.querySelector('.local-brand');if(brand)brand.focus();} }
  document.getElementById('entry-read').addEventListener('click',function(){
    reading=!reading;document.getElementById('entry-details').hidden=!reading;document.getElementById('entry-read').setAttribute('aria-expanded',String(reading));translate();
  });
  document.getElementById('entry-retry').addEventListener('click',function(){location.reload();});
  document.getElementById('entry-enter').addEventListener('click',dismiss);
  var browserButtons=document.querySelectorAll('[data-open-browser]');
  for(var b=0;b<browserButtons.length;b++) browserButtons[b].addEventListener('click',openGuide);
  document.getElementById('browser-guide-close').addEventListener('click',closeGuide);
  guide.addEventListener('click',function(e){if(e.target===guide)closeGuide();});
  guide.addEventListener('keydown',function(e){
    if(e.key==='Escape'){e.preventDefault();closeGuide();}
    if(e.key==='Tab') {
      var items=guide.querySelectorAll('button,input');var first=items[0],last=items[items.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
    }
  });
  var url=location.href.split('#')[0];
  document.getElementById('browser-link').value=url;
  document.getElementById('browser-copy').addEventListener('click',function(){
    var status=document.getElementById('browser-copy-status');
    function manual(){var field=document.getElementById('browser-link');field.focus();field.select();status.textContent=t('select');}
    if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(url).then(function(){status.textContent=t('copied');},manual);
    else manual();
  });
  prepareTicker();
  root.classList.toggle('is-wechat',wechat);
  
  document.getElementById('entry-browser').hidden=!wechat;
  document.addEventListener('miao:languagechange',function(e){if(copy[e.detail.language]){language=e.detail.language;translate();}});
  translate();
  if(typeof MutationObserver==='undefined'){show('unsupported');return;}
  function checkReadiness(){
    // The original arrival helper may unlock the lake after its base frame.
    if(lake&&!screen.hidden&&!lake.inert)lake.inert=true;
    if(loadFailed){show('failed');return;}
    if(root.classList.contains('webgl-unavailable')) {show('failed');return;}
    // The UI module imports the core itself. Its explicit completion signal is
    // stronger than waiting for both injected script load callbacks to arrive.
    var uiReady=root.getAttribute('data-miao-ui-ready')==='true';
    var presented=root.getAttribute('data-lake-presented');
    if((presented==='full'||presented==='fallback') && root.classList.contains('water-ready') && (pendingModules===0 || uiReady)) {
      clearTimeout(loadTimer);
      ready=true;failed=false;if(root.classList.contains('is-arriving'))root.classList.remove('is-arriving');screen.setAttribute('data-state','ready');
      document.getElementById('entry-enter').hidden=false;
      if(!reading)dismiss();else {translate();setTimeout(function(){if(reading&&!screen.hidden&&lake&&!lake.inert)lake.inert=true;},0);}
    }
  }
  var observer=new MutationObserver(checkReadiness);
  observer.observe(root,{attributes:true,attributeFilter:['class','data-miao-ui-ready','data-lake-presented']});
  if(lake)observer.observe(lake,{attributes:true,attributeFilter:['inert']});
  document.addEventListener('miao:uiready',checkReadiness);
  document.addEventListener('miao:lakeready',checkReadiness);
  var capable=('noModule' in document.createElement('script'))&&typeof Promise!=='undefined'&&typeof fetch==='function'&&typeof AbortController!=='undefined';
  var preflight=root.getAttribute('data-miao-webgl2');
  if(preflight!==null)capable=capable&&preflight==='true';
  else if(capable) {
    try {
      var canvas=document.createElement('canvas');var gl=canvas.getContext('webgl2');
      capable=!!gl;
      if(gl){var lose=gl.getExtension('WEBGL_lose_context');if(lose)lose.loseContext();}
    } catch(e) {capable=false;}
  }
  if(!capable) {show('unsupported');return;}
  var modules=document.querySelectorAll('script[data-lake-module]');
  pendingModules=modules.length;
  for(var m=0;m<modules.length;m++) {
    var script=document.createElement('script');script.type='module';script.src=modules[m].getAttribute('src');
    script.onload=function(){pendingModules--;checkReadiness();};
    script.onerror=function(){loadFailed=true;show('failed');};document.body.appendChild(script);
  }
  setTimeout(function(){if(!ready&&!failed)show('slow');},10000);
  // A stalled texture request must not leave an unusable loading button
  // forever. Keep loading in the background so a genuine first frame recovers.
  function armLoadTimeout(){
    clearTimeout(loadTimer);
    if(ready||failed||document.hidden)return;
    loadTimer=setTimeout(function(){checkReadiness();if(!ready&&!failed&&!document.hidden)show('timeout');},45000);
  }
  document.addEventListener('visibilitychange',function(){checkReadiness();armLoadTimeout();});
  window.addEventListener('pageshow',function(){checkReadiness();armLoadTimeout();});
  armLoadTimeout();
})();
