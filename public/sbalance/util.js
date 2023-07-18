function toNumber(t){return null==t?"0":t.toString().replace(/[^0-9.+-]/g,"").replace(/(\..*)\./g,"$1")}function toInteger(t,e){return t=toNumber(t),null!=e&&0<parseInt(e)?null!=(t=parseFloat(t))&&0==isNaN(t)&&0!=t?t:0:null!=(t=parseInt(t))&&0==isNaN(t)&&0!=t?t:0}function thousandFormatter(t,e){var r=(t=toInteger(t).toString()).split(".");return r[0]&&(t=r[0].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g,"$1,")),r[1]&&(t+="."+r[1]),t}function moneyFormatter(t,e){return 0==(t=toInteger(t))?"-":thousandFormatter(t,e)}function formatterDateSqlToFmt(t){return null==t?"":(t=new Date(t)).getFullYear()+"-"+("0"+(t.getMonth()+1)).slice(-2)+"-"+("0"+t.getDate()).slice(-2)}function formaterFmtDate_fromDate(t,e){t=t||new Date;return e&&t.setDate(t.getDate()+e),t.getFullYear()+("0"+(t.getMonth()+1)).slice(-2)+("0"+t.getDate()).slice(-2)}function formaterFmtTime_fromDate(t,e){t=t||new Date;return e&&t.setDate(t.getDate()+e),("0"+t.getHours()).slice(-2)+("0"+t.getMinutes()).slice(-2)+("0"+t.getSeconds()).slice(-2)}function formaterNewDate_fromFmtDate(t){return t=t||formaterFmtDate_FromDate(null),new Date(t.substr(0,4),t.substr(4,2)-1,t.substr(6,2))}function displayDate_fromFmtDate(t){return(t=t||formaterFmtDate_FromDate(null)).substr(0,4)+"년"+t.substr(4,2)+"월"+t.substr(6,2)+"일"}function formaterName4(t){return t=4<=(t=(t||"-").replace(" ","").substring(0,4)).length?t.substr(0,2)+"</br>"+t.substr(2,2):t}function parameterFromUrl(t){var e={},t=t.split("?");return 1<t.length&&t[1].split("&").forEach(function(t){t=t.split("=");e[t[0]]=t[1]}),e}function eventInputNumber(a){var t;null!=a.value&&(a.addEventListener("input",function(t){var e=a.value.toString(),r=a.selectionStart,n=a.value.length,e=(e=e.replace(/[^0-9.+-]/g,"").replace(/(\..*)\./g,"$1")).split(".");e[0]=e[0].replace(/(\d)(?=(?:\d{3})+(?!\d))/g,"$1,"),1<e.length&&(e[0]+="."+e[1]),a.value=e[0],a.selectionStart=a.selectionEnd=r+(a.value.length-n)}),(t=a.value.toString().replace(/[^0-9.+-]/g,"").replace(/(\..*)\./g,"$1").split("."))[0]=t[0].replace(/(\d)(?=(?:\d{3})+(?!\d))/g,"$1,"),1<t.length&&(t[0]+="."+t[1]),a.value=t[0],"0"==a.value)&&(a.value="")}function amountAdd(t,e,r){return null==t?{_val:0,_cnt:0,val:function(){return this._val},cnt:function(){return this._cnt}}:(0!=(e=toInteger(e))?(t._val+=e||0,t._cnt++):1==r&&t._cnt++,t)}function amountFormat(t,e){var r=null!=e&&"object"==typeof e?0==e._val&&0<e._cnt?"0":moneyFormatter(e._val):moneyFormatter(e);switch(t){case"":break;case"USD":r+=" $";break;default:r+=" 원"}return r}function compareMatch(t,e){var r=t.mat_contents;try{var n=toInteger(t.mat_amount),a=toInteger(e.sms_amount);return 0<n&&t.mat_amount!=a?!1:(r=(r=(r=(r=(r=(r=r.replaceAll("%d","\\d{1,80}")).replaceAll("%s","\\S{1,80}")).replaceAll("*","\\*")).replaceAll("?","\\?")).replaceAll("(","\\(")).replaceAll(")","\\)"),e.sms_contents.match(r)==e.sms_contents)}catch(t){stracer("util").err(t)}}function getAmountUnit(t){for(var e=0,r=["","k","m","g","t","p"];;){if(!(3<Math.floor(t/1e3).toString().length))return obj_amount={amt:thousandFormatter(t),unit:r[e],cnt:e};t=Math.floor(t/1e3),e++}}function telephoneHyphen(t){var e=(t=t||"").replaceAll("-","");switch(e.length){case 7:return e.replace(/(\d{3})(\d{4})$/,"$1-$2");case 8:return e.replace(/(\d{4})(\d{4})$/,"$1-$2");case 9:return e.replace(/(\d{2})(\d{3})(\d{4})$/,"$1-$2-$3");case 10:return e.replace(/(\d{2})(\d{4})(\d{4})$/,"$1-$2-$3");case 11:return e.replace(/(\d{3})(\d{4})(\d{4})$/,"$1-$2-$3");case 12:return e.replace(/(\d{4})(\d{4})(\d{4})$/,"$1-$2-$3")}return t}