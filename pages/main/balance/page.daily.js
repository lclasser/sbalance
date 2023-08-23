function process_daily(s,t,i,d){var a=s.getReference("balances"),l=i.options||{};return delete i.options,1!=l.disable_filter&&(i=Object.assign(i,a.filter)),1==l.disable_iment&&(i.is_iment=!1),null==i.acc_key&&delete i.acc_key,stracer("page.daily.js").log("process_daily...",i),window.SBalance.request("/main/message/daily",i).then(function(a){stracer("page.daily.js").log("daily result:",a);var e={sum_count:0,sum_withdraw:amountAdd(),sum_deposit:amountAdd()};null==a.data||a.data.length<=0?t.html('<div class="row m-1" style="height:30px;">데이터가 없습니다.</div>'):process_data_daily(t,e,l,a.data,function(){var a=s.getFrame().get$body(),e=a.scrollTop();i.options=l,process_daily(s,t,i,d).then(function(){e&&a.scrollTop(e)})}),d&&d(e)})}function process_data_daily(d,r,_,a,u){if(_=_||{},r=r||{sum_count:0,sum_withdraw:amountAdd(),sum_deposit:amountAdd()},null==a||a.length<=0)d.html('<div class="row m-1" style="height:30px;">데이터가 없습니다.</div>');else{d.empty();var p={};a.forEach(function(a){p[a.sms_date]=p[a.sms_date]||{items:[],item_date:a.sms_date},p[a.sms_date].items.push(a)});const l=[{week:"일",color:"#F96C4E"},{week:"월",color:"#DBD5D2"},{week:"화",color:"#DBD5D2"},{week:"수",color:"#DBD5D2"},{week:"목",color:"#DBD5D2"},{week:"금",color:"#DBD5D2"},{week:"토",color:"#3C97F5"}];_.show_ads=!1,Object.keys(p).reverse().forEach(function(c,a){var e=p[c],a="group_"+a,s=$('<div class="sb-card card"/>'),t=(s.html(`
    <div class="card-header">
        <div class="daily-day">1 일 </div>
        <div class="daily-week me-auto"></div>
        <div class="amount-deposit text-end" id="sum_deposit" style="width:108px;"></div>
        <div class="amount-withdraw text-end" id="sum_withdraw" style="width:108px;"></div>
        <button type="button" class="transparent-bgcolor" 
            id="item_collapse"
            data-bs-toggle="collapse" data-bs-target=".group_x" 
            aria-expanded="false" aria-controls=".group_x">
            <div class="collapse hide group_x"><img style="height:24px;" src="https://lclasser.github.io/sbalance/public/image/card_down.svg"></div>
            <div class="collapse show group_x"><img style="height:24px;" src="https://lclasser.github.io/sbalance/public/image/card_up.svg"></div>
        </button>
    </div>
    <div class="card-body p-0 collapse show group_x">
    </div>`),formaterNewDate_fromFmtDate(e.item_date)),i=l[t.getDay()];switch(t.getDay()){case 0:s.find(".daily-week").addClass("week-sunday");break;case 6:s.find(".daily-week").addClass("week-satday");break;default:s.find(".daily-week").addClass("week-norday")}1==_.show_month?s.find(".daily-day").html(displayDate_fromFmtDate(e.item_date)):s.find(".daily-day").html(t.getDate()+"일"),s.find(".daily-week").html(""+i.week);var t=s.find("#item_collapse"),o=(t.attr("data-bs-target","."+a),t.attr("aria-controls","."+a),s.find(".group_x").removeClass("group_x").addClass(a),amountAdd()),n=amountAdd(),m=s.find(".card-body");e.items.forEach(function(e,s){e.ci_idx=e.ci_idx||0,e.ci_type=e.ci_type||"N",e.acc_alias=e.acc_alias||e.wlt_alias;var a=$('<div class="row m-0 h-100"/>').css("min-height","48px").html(`
    <div class="col-auto d-flex align-items-center p-1 position-relative"><div class="icon_category" id="item_category">분류</div></div>
    <div class="col d-flex flex-column justify-content-center">
        <div class="row">
            <div class="col text-truncate" id="item_content"></div>
            <div class="col-auto d-flex">
                <div id="item_account" class="pe-1"></div>
                <div id="item_time" class="ps-1"></div>
            </div>
        </div>
        <div class="row">
            <div class="col text-truncate memo-text" id="item_memo" style="width:32px;"></div>
            <div class="col-auto" id="item_amount"></div>
        </div>
    </div>`),t=a.find("#item_category"),i=(t.html(`<span class="align-middle text-wrap">${formaterName4(e.ci_name)}</span>`),"L"==e.acc_type&&t.append($('<img src="https://lclasser.github.io/sbalance/public/image/link_category.svg">')),"L"==e.cg_type&&t.addClass("shared"),t.click(function(){return stracer("page.daily.js").log("cate_icon click."),window.popver("https://lclasser.github.io/sbalance/pages/main/popver/select.category.html",{ci_idx:e.ci_idx},function(a){null!=a&&window.SBalance.request("/main/message/update",{acc_key:e.acc_key,acc_type:e.acc_type,acc_name:e.acc_name,msg_key:e.msg_key,sms_category:a.ci_idx}).then(function(a){stracer("page.daily.js").log("/main/message/update res:",a),"Y"==a.error.success?(window.toast({title_class:"bg-secondary text-white",title_text:"분류 정보",mesg_text:"분류를 설정 하였습니다."}),u&&u()):window.toast({title_class:"bg-secondary text-white",title_text:"분류 정보",mesg_text:"분류 설정을 실패 하였습니다."})})}),!1}),null==e.acc_key?a.find("#item_account").html("(미지정)"):a.find("#item_account").html(e.acc_alias),a.find("#item_time").html(e.sms_time.substring(0,2)+":"+e.sms_time.substring(2,4)),a.find("#item_memo").html(e.sms_memo),1<e.sms_iment&&1!=_.disable_iment?a.find("#item_content").html(`(${e.sms_imonth}/${e.sms_iment}) `+e.sms_contents):a.find("#item_content").html(e.sms_contents),e.sms_amount),d=!0;switch(e.sms_type){case"C":i*=-1;break;case"P":break;default:d=!1}switch(1<e.sms_iment&&(i=e.sms_iamount),e.sms_display){case"E":d=!1;break;case"H":return}switch(e.acc_display){case"E":d=!1;break;case"H":return}var l=a.find("#item_amount");if(l.html(amountFormat(e.sms_unit,i)),0==d)l.addClass("unknown-amount");else{switch(e.sms_class){case"W":"N"==e.ci_type?(amountAdd(o,i),amountAdd(r.sum_withdraw,i)):(amountAdd(o,0,!0),amountAdd(r.sum_withdraw,0,!0));break;case"D":"N"==e.ci_type?(amountAdd(n,i),amountAdd(r.sum_deposit,i)):(amountAdd(n,0,!0),amountAdd(r.sum_deposit,0,!0))}if(r.sum_count++,i<0)switch(e.sms_class){case"W":l.addClass("cancel-withdraw");break;case"D":l.addClass("cancel-deposit");break;default:l.addClass("text-dark")}else if("T"==e.ci_type)switch(e.sms_class){case"W":l.addClass("transfer-withdraw");break;case"D":l.addClass("transfer-deposit");break;default:l.addClass("text-dark")}else if("E"==e.ci_type)switch(e.sms_class){case"W":l.addClass("except-withdraw");break;case"D":l.addClass("except-deposit");break;default:l.addClass("text-dark")}else if("N"==e.ci_type)switch(e.sms_class){case"W":l.addClass("amount-withdraw");break;case"D":l.addClass("amount-deposit");break;default:l.addClass("text-dark")}else l.addClass("unknown-amount")}a.click(function(){var a=Object.assign({},p[c].items[s]);return a.read_only=_.read_only,stracer("page.daily.js").log("row:",a),window.openModal("https://lclasser.github.io/sbalance/pages/main/modal/modal.balance_message.html",a,function(a){stracer("page.daily.js").log("modal.balance_message.html result:",a),null!=a&&u&&u()}),!1}),0<s&&m.append($('<div class="seperater"/>')),m.append(a)}),s.find("#sum_withdraw").html(amountFormat(null,o)),s.find("#sum_deposit").html(amountFormat(null,n)),d.append(s)})}}