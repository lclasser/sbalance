const _common_sbalance={setTimewait(n){var e=$("#screen-waitor");1==n?e.css("display","flex"):e.css("display","none")},getReference:function(n,e){return window._refernce=window._refernce||e||{},window._refernce[n]=window._refernce[n]||{},window._refernce[n]}};function createSBalance(){null==window.SBInterface?(window.SBInterface={m_signin:null,getMode:function(){return"web"},showMain:function(){},readMessage:function(n,e){return!1},shareLink:function(n,e){null==navigator.share?console.log("공유하기를 지원하지 않는 환경입니다."):navigator.share({title:"SBalance",text:e,url:""+n+e})},isRememberMe:function(){return null!=this.m_signin&&this.m_signin.is_rememberme},getRememberMe:function(){return JSON.stringify(this.m_signin)},isEnableSMS:function(){return null},setEnableSMS:function(n){},onSignin:function(n){return localStorage.setItem("signin",n),!0},onSignout:function(){this.m_signin.is_rememberme=!1,localStorage.setItem("signin",JSON.stringify(this.m_signin))}},window.SBInterface.m_signin=localStorage.getItem("signin"),window.SBInterface.m_signin=JSON.parse(window.SBInterface.m_signin),console.log("SBInterface.sign:",window.SBInterface.m_signin),history.pushState(null,null,location.href),window.onpopstate=function(n){history.pushState(null,document.title,location.href),window.SBalance.onBackPressed()}):console.log("Mobile-Mode..."),window.SBalance={m_cache:{},m_signin:null,m_mframe:null,is_closing:!1,setTimewait:_common_sbalance.setTimewait,getReference:_common_sbalance.getReference,isEnableSMS:function(){return window.SBInterface.isEnableSMS()},setEnableSMS:function(n){window.SBInterface.setEnableSMS(n)},getMode:function(){return window.SBInterface.getMode()},getArgs:function(n){return n?this._args[n]:this._args},readMessage:function(n,e,o){var t=this;t.m_cache.readMessage={onRead:function(n){e(n)},onFinish:function(n){t.m_cache.readMessage=null,o(n)}},0==window.SBInterface.readMessage(JSON.stringify(n),"SBalance.m_cache.readMessage")&&o(0)},shareLink:function(n){return window.SBInterface.shareLink("https://sbalance.duckdns.org",n)},isRememberMe:function(){return window.SBInterface.isRememberMe()},getRememberMe:function(){return JSON.parse(window.SBInterface.getRememberMe())},getSignin:function(n){return null==this.m_signin?null:null!=n?this.m_signin[n]:this.m_signin},getFrame:function(){return this.m_mframe},setFrame:function(n){this.m_mframe=n},request:function(n,o,e){_common_sbalance.setTimewait(!0);var t=new Promise(function(e,t){$.post(n,o).done(function(n){null!=n.error&&"Y"!=n.error.success?(null!=n.error.code&&(stracer("request").err("error:",n.error),setTimeout(function(){window.location="/"},0)),window.toast({title_class:"bg-danger text-white",title_text:"정보 오류",mesg_text:n.error.message}),e(null)):e(n)}).fail(function(n,e,o){o=new Error(`서버 응답 오류 입니다. (${o||e})`);o.kind="server",t(o)})});return setTimeout(function(){t.finally(function(){_common_sbalance.setTimewait(!1)})},0),t},onBackPressed:function(){var e=this,n=!1;null!=window.dmodal&&0!=window.dmodal.isOpen()?window.dmodal.close(null):null!=e.getFrame()?null==e.getFrame().send("backward")&&(console.log("modal.exit doModal..."),n=!0):n=!0,1==n&&1!=e.is_closing&&(e.is_closing=!0,"web"==window.SBInterface.getMode()?this.onSignout(function(n){e.is_closing=!1}):window.openModal("https://lclasser.github.io/sbalance/pages/modal/modal.exit.html",null,function(n){console.log("modal.exit result:",n),e.is_closing=!1,null!=n&&window.SBInterface.exit()}))},onRefresh:function(){console.log("onRefresh:",$("page")),this.getFrame()&&this.getFrame().send("refresh")},onSignout:function(e){null==this.getFrame()?window.location="/":window.openModal("https://lclasser.github.io/sbalance/pages/main/modal/modal.signout.html",null,function(n){n&&n.data&&null!=n.data.location?(window.SBInterface.onSignout(),onMainDestroy(),window.location="/?type=passive"):e&&e(!1)})},onSignin(n,e,o){var t,a=this;1!=n?a.onDisplay("sign").then(function(){console.log("SBInterface.onDisplay()"),window.SBInterface.showMain()}):(n=0,t="sign",e&&1==window.SBInterface.onSignin(JSON.stringify(e))&&(a.m_signin=e,n="web"!=a.getMode()?2e3:0,t="main"),setTimeout(function(){a.onDisplay(t).then(function(){console.log("SBInterface.onDisplay()"),window.SBInterface.showMain()})},n))},onDisplay:function(n){}},window.SBalance._args=parameterFromUrl(location.href),history.replaceState({},null,"/"),console.log("SBalance._args:",window.SBalance._args),console.log("createInterface:"+window.SBalance.getMode()+", rememberme:"+window.SBalance.isRememberMe())}function onMainInit(){createSBalance()}function onMainDestroy(){window.SBalance.setFrame(null)}function includePage(i,n){var e;if(null!=n)return e=Promise.resolve(),n.find(`[${i}]`).each(function(n,t){var a=$(t).attr(i);e=e.then(function(){return new Promise(function(e,n){stracer("includePage").log("page loaded:",a),a.indexOf(".html")<0&&(a+=".html");var o="https://lclasser.github.io/sbalance/pages"+a;$.get(o,function(n){$(t).removeAttr(i,""),$(t).html(n),e()})})})}),e}function getStringByCateType(n){switch(n){case"N":return"일반";case"T":return"이체 계좌";case"E":return"예외 (일별만 표시)"}return"(알수 없음)"}function getStringByAccountType(n){switch(n){case"A":return"자동";case"S":return"본인";case"L":return"공유"}return"(알수 없음)"}window.openModal=function(n,e,o){var t=window.dmodal;return null==t&&((t={getReference:_common_sbalance.getReference,$modal:$("#dialog_modal"),_pages:[],_data:null,isOpen:function(){return null!=this._data},getParam:function(){return this._data.param},getModal:function(){return this.$modal},exit:function(n){var e=this,o=(console.log("doModal: exit()..."),e._pages.pop());e._pages=[],null==e._data?null!=o&&o.callback&&(o.callback(n,o.param),o.callback=null):(e._data=o||e._data,e._data.result=n,e._data.is_closing=!1,e.$modal.modal("hide"))},close:function(n){var e=this;console.log("doModal: close()..."),null==e._data||null!=e._data.is_closing?console.log("doModal: close()... already"):(e._data.result=n,e._data.is_closing=!1,console.log("doModal: close()... hide"),e.$modal.modal("hide"))},_open:function(){var n,e=this;console.log("doModal: _open",e._data),e._data=e._pages.shift(),null==e._data?(console.log("doModal: _data clear."),_common_sbalance.setTimewait(!1)):(e._data.is_closing=null,e._data._no_close=null,n=e._data.file,$.get(n,function(n){e.$modal.ready(function(){console.log("doModal: onready...",e.$modal),e.$modal.modal("show")}),e.$modal.html(n),_common_sbalance.setTimewait(!1)}).catch(function(n){console.log("doModal: get err:",n),e.close(),_common_sbalance.setTimewait(!1),401==n.status&&(window.location="/")}))}}).$modal.on("hidden.bs.modal",function(){console.log("doModal: hidden.bs.modal... 1"),t._data.is_closing=!0,t.$modal.empty(),setTimeout(function(){console.log("doModal: hidden.bs.modal... 2");var n=t._data,e=null;t._data=null,n.callback&&1!=n._no_close&&(e=n.callback(n.result,n.param),n.callback=null),null!=e?e.then(function(){null==t._data&&t._open()}):null==t._data&&t._open()},0)}),t.$modal.on("shown.bs.modal",function(){console.log("doModal: shown.bs.modal..."),t.$modal.focus(),t._data.param&&t._data.param._oninit&&t._data.param._oninit()}),window.dmodal=t),null!=t._data&&null==t._data.is_closing&&(t._data._no_close=!0,t._pages.unshift(t._data)),_common_sbalance.setTimewait(!0),console.log("window.openModal: starting..."),t._pages.unshift({file:n,param:e,callback:o,result:null}),null==t._data?(console.log("window.openModal: openning..."),t._open()):(console.log("window.openModal: closing..."),t.close()),t},window.toast=function(n){function e(n,e){var o=n.find(".toast-header"),o=(o.find(".toast-title").html(e.title_text),e.title_class&&(o.attr("class","toast-header"),o.addClass(e.title_class),o.find("button").attr("class","btn").addClass(e.title_class)),n.find(".toast-body"));o.attr("class","toast-body"),o.html(e.mesg_text),e.mesg_class&&o.addClass(e.mesg_class),n.parent().css("display","block"),window.dtoast.toast=new bootstrap.Toast(n[0],{delay:3e3}),window.dtoast.toast.show()}var o;window.dtoast=window.dtoast||{toast:null,queue:[]},null==window.dtoast.toast?null==(o=$("#alert_toast"))||o.length<=0||(e(o,n),o.on("hidden.bs.toast",function(){var n;null!=window.dtoast&&(0<window.dtoast.queue.length?(n=window.dtoast.queue.shift(),e(o,n)):(o.parent().css("display","none"),window.dtoast=null))})):window.dtoast.queue.push(n)},window.popver=function(a,n,e){var i=$('<div class="w-100 h-100 position-fixed left-0 top-0" style="z-index:1060;background-color:#000;opacity: .5;"></div>'),l=$('<div class="w-100 h-100 position-fixed left-0 top-0" tabindex="-1" style="z-index:1065; display:none;"></div>');function s(n,o){n.each(function(n,e){e=Function(e.getAttribute(o));null!=e&&e.call(t)})}$("body").append(l),_common_sbalance.setTimewait(!0);var t={$body:l,find:function(n){return this.$body.find(n)},getPage:function(){return this.$body.find("page")},getParam:function(){return n},_open:function(n,e,o){var t=this;$.get(a,function(n){console.log("self.$body:",t.$body),t.$body.ready(function(){$("body").append(i),s(t.$body.children("page"),"onload"),l.show(),l.focus()}),t.$body.html(n),s(t.$body.children("page"),"onopen"),l.find("[data-bs-dismiss]").unbind("click"),l.find("[data-bs-dismiss]").click(function(n){console.log("click:",n),t.close(),n.preventDefault()}),_common_sbalance.setTimewait(!1)}).catch(function(n){console.error(n),t.close(),_common_sbalance.setTimewait(!1)})},close:function(n){l.remove(),i.remove(),s(this.$body.children("page"),"onclose"),e&&e(n),e=null}},o=(t._open(a,n,e),l[0].addEventListener("mousedown",function(n){var e,o=$(this).find(".modal-content");null==o||o.length<=0||(o=(o=o[0]).getClientRects()[0],e=!1,1!=(e=n.clientX>=o.left&&n.clientX<=o.right&&n.clientY>=o.top&&n.clientY<=o.bottom?!0:e)&&t.close())}),document.activeElement);return l[0].addEventListener("keydown",function(n){console.log("keydown:",n),"Escape"==n.key&&(t.close(),null!=o)&&$(o).focus()}),t};