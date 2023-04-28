function process_daily(_,g,h,w){console.log("process_daily..."),window.SBalance.request("/main/message/daily",h).then(function(a){var u={sum_count:0,sum_withdraw:amountAdd(),sum_deposit:amountAdd()};if(null==a.data||a.data.length<=0)g.html('<div class="row m-1" style="height:30px;">데이터가 없습니다.</div>');else{g.empty();var p={};a.data.forEach(function(a){p[a.sms_date]=p[a.sms_date]||{items:[],item_date:a.sms_date},p[a.sms_date].items.push(a)});const i=[{week:"일",color:"#F96C4E"},{week:"월",color:"#DBD5D2"},{week:"화",color:"#DBD5D2"},{week:"수",color:"#DBD5D2"},{week:"목",color:"#DBD5D2"},{week:"금",color:"#DBD5D2"},{week:"토",color:"#3C97F5"}];var d=0;const l=[`<ins class="adsbygoogle"
                style="display:block; text-align:center; border:1px dashed #555555; border-radius:3px;"
                data-ad-layout="in-article"
                data-ad-format="fluid"
                data-ad-client="ca-pub-7340654800983393"
                data-ad-slot="7640300145"></ins>`,`<ins class="adsbygoogle"
                style="display:block; text-align:center; border:1px dashed #555555; border-radius:3px;"
                data-ad-layout="in-article"
                data-ad-format="fluid"
                data-ad-client="ca-pub-7340654800983393"
                data-ad-slot="6742985599"></ins>`];Object.keys(p).reverse().forEach(function(c,a){a%5==0&&d<l.length&&(g.append($('<div class="row m-0 h-100"/>').css("min-height","54px").css("padding","3px").html(l[d])),d++,(adsbygoogle=window.adsbygoogle||[]).push({}));var o=p[c],a="group_"+a,e=$('<div class="sb-card card"/>'),s=(e.html(`
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
        </div>`),formaterDate_fromFmtDate(o.item_date)),t=i[s.getDay()];switch(s.getDay()){case 0:e.find(".daily-week").addClass("week-sunday");break;case 6:e.find(".daily-week").addClass("week-satday");break;default:e.find(".daily-week").addClass("week-norday")}e.find(".daily-day").html(s.getDate()+"일"),e.find(".daily-week").html(""+t.week);var s=e.find("#item_collapse"),n=(s.attr("data-bs-target","."+a),s.attr("aria-controls","."+a),e.find(".group_x").removeClass("group_x").addClass(a),amountAdd()),r=amountAdd(),m=e.find(".card-body");o.items.forEach(function(e,s){o.items.length;var a=$('<div class="row m-0 h-100"/>').css("min-height","54px").html(`
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
                <div class="col text-truncate" id="item_memo"></div>
                <div class="col-auto" id="item_amount"></div>
            </div>
        </div>`),t=a.find("#item_category"),d=(t.html(`<span class="align-middle text-wrap">${formaterName4(e.ci_name)}</span>`),"L"==e.acc_type&&t.append($('<img src="https://lclasser.github.io/sbalance/public/image/link_category.svg">')),"L"==e.cg_type&&t.addClass("shared"),t.click(function(){return console.log("cate_icon click."),window.popver("https://lclasser.github.io/sbalance/pages/main/popver/select.category.html",{ci_idx:e.ci_idx||0},function(a){null!=a&&window.SBalance.request("/main/message/update",{acc_key:"L"==e.acc_type?e.acc_name:e.acc_key,acc_type:e.acc_type,acc_name:e.acc_name,msg_key:e.msg_key,sms_category:a.ci_idx}).then(function(a){STracer("page.daily.js").log("/main/message/update res:",a),"Y"==a.error.success?(window.toast({title_class:"bg-secondary text-white",title_text:"분류 정보",mesg_text:"분류를 설정 하였습니다."}),process_daily(_,g,h,w)):window.toast({title_class:"bg-secondary text-white",title_text:"분류 정보",mesg_text:"분류 설정을 실패 하였습니다."})})}),!1}),a.find("#item_account").html(e.acc_alias),a.find("#item_time").html(e.sms_time.substring(0,2)+":"+e.sms_time.substring(2,4)),a.find("#item_content").html(e.sms_contents),a.find("#item_memo").html(e.sms_memo),e.sms_amount),i=!0;switch(e.sms_type){case"C":d*=-1;break;case"P":break;case"D":i=!1;break;case"I":d=null}var l=a.find("#item_amount").html(amountFormat(e.sms_unit,d));if(0==i)switch(l.addClass("amount-budget"),e.sms_class){case"W":"N"!=e.ci_type&&null!=e.ci_type||(amountAdd(n,0,!0),amountAdd(u.sum_withdraw,0,!0));break;case"D":"N"!=e.ci_type&&null!=e.ci_type||(amountAdd(r,0,!0),amountAdd(u.sum_deposit,0,!0))}else{switch(e.sms_class){case"W":"N"==e.ci_type||null==e.ci_type?(amountAdd(n,d),amountAdd(u.sum_withdraw,d)):(amountAdd(n,0,!0),amountAdd(u.sum_withdraw,0,!0));break;case"D":"N"==e.ci_type||null==e.ci_type?(amountAdd(r,d),amountAdd(u.sum_deposit,d)):(amountAdd(r,0,!0),amountAdd(u.sum_deposit,0,!0))}if(u.sum_count++,d<0)switch(e.sms_class){case"W":l.addClass("cancel-withdraw");break;case"D":l.addClass("cancel-deposit");break;default:l.addClass("text-dark")}else if("T"==e.ci_type)switch(e.sms_class){case"W":l.addClass("transfer-withdraw");break;case"D":l.addClass("transfer-deposit");break;default:l.addClass("text-dark")}else if("E"==e.ci_type)switch(e.sms_class){case"W":l.addClass("except-withdraw");break;case"D":l.addClass("except-deposit");break;default:l.addClass("text-dark")}else if("N"==e.ci_type||null==e.ci_type)switch(e.sms_class){case"W":l.addClass("amount-withdraw");break;case"D":l.addClass("amount-deposit");break;default:l.addClass("text-dark")}else l.addClass("unknown-amount")}a.click(function(){var a=p[c].items[s];return STracer("page.daily.js").log("row:",a),window.openModal("https://lclasser.github.io/sbalance/pages/main/modal/modal.balance_message.html",a,function(a){STracer("page.daily.js").log("modal.balance_message.html result:",a),null!=a&&process_daily(_,g,h,w)}),!1}),0<s&&m.append($('<div class="seperater"/>')),m.append(a)}),e.find("#sum_withdraw").html(amountFormat(null,n)),e.find("#sum_deposit").html(amountFormat(null,r)),g.append(e)})}w&&w(u)})}console.log("page.daily.js");