const _common_sbalance={setTimewait(n){var e=$("#screen-waitor");1==n?e.css("display","flex"):e.css("display","none")},getReference:function(n,e){return window._refernce=window._refernce||e||{},window._refernce[n]=window._refernce[n]||{},window._refernce[n]}};function createSBalance(){null==window.SBInterface?(window.SBInterface={m_signin:null,getMode:function(){return"web"},showMain:function(){},readMessage:function(n,e){return!1},shareLink:function(n,e){null==navigator.share?stracer("SInterface").log("공유하기를 지원하지 않는 환경입니다."):navigator.share({title:"SBalance",text:e,url:""+n+e})},isRememberMe:function(){return null!=this.m_signin&&this.m_signin.is_rememberme},getRememberMe:function(){return JSON.stringify(this.m_signin)},isEnableSMS:function(){return null},setEnableSMS:function(n){},onSignin:function(n,e){return m_signin=n&&JSON.parse(n),1==e?localStorage.setItem("signin",n):localStorage.setItem("signin",""),!0},onSignout:function(){localStorage.setItem("signin","")}},window.SBInterface.m_signin=localStorage.getItem("signin"),null==window.SBInterface.m_signin||window.SBInterface.m_signin.length<=0?window.SBInterface.m_signin=null:window.SBInterface.m_signin=JSON.parse(window.SBInterface.m_signin),stracer("SInterface").log("load:",window.SBInterface.m_signin),history.pushState(null,null,location.href),window.onpopstate=function(n){history.pushState(null,document.title,location.href),window.SBalance.onBackPressed()}):stracer("SInterface").log("Mobile-Mode..."),window.SBalance={m_cache:{},m_signin:null,m_mframe:null,is_closing:!1,setTimewait:_common_sbalance.setTimewait,getReference:_common_sbalance.getReference,isEnableSMS:function(){return window.SBInterface.isEnableSMS()},setEnableSMS:function(n){window.SBInterface.setEnableSMS(n)},getMode:function(){return window.SBInterface.getMode()},getArgs:function(n){return n?this._args[n]:this._args},readMessage:function(n,e,t){var a=this;a.m_cache.readMessage={onRead:function(n){e(n)},onFinish:function(n){a.m_cache.readMessage=null,t(n)}},0==window.SBInterface.readMessage(JSON.stringify(n),"SBalance.m_cache.readMessage")&&t(0)},shareLink:function(n){return window.SBInterface.shareLink("",n)},isRememberMe:function(){return window.SBInterface.isRememberMe()},getRememberMe:function(){return JSON.parse(window.SBInterface.getRememberMe())},getSignin:function(n){return null==this.m_signin?null:null!=n?this.m_signin[n]:this.m_signin},getFrame:function(){return this.m_mframe},setFrame:function(n){this.m_mframe=n},request:function(n,e,t){var o={then(n){return this.promise=this.promise.then(n),this},catch(n){return this.promise=this.promise.catch(n),this},promise:Promise.resolve()};return o.then(function(){return new Promise(function(t,a){_common_sbalance.setTimewait(!0),$.post(n,e).done(function(n){var e;null!=n.error&&"Y"!=n.error.success?(null!=(e=parseInt(n.error.code)||null)&&e<0&&(stracer("SBalance").err("request error:",n.error),setTimeout(function(){window.location="/"},0)),o.catch(function(n){window.toast({title_class:"bg-danger text-white",title_text:"오류",mesg_text:n.message})}),a(n.error)):t(n)}).fail(function(n,e,t){t=new Error(`서버 응답 오류 입니다. (${t||e})`);o.catch(function(n){window.toast({title_class:"bg-danger text-white",title_text:"오류",mesg_text:n.message})}),a(t)}).always(function(){_common_sbalance.setTimewait(!1)})})}),o},onBackPressed:function(){var e=this,n=!1;null!=window.dmodal&&0!=window.dmodal.isOpen()?window.dmodal.close(null):null!=e.getFrame()?null==e.getFrame().send("backward")&&(stracer("SBalance").log("modal.exit doModal..."),n=!0):n=!0,1==n&&1!=e.is_closing&&(e.is_closing=!0,"web"==window.SBInterface.getMode()?this.onSignout(function(n){e.is_closing=!1}):window.openModal("https://lclasser.github.io/sbalance/pages/modal/modal.exit.html",null,function(n){stracer("SBalance").log("modal.exit result:",n),e.is_closing=!1,null!=n&&window.SBInterface.exit()}))},onRefresh:function(){stracer("SBalance").log("onRefresh:",$("page")),this.getFrame()&&this.getFrame().send("refresh")},onSignout:function(e){null==this.getFrame()?window.location="/":window.openModal("https://lclasser.github.io/sbalance/pages/main/modal/modal.signout.html",null,function(n){n&&n.data&&null!=n.data.location?(window.SBInterface.onSignout(),onMainDestroy(),window.location="/?type=passive"):e&&e(!1)})},onSignin(n,e){var t,a=this;return 1!=n?(window.SBInterface.onSignin(null,!1),a.onDisplay("sign").then(function(){stracer("SBalance").log("SBInterface.onDisplay(null)"),window.SBInterface.showMain()})):(t="sign",e&&1==window.SBInterface.onSignin(JSON.stringify(e),e.is_rememberme)&&(a.m_signin=e,a.getMode(),t="main"),a.onDisplay(t).then(function(){stracer("SBalance").log(`SBInterface.onDisplay(${t})`),window.SBInterface.showMain()}))},onDisplay:function(n){}},window.SBalance._args=parameterFromUrl(location.href),history.replaceState({},null,"/"),stracer("SBalance").log("SBalance._args:",window.SBalance._args),stracer("SBalance").log("createInterface:"+window.SBalance.getMode()+", rememberme:"+window.SBalance.isRememberMe())}function onMainInit(){createSBalance()}function onMainDestroy(){window.SBalance.setFrame(null)}function includePage(i,n){var e;if(null!=n)return e=Promise.resolve(),n.find(`[${i}]`).each(function(n,a){var o=$(a).attr(i);e=e.then(function(){return new Promise(function(e,n){stracer("includePage").log("page loaded:",o),o.indexOf(".html")<0&&(o+=".html");var t="https://lclasser.github.io/sbalance/pages"+o;$.get(t,function(n){$(a).removeAttr(i,""),$(a).html(n),e()})})})}),e}function getStringByCateType(n){switch(n){case"N":return"일반";case"T":return"이체 계좌";case"E":return"예외 (일별만 표시)"}return"(알수 없음)"}function getStringByAccountType(n){switch(n){case"A":return"자동";case"S":return"본인";case"L":return"공유"}return"(알수 없음)"}window.openModal=function(n,e,t){null!=e&&null==t&&"function"==typeof e&&(t=e,e=null);var a=window.dmodal;return null==a&&((a={getReference:_common_sbalance.getReference,$modal:$("#dialog_modal"),_pages:[],_data:null,isOpen:function(){return null!=this._data},getParam:function(){return this._data.param},getModal:function(){return this.$modal},exit:function(n){var e=this,t=(stracer("Modal").log("doModal: exit()..."),e._pages.pop());e._pages=[],null==e._data?null!=t&&t.callback&&(t.callback(n,t.param),t.callback=null):(e._data=t||e._data,e._data.result=n,e._data.is_closing=!1,e.$modal.modal("hide"))},close:function(n){var e=this;stracer("Modal").log("doModal: close()..."),null==e._data||null!=e._data.is_closing?stracer("Modal").log("doModal: close()... already"):(e._data.result=n,e._data.is_closing=!1,stracer("Modal").log("doModal: close()... hide"),e.$modal.modal("hide"))},_open:function(){var n,e=this;stracer("Modal").log("doModal: _open",e._data),e._data=e._pages.shift(),null==e._data?(stracer("Modal").log("doModal: _data clear."),_common_sbalance.setTimewait(!1)):(e._data.is_closing=null,e._data._no_close=null,n=e._data.file,$.get(n,function(n){e.$modal.ready(function(){stracer("Modal").log("doModal: onready...",e.$modal),e.$modal.modal("show")}),e.$modal.html(n),_common_sbalance.setTimewait(!1)}).catch(function(n){stracer("Modal").log("doModal: get err:",n),e.close(),_common_sbalance.setTimewait(!1),401==n.status&&(window.location="/")}))}}).$modal.on("hidden.bs.modal",function(){stracer("Modal").log("doModal: hidden.bs.modal... 1"),a._data.is_closing=!0,a.$modal.empty(),setTimeout(function(){stracer("Modal").log("doModal: hidden.bs.modal... 2");var n=a._data,e=null;a._data=null,n.callback&&1!=n._no_close&&(e=n.callback(n.result,n.param),n.callback=null),null!=e?e.then(function(){null==a._data&&a._open()}):null==a._data&&a._open()},0)}),a.$modal.on("shown.bs.modal",function(){stracer("Modal").log("doModal: shown.bs.modal..."),a.$modal.focus(),a._data.param&&a._data.param._oninit&&a._data.param._oninit()}),window.dmodal=a),null!=a._data&&null==a._data.is_closing&&(a._data._no_close=!0,a._pages.unshift(a._data)),_common_sbalance.setTimewait(!0),stracer("Modal").log("window.openModal: starting..."),a._pages.unshift({file:n,param:e,callback:t,result:null}),null==a._data?(stracer("Modal").log("window.openModal: openning..."),a._open()):(stracer("Modal").log("window.openModal: closing..."),a.close()),a},window.toast=function(n){function e(n,e){var t=n.find(".toast-header"),t=(t.find(".toast-title").html(e.title_text),e.title_class&&(t.attr("class","toast-header"),t.addClass(e.title_class),t.find("button").attr("class","btn").addClass(e.title_class)),n.find(".toast-body"));t.attr("class","toast-body"),t.html(e.mesg_text),e.mesg_class&&t.addClass(e.mesg_class),n.parent().css("display","block"),window.dtoast.toast=new bootstrap.Toast(n[0],{delay:3e3}),window.dtoast.toast.show()}var t;window.dtoast=window.dtoast||{toast:null,queue:[]},null==window.dtoast.toast?null==(t=$("#alert_toast"))||t.length<=0||(e(t,n),t.on("hidden.bs.toast",function(){var n;null!=window.dtoast&&(0<window.dtoast.queue.length?(n=window.dtoast.queue.shift(),e(t,n)):(t.parent().css("display","none"),window.dtoast=null))})):window.dtoast.queue.push(n)},window.popver=function(o,n,e){var i=$('<div class="w-100 h-100 position-fixed left-0 top-0" style="z-index:1060;background-color:#000;opacity: .5;"></div>'),l=$('<div class="w-100 h-100 position-fixed left-0 top-0" tabindex="-1" style="z-index:1065; display:none;"></div>');function s(n,t){n.each(function(n,e){e=Function(e.getAttribute(t));null!=e&&e.call(a)})}$("body").append(l),_common_sbalance.setTimewait(!0);var a={$body:l,find:function(n){return this.$body.find(n)},getPage:function(){return this.$body.find("page")},getParam:function(){return n},_open:function(n,e,t){var a=this;$.get(o,function(n){stracer("Popver").log("self.$body:",a.$body),a.$body.ready(function(){$("body").append(i),s(a.$body.children("page"),"onload"),l.show(),l.focus()}),a.$body.html(n),s(a.$body.children("page"),"onopen"),l.find("[data-bs-dismiss]").unbind("click"),l.find("[data-bs-dismiss]").click(function(n){stracer("Popver").log("click:",n),a.close(),n.preventDefault()}),_common_sbalance.setTimewait(!1)}).catch(function(n){stracer("Popver").error(n),a.close(),_common_sbalance.setTimewait(!1)})},close:function(n){l.remove(),i.remove(),s(this.$body.children("page"),"onclose"),e&&e(n),e=null}},t=(a._open(o,n,e),l[0].addEventListener("mousedown",function(n){var e,t=$(this).find(".modal-content");null==t||t.length<=0||(t=(t=t[0]).getClientRects()[0],e=!1,1!=(e=n.clientX>=t.left&&n.clientX<=t.right&&n.clientY>=t.top&&n.clientY<=t.bottom?!0:e)&&a.close())}),document.activeElement);return l[0].addEventListener("keydown",function(n){stracer("Popver").log("keydown:",n),"Escape"==n.key&&(a.close(),null!=t)&&$(t).focus()}),a};