function dpageCreate(e,t,n,r){return{getTitle:function(){return this.title},title:e,getFile:function(){return this.file},file:t,getParam:function(){return this.param},param:n,getFrame:function(){return this.frame},frame:r,getParent:function(){return this.frame.getOwner()},get$page:function(){return this.$page},$page:null,getTemper:function(){return this.temper},temper:{},createFrame:function(e){e=dframeCreate(e,this);return e&&e.makePageLink(this.$page),stracer("createFrame").frm("Z.0 [createPage] : return..."),e},on(e,n){var r=this;return this.$page.on(e,function(e,t){return n.call(r,e,t)}),this},getReference:window.SBalance.getReference,setDisplay(e){this.$page.css("display",e)},find:function(e){return this.$page.find(e)}}}function readDeviceMessages(g){var u;return null==g?new Promise(function(e,t){t(new Error("날짜를 지정해 주세요."))}):(u={row_record:null,row_device:[],row_fresh:[]},new Promise(function(o,c){window.SBalance.readMessage(g,function(e){e.msg_str=e.msg_body.replace(/(\s*|\r\n|\r|\n)/g,""),e.midx=u.row_device.length,u.row_device.push(e)},function(e){if("web"==window.SBalance.getMode()){for(var t=g.date1.slice(0,6),n=g.date1.substr(4,2),r=[],s=0;s<1;s++)r.push({usr_key:window.SBalance.getSignin().usr_key,dev_key:"a024124e-e94c-3996-b21d-2b3b989661bf",msg_phone:"15447200",msg_date:t+"16",msg_time:"0152"+("00"+s).slice(-2),msg_body:`[Web발신]
신한카드(6441)승인 최*호 30,000원(일시불)${n}/16 01:52 고양휴게소(  누적7,110,3${("00"+s).slice(-2)}원  
`,msg_event:"onRead"}),r.push({usr_key:window.SBalance.getSignin().usr_key,dev_key:"a024124e-e94c-3996-b21d-2b3b989661bf",msg_phone:"15447200",msg_date:t+"12",msg_time:"0152"+("00"+s).slice(-2),msg_body:`[Web발신]
신한카드(1580)승인 최*호       27,490원(일시불)${n}/12 21:44  쿠팡          누적6,905,354원  
`,msg_event:"onRead"}),r.push({usr_key:window.SBalance.getSignin().usr_key,dev_key:"a024124e-e94c-3996-b21d-2b3b989661bf",msg_phone:"15447200",msg_date:t+"14",msg_time:"0152"+("00"+s).slice(-2),msg_body:`[Web발신]
[신한체크승인]     최*호(8273) ${n}/14                 15:07  (금액)5,700원 티머니 법인택시  
`,msg_event:"onRead"});for(var i=["[Web발신] 신한카드(0380)승인 최*호 7,100원(일시불)06/27 18:06 씨유문래벤처 누적3,686,870원","[Web발신] [신한카드]         자동납부       정상승인 최정호님    $MONTH/10 (일시불)       7,750원 서울도시가스(주)","[web발신] 신한카드(6441)승인 최*호님       (주)에스케이브  81,180원 정상 승인","[Web발신] 신한카드(0380)승인 최*호님       SK텔레콤        78,100원 정상 승인","[Web발신] 신한카드(0380)승인 최*호님       아파트 관리비  173,720원 정상승인 되었습니다.","[Web발신] [신한체크승인]     최*호(8273)    $MONTH/14 15:07    (금액)5,700원 티머니 법인택시","[Web발신] 신한카드(6441)승인 최*호         10,400원(일시불)$MONTH/19 03:22 gs25운정비발 누적4,051,421원"],a=0;a<i.length;a++)i[a]=i[a].replace("$MONTH",n),r.push({usr_key:window.SBalance.getSignin().usr_key,dev_key:"a024124e-e94c-3996-b21d-2b3b989661bf",msg_phone:"15447200",msg_date:t+"14",msg_time:"0152"+("00"+s).slice(-2),msg_body:i[a],msg_event:"onRead"});e=(u.row_device=r).length}null==e&&e<=0?c(new Error("데이터가 없습니다.")):(stracer("readDeviceMessages").log("onRead:["+e+"] "+u.row_device.length),o(u))})}).then(function(){return window.SBalance.request("/main/message/list",g).then(function(e){return stracer("readDeviceMessages").log("/main/message/list:",e),u.row_record=e.data,u.row_device.forEach(function(t){var e;null!=t.msg_body&&(t.msg_str=t.msg_body.replace(/(\s*|\r\n|\r|\n)/g,""),null!=(e=u.row_record.find(function(e){return null!=e.msg_body&&(e.msg_str=e.msg_str||e.msg_body.replace(/(\s*|\r\n|\r|\n)/g,""),null==e.is_found&&e.msg_phone==t.msg_phone&&e.msg_date==t.msg_date&&e.msg_str==t.msg_str||void 0)}))?e.is_found=!0:(t.is_found=!1,u.row_record.push(t),u.row_fresh.push(t)))}),u})}))}function insertDeviceMessages(i,a){var e,o,n;null==i||i.length<=0?(e={title_class:"bg-secondary text-white",title_text:"문자 읽기",mesg_text:"새로운 문자가 없습니다."},window.toast(e),a.onError&&a.onError(e.mesg_text)):(o={is_break:!1,update:function(e){}},n=window.openModal("https://lclasser.github.io/sbalance/pages/main/modal/modal.progressp.html",o,function(e,t){switch(e){case"close":case"exit":null==t&&(o.is_break=!0);break;case"show":return o.update(0),window.SBalance.setTimewait(null),i.reduce(function(e,r,s){return e.then(function(){return new Promise(function(t,n){setTimeout(function(){var e;if(1!=o.is_break)return e=a.findItem&&a.findItem(r)||r,window.SBalance.request("/api/message/insert",e).then(function(e){return stracer("insertDeviceMessages").log("/api/message/insert res:",e),o.update(Math.floor(100*(s+1)/i.length)),"Y"==e.error.success?t():n(new Error(e.error.message))});n(new Error("SMS 저장 작업이 취소 되었습니다."))},10)})})},Promise.resolve()).then(function(){setTimeout(function(){n.close(!0),window.toast({title_class:"bg-success text-white",title_text:"문자 읽기",mesg_text:"SMS 저장 작업을 완료하었습니다."}),a.onFinish&&a.onFinish()},0)}).catch(function(e){setTimeout(function(){n.close(!1),1==o.is_break?window.toast({title_class:"bg-danger text-white",title_text:"문자 읽기",mesg_text:""+e.message}):window.toast({title_class:"bg-danger text-white",title_text:"문자 읽기",mesg_text:`SMS 저장 처리를 실패 했습니다.(${e})`}),a.onError&&a.onError(e)},0)}).finally(function(){window.SBalance.setTimewait(!1)})}}))}$(function(){stracer("pageAlloc").frm("initialize page.js $(function() {...")});