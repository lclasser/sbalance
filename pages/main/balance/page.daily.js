
function process_daily(ppage, $list, inbound, cbfinish)
{
    console.log("process_daily...");
    window.SBalance.request("/main/message/daily", inbound)
    .then(function(res) {
        // stracer.log("res:", res);
        
        var qry_result = {
            sum_count : 0,
            sum_withdraw : amountAdd(),
            sum_deposit : amountAdd(),
        };
        if( res.data == null || res.data.length <= 0 ) {
            $list.html(`<div class="row m-1" style="height:30px;">데이터가 없습니다.</div>`);
            cbfinish && cbfinish(qry_result);
            cbfinish = null;
            return;
        }

        $list.empty();
        var date_list = {};
        res.data.forEach(function(item) {
            date_list[item.sms_date] = date_list[item.sms_date] || {
                items : [],
                item_date: item.sms_date,
            };
            date_list[item.sms_date].items.push(item);
        });

        const WEEK_DAY = [
            {week: '일', color: '#F96C4E'},
            {week: '월', color: '#DBD5D2'},
            {week: '화', color: '#DBD5D2'},
            {week: '수', color: '#DBD5D2'},
            {week: '목', color: '#DBD5D2'},
            {week: '금', color: '#DBD5D2'},
            {week: '토', color: '#3C97F5'},
        ];

        var grid_card = `
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
        </div>`;

        var grid_row = `
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
        </div>`;

        Object.keys(date_list).reverse().forEach(function(key, idx) {
            var data = date_list[key];
            // stracer.log("data:", key, data);

            // Group 생성 (card)
            var grp_name = `group_${idx}`;
            var obj_card = $("<div/>");
            obj_card.addClass("sb-card card").html(grid_card);

            var item_date = formaterDate_fromFmtDate(data.item_date);
            const item_week = WEEK_DAY[item_date.getDay()];

            switch( item_date.getDay() ) {
            case 0:  obj_card.find(".daily-week").addClass("week-sunday"); break;
            case 6:  obj_card.find(".daily-week").addClass("week-satday"); break;
            default: obj_card.find(".daily-week").addClass("week-norday"); break;
            }

            // Group : 일자,요일
            obj_card.find(".daily-day").html(`${item_date.getDate()}일`);
            obj_card.find(".daily-week").html(`${item_week.week}`);

            // Group : Collapse Button
            var item_collapse = obj_card.find("#item_collapse");
            item_collapse.attr("data-bs-target", `.${grp_name}`);
            item_collapse.attr("aria-controls", `.${grp_name}`);
            obj_card.find(".group_x").removeClass("group_x").addClass(grp_name);

            // Group에 Row별 세팅
            var sum_withdraw = amountAdd();
            var sum_deposit = amountAdd();
            var obj_body = obj_card.find(".card-body");
            // obj_body.addClass("border border-1");
            data.items.forEach(function(item, idx) {
                var borders = ""; // "border border-top-0 border-start-0 border-end-0";
                if( data.items.length <= (idx + 1) ) {
                    borders = "";
                }
                // Row 생성
                var obj_row = $(`<div class="row m-0 h-100"/>`)
                .css("min-height", "54px")
                .html(grid_row);

                var cate_icon = obj_row.find("#item_category");
                cate_icon.html(`<span class="align-middle text-wrap">${formaterName4(item.ci_name)}</span>`);
                if( item.acc_type == 'L' ) cate_icon.append($(`<img src="https://lclasser.github.io/sbalance/public/image/link_category.svg">`));
                if( item.cg_type  == 'L' ) cate_icon.addClass("shared");

                cate_icon.click(function() {
                    console.log("cate_icon click.");
                    window.popver("/main/popver/select.category.html", {ci_idx: item.ci_idx || 0}, function(result) {
                        if( result == null )
                            return;
                        window.SBalance.request("/main/message/update", {
                            acc_key  : (item.acc_type == 'L' ? item.acc_name : item.acc_key),
                            acc_type : item.acc_type,
                            acc_name : item.acc_name,
                            msg_key : item.msg_key,
                            sms_category : result.ci_idx,
                        })
                        .then(function(res) {
                            STracer("page.daily.js").log("/main/message/update res:", res);
                            if( res.error.success == 'Y' ) {
                                window.toast({
                                    title_class: "bg-secondary text-white",
                                    title_text: "분류 정보",
                                    mesg_text: "분류를 설정 하였습니다.",
                                });
                                process_daily(ppage, $list, inbound);
                            } else {
                                window.toast({
                                    title_class: "bg-secondary text-white",
                                    title_text: "분류 정보",
                                    mesg_text: "분류 설정을 실패 하였습니다.",
                                });
                            }
                        });
                    });
                    return false; // event.preventDefault();
                });
                obj_row.find("#item_account").html(item.acc_alias);
                obj_row.find("#item_time").html(
                    item.sms_time.substring(0,2) + ":" + item.sms_time.substring(2,4)
                );

                obj_row.find("#item_content").html(item.sms_contents);
                obj_row.find("#item_memo").html(item.sms_memo);

                var sms_amount = item.sms_amount;
                var is_accum = true;
                switch( item.sms_type ) {
                case 'C': // 취소
                    sms_amount *= (-1);
                    break;
                case 'P': // 승인
                    break;
                case 'D': // 거절
                    is_accum = false;
                    break;
                }

                var obj_amount = obj_row.find("#item_amount").html(amountFormat(item.sms_unit, sms_amount));

                if( is_accum == false ) {
                    obj_amount.addClass("amount-budget");
                    switch( item.sms_class ) {
                    case 'W': // 출금
                        if( item.ci_type == 'N' || item.ci_type == null ) {
                            amountAdd(sum_withdraw, 0, true);
                            amountAdd(qry_result.sum_withdraw, 0, true);
                        }
                        break;
                    case 'D': // 입금
                        if( item.ci_type == 'N' || item.ci_type == null ) {
                            amountAdd(sum_deposit, 0, true);
                            amountAdd(qry_result.sum_deposit, 0, true);
                        }
                        break;
                    }
                } else {
                    switch( item.sms_class ) {
                    case 'W': // 출금
                        if( item.ci_type == 'N' || item.ci_type == null ) {
                            amountAdd(sum_withdraw, sms_amount);
                            amountAdd(qry_result.sum_withdraw, sms_amount);
                        } else {
                            amountAdd(sum_withdraw, 0, true);
                            amountAdd(qry_result.sum_withdraw, 0, true);
                        }
                        break;
                    case 'D': // 입금
                        if( item.ci_type == 'N' || item.ci_type == null ) {
                            amountAdd(sum_deposit, sms_amount);
                            amountAdd(qry_result.sum_deposit, sms_amount);
                        } else {
                            amountAdd(sum_deposit, 0, true);
                            amountAdd(qry_result.sum_deposit, 0, true);
                        }
                        break;
                    }
                    qry_result.sum_count++;

                    // console.log("item.ci_type:", item.ci_type);
                    if( sms_amount < 0 ) {
                        switch( item.sms_class ) {
                        case 'W': obj_amount.addClass("cancel-withdraw"); break;
                        case 'D': obj_amount.addClass("cancel-deposit"); break;
                        default:  obj_amount.addClass("text-dark"); break;
                        }
                    }
                    else
                    if( item.ci_type == 'T' ) { // Transfer
                        switch( item.sms_class ) {
                        case 'W': obj_amount.addClass("transfer-withdraw"); break;
                        case 'D': obj_amount.addClass("transfer-deposit"); break;
                        default:  obj_amount.addClass("text-dark"); break;
                        }
                    }
                    else
                    if( item.ci_type == 'E' ) { // Exeption
                        switch( item.sms_class ) {
                        case 'W': obj_amount.addClass("except-withdraw"); break;
                        case 'D': obj_amount.addClass("except-deposit"); break;
                        default:  obj_amount.addClass("text-dark"); break;
                        }
                    }
                    else 
                    if( item.ci_type == 'N' || item.ci_type == null ) { // Normal
                        switch( item.sms_class ) {
                        case 'W': obj_amount.addClass("amount-withdraw"); break;
                        case 'D': obj_amount.addClass("amount-deposit"); break;
                        default:  obj_amount.addClass("text-dark"); break;
                        }
                    }
                    else {
                        obj_amount.addClass("unknown-amount");
                    }
                }

                obj_row.click(function() {
                    var sel_row = date_list[key];
                    var sel_item = sel_row.items[idx];

                    STracer("page.daily.js").log("row:", sel_item);
                    window.openModal('/main/modal/modal.balance_message.html', sel_item, function(result) {
                        STracer("page.daily.js").log("modal.balance_message.html result:", result);
                        if( result == null )
                            return;
                        process_daily(ppage, $list, inbound);
                    });
                    return false;
                });

                if( idx > 0 ) {
                    obj_body.append( $(`<div class="seperater"/>`) );
                }
                obj_body.append(obj_row);                
            });

            obj_card.find("#sum_withdraw").html(amountFormat(null, sum_withdraw));
            obj_card.find("#sum_deposit").html(amountFormat(null, sum_deposit));

            $list.append(obj_card);
        });

        cbfinish && cbfinish(qry_result);
        cbfinish = null;
    });
}
