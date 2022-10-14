
function process_daily(ppage, $list, inbound, cbfinish)
{
    console.log("process_daily...");
    SBalance.requestor()
    .then(function(interface) {
        return interface.send("/main/message/daily", inbound);
    })
    .then(function(res) {
        return onData(res);
    });

    function onData(res) {
        // stracer.log("res:", res);
        
        if( res.data == null || res.data.length <= 0 ) {
            $list.html(`<div class="row m-1" style="height:30px;">데이터가 없습니다.</div>`);
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
            {week: '일', color: 'bg-danger'},
            {week: '월', color: 'bg-secondary'},
            {week: '화', color: 'bg-secondary'},
            {week: '수', color: 'bg-secondary'},
            {week: '목', color: 'bg-secondary'},
            {week: '금', color: 'bg-secondary'},
            {week: '토', color: 'bg-primary'},
        ];

        var grid_card = `
<div class="card-header d-flex align-items-center p-2" style="height:35px;">
    <div class="me-auto" id="item_title">1 일 </div>
    <div class="p-1 text-danger text-end" id="sum_deposit" style="width:90px;"></div>
    <div class="p-1 text-primary text-end" id="sum_withdraw" style="width:90px;"></div>
    <div class="p-1 ps-4">
        <button class="btn btn-primary btn-sm" type="button" 
            id="item_collapse"
            data-bs-toggle="collapse" data-bs-target=".group_x" 
            aria-expanded="false" aria-controls=".group_x">
            <div class="collapse hide group_x"> <i class="fa-solid fa-caret-down"></i> </div>
            <div class="collapse show group_x"> <i class="fa-solid fa-caret-up"></i> </div>
        </button>
    </div>
</div>
<div class="theme-card-body card-body p-0 collapse show group_x">
</div>
`;
        var grid_row = `
<div class="col-2 border-end d-flex align-items-center p-1" id="item_category">분류</div>
<div class="col-2 border-end d-flex align-items-center p-1" id="item_account">계좌</div>
<div class="col-1 border-end d-flex align-items-center p-1 justify-content-center" id="item_time">시간</div>
<div class="col-5 border-end d-flex align-items-center p-1" id="item_content">내용</div>
<div class="col-2 d-flex align-items-center p-1 justify-content-end" id="item_amount">금액</div>
`;

        var qry_result = {
            sum_count : 0,
            sum_withdraw : 0,
            sum_deposit : 0,
            cnt_withdraw : 0,
            cnt_deposit : 0,
        };
        Object.keys(date_list).reverse().forEach(function(key, idx) {
            var data = date_list[key];
            // stracer.log("data:", key, data);

            // Group 생성 (card)
            var grp_name = `group_${idx}`;
            var obj_card = $("<div/>");
            obj_card.addClass("card border-0 w-100 mb-1").html(grid_card);

            var item_date = formaterDate_fromFmtDate(data.item_date);
            const item_week = WEEK_DAY[item_date.getDay()];

            // Group : 일자
            obj_card.find("#item_title").html(
                `${item_date.getDate()}일 <span class="badge ${item_week.color}">${item_week.week}</span>`
            );

            // Group : Collapse Button
            var item_collapse = obj_card.find("#item_collapse");
            item_collapse.attr("data-bs-target", `.${grp_name}`);
            item_collapse.attr("aria-controls", `.${grp_name}`);
            obj_card.find(".group_x").removeClass("group_x").addClass(grp_name);

            // Group에 Row별 세팅
            var sum_withdraw = 0;
            var sum_deposit = 0;
            var obj_body = obj_card.find(".card-body");
            obj_body.addClass("border border-1");
            data.items.forEach(function(item, idx) {
                var borders = "border border-top-0 border-start-0 border-end-0";
                if( data.items.length <= (idx + 1) ) {
                    borders = "";
                }
                // Row 생성
                var obj_row = $("<div/>");
                obj_row.addClass(`row ${borders} m-0 h-100`)
                .css("min-height", "54px")
                .html(grid_row);

                obj_row.find("#item_category").html(
                    `<span class="align-middle text-truncate">${item.ci_name||" - "}</span>`
                ).click(function() {
                    // event.preventDefault();
                    window.openModal('/main/modal/modal.category_select.html', item, function(result) {
                        STracer("page.daily.js").log("modal.category_select.html result:", result);
                        if( result == null )
                            return;

                        result = result < 0 ? 0 : result;
                        $.post("/main/message/update", {
                            acc_key  : (item.acc_type == 'L' ? item.acc_name : item.acc_key),
                            acc_type : item.acc_type,
                            acc_name : item.acc_name,
                            msg_key : item.msg_key,
                            sms_category : result,
                        }, function(res) {
                            STracer("page.daily.js").log("/main/message/update res:", res);
                            var result = null;
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

                // obj_row.find("#item_content").html(item.sms_contents);
                var row_content = `<span class="align-middle text-truncate">`
                    + `<div class="">${item.sms_contents || ""}</div>`;
                if( (item.sms_memo != null && item.sms_memo.length > 0) )  {
                    row_content += `<div class="sms_memo">${item.sms_memo}</div>`;
                }
                row_content += `</span>`;
                obj_row.find("#item_content").html(row_content);

                switch( item.sms_type ) {
                case 'C': // 취소
                    item.sms_amount *= (-1);
                    break;
                case 'P': // 승인
                case 'D': // 거절
                    break;
                }

                switch( item.sms_class ) {
                case 'W': // 출금
                if( item.ci_type == 'N' || item.ci_type == null ) {
                        sum_withdraw += item.sms_amount;
                        qry_result.sum_withdraw += item.sms_amount;
                        qry_result.cnt_withdraw++;
                    }
                    break;
                case 'D': // 입금
                if( item.ci_type == 'N' || item.ci_type == null ) {
                        sum_deposit += item.sms_amount;
                        qry_result.sum_deposit += item.sms_amount;
                        qry_result.cnt_deposit++;
                    }
                    break;
                }
                qry_result.sum_count++;

                var sms_unit = " 원";
                switch( item.sms_unit ) {
                case 'USD': sms_unit += " $"; break;
                }

                // console.log("item.ci_type:", item.ci_type);
                var obj_amount = obj_row.find("#item_amount").html(thousandFormatter(item.sms_amount) + sms_unit);
                if( item.sms_amount < 0 ) {
                    obj_amount.addClass("text-secondary");
                }
                else
                if( item.ci_type == 'T' ) { // Transfer
                    switch( item.sms_class ) {
                    case 'W': obj_amount.addClass("transfer_withdraw"); break;
                    case 'D': obj_amount.addClass("transfer_deposit"); break;
                    default:  obj_amount.addClass("text-dark"); break;
                    }
                }
                else
                if( item.ci_type == 'E' ) { // Exeption
                    switch( item.sms_class ) {
                        case 'W': obj_amount.addClass("except_withdraw"); break;
                        case 'D': obj_amount.addClass("except_deposit"); break;
                        default:  obj_amount.addClass("text-dark"); break;
                        }
                    }
                else 
                if( item.ci_type == 'N' || item.ci_type == null ) { // Normal
                    switch( item.sms_class ) {
                    case 'W': obj_amount.addClass("amount_withdraw"); break;
                    case 'D': obj_amount.addClass("amount_deposit"); break;
                    default:  obj_amount.addClass("text-dark"); break;
                    }
                }
                else {
                    obj_amount.addClass("text-secondary");
                }

                obj_row.click(function() {
                    STracer("page.daily.js").log("row:", sel_item);
                    var sel_row = date_list[key];
                    var sel_item = sel_row.items[idx];
                    window.openModal('/main/modal/modal.info_message.html', sel_item, function(result) {
                        if( result != null )
                            return;
                            process_daily(ppage, $list, inbound);
                    });
                    return false;
                });
                obj_body.append(obj_row);
            });

            obj_card.find("#sum_withdraw").html(thousandFormatter(sum_withdraw));
            obj_card.find("#sum_deposit").html(thousandFormatter(sum_deposit));

            $list.append(obj_card);
        });

        if( cbfinish != null ) {
            cbfinish(qry_result);
        }
    }
}
