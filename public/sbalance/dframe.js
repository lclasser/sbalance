const _common_page={_event_function2(e,n,r){e=$._data(e,"events");if(console.log("_event_function2:",e),e&&null!=e[n]&&(stracer("_event_function2").frm("events :",e),1==e[n][0].handler(jQuery.Event(n),r)))return!0},_event_function(e,t){e.each(function(e,n){var r=Function(n.getAttribute(t));if(null!=r)return r.call(n)})}};function dframeInitialize(e){e=dframeCreate(e,null);return window.dframeInitialize=null,stracer("pageAlloc").frm("initialize page.js $(function() {..."),e}function dframeCreate(e,n){var r=null;return(r=null!=n?n.find("#"+e):$("#"+e)).attr("page-declare","dframe"),{_element_id:e,_history:[],_$body:r,_owner:n,get$body:function(){return this._$body},getOwner:function(){return this._owner},send:function(e,n){var r,t=$("[page-declare]"),a=t.length-1;for(stracer("frameAlloc").frm("send $parray:",t.length);0<=a;a--)if(r=t[a],null!=(r=$(r).triggerHandler(jQuery.Event(e),n)))return r;$(window.document).trigger(jQuery.Event(e),n)},getReference:window.SBalance.getReference,makePageLink:function(e){var n=this;null!=(e=e||n._$body)&&(stracer("frameAlloc").frm("makePageLink:",n,e.find("[page-link]")),e.find("[page-link]").on("click",function(){stracer("frameAlloc").frm("page-link click..."),n.openPage($(this).attr("page-link"),$(this).text(),$(this))}))},makePageInclude:function(e){var n;if(null!=(e=e||this._$body))return n=Promise.resolve(),e.find("[page-include]").each(function(e,r){var t=$(r).attr("page-include");n=n.then(function(){return new Promise(function(n,e){stracer("makePageInclude").log("page loaded:",t),$.get(t,function(e){$(r).removeAttr(tag_name,""),$(r).html(e),n()})})})}),n},getHistory:function(){return this._history},addHistory:function(e){this._history.push(e)},popHistory:function(){var e=this,n=(stracer("frameAlloc").frm("backHistory...",e._history),e._history.length-1);if(!(n<=0))return e._history.pop(),e._history[n-1]},on:function(e,r){var t=this;return this._$body.on(e,function(e,n){return r.call(t,e,n)}),this},openPage:function(n,e,t,a){var o=this;try{if(null==o._$body)throw new Error("self._$body: invalid body.");if(null==n)throw new Error("self.openPage: invalid page_file.")}catch(e){return void stracer("openPage").err(e)}n="object"==typeof n?(e=n.title,n.file):(e=e&&e.trim(),n&&n.trim());var i=dpageCreate(e,n,t,o),e=(SBalance.setTimewait(!0),stracer("openPage").frm(`0.2 [${o._element_id}] : get~~~`,o._element_id),n);return $.get(e,function(e){try{var r=o._$body.children("[page-declare='dpage']");r&&0<r.length&&(stracer("openPage").frm(`0.5 [${o._element_id}]: onclose trigger.`,r),o._$body.triggerHandler(jQuery.Event("page_close"),r[0]&&r[0].getPage())),stracer("openPage").frm(`1.0 [${o._element_id}] : body.thml.`),o._$body.html(e),(r=i.$page=o._$body.children("[page-declare='dpage']")).each(function(e,n){stracer("openPage").frm(`2.0 [${o._element_id}]: element link.`,r),n.getPage=function(){return i},n.getParam=function(){return t}}),stracer("openPage").frm(`3.0 [${o._element_id}]: onPageOpen.`,r),null==a?o._$body.triggerHandler(jQuery.Event("page_open"),i,t):(a(i),a=null),o.makePageInclude(o._$body).then(function(){stracer("openPage").frm(`6.0 [${o._element_id}]: onPageLoad...`),o._$body.triggerHandler(jQuery.Event("page_load"),i)}),stracer("openPage").frm(`4.0 [${o._element_id}]: onload trigger (before).`,r),_common_page._event_function(r,"onopen"),o._$body.ready(function(){stracer("openPage").frm(`12 [${o._element_id}]: onPageReady...`),o._$body.triggerHandler(jQuery.Event("page_ready"),i),_common_page._event_function(r,"onload")})}catch(e){stracer("openPage").err(`error[${n}]:`,e),i.error=e,a&&a(i)}stracer("openPage").frm(`5.0 [${o._element_id}]: openPage finish.`,r),SBalance.setTimewait(!1)}).catch(function(e){SBalance.setTimewait(!1),stracer("openPage").err(`response.catch[${n}]:`,e),401==e.status&&(window.location="/")}),i}}}