
///////////////////////////////////////////////////////////////////////////////
// about Number
function toNumber(val) {
    if( val == null ) return "0";
    return val.toString().replace(/[^0-9.+-]/g, '').replace(/(\..*)\./g, '$1');
}

function toInteger(number, decimal) {
    number = toNumber(number);
    if( decimal != null && parseInt(decimal) > 0 ) {
        number = parseFloat(number);
        if( number != null && isNaN(number) == false && number != 0 )
            return number;
        return 0;
    } else {
        number = parseInt(number);
        if( number != null && isNaN(number) == false && number != 0 )
            return number;
    }
    return 0;
}

function thousandFormatter(number, decimal) {
    number = toInteger(number).toString();
    var vals = number.split('.');
    if( vals[0] )
        number = vals[0].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    if( vals[1] )
        number += '.' + vals[1];
    return number;
}
function moneyFormatter(number, decimal) {
    number = toInteger(number);
    if( number == 0 )
        return "-";
    return thousandFormatter(number, decimal);
}

///////////////////////////////////////////////////////////////////////////////
// about Date
function formatterDateSqlToFmt(value) {
    if( value == null ) return '';
    var ntime = new Date(value);
    return ntime.getFullYear() + '-' 
        +  ('0' + (ntime.getMonth() + 1)).slice(-2) + '-' 
        +  ('0' + ntime.getDate()).slice(-2)
    ;
}

function formaterFmtDate_fromDate(ndate, days) {
	var rdate = ndate || new Date();
	if( days ) rdate.setDate(rdate.getDate() + days);
    return rdate.getFullYear()
		+ ('0' + (rdate.getMonth() + 1)).slice(-2)
        + ('0' + (rdate.getDate())).slice(-2);
}

function formaterFmtTime_fromDate(ndate, days) {
	var rdate = ndate || new Date();
	if( days ) rdate.setDate(rdate.getDate() + days);
    return ('0' + rdate.getHours()).slice(-2)
		 + ('0' + rdate.getMinutes()).slice(-2)
         + ('0' + rdate.getSeconds()).slice(-2);
}

function formaterDate_fromFmtDate(nfmt) {
    nfmt = nfmt || formaterFmtDate_FromDate(null);
	return new Date(nfmt.substr(0,4), nfmt.substr(4,2) - 1, nfmt.substr(6,2));
}

///////////////////////////////////////////////////////////////////////////////
// about ETC
function formaterName4(name) {
    var name = (name || "-").replace(" " ,"").substring(0,4);
    if( name.length >= 4 ) {
        name = name.substr(0,2) + "</br>" + name.substr(2,2);
    }
    return name;
}

function parameterFromUrl(uri) {
    var args = {};
    var urls = uri.split("?");
    if( urls.length > 1 ) {
        var vals = urls[1].split("&");
        vals.forEach(function(item) {
            var data = item.split('=');
            args[ data[0] ] = data[1];
        });
    }
    return args;
}

function eventInputNumber(element) {
    if( element.value == null )
        return;
    element.addEventListener("input", function(event) {
        var str = element.value.toString();
        var pos = element.selectionStart;
        var len = element.value.length;

        str = str.replace(/[^0-9.+-]/g, '').replace(/(\..*)\./g, '$1');
        var val = str.split('.');
        val[0] = val[0].replace(/(\d)(?=(?:\d{3})+(?!\d))/g,'$1,');
        if( val.length > 1 )
            val[0] += "." + val[1];
        element.value = val[0];

        element.selectionStart = element.selectionEnd = pos + (element.value.length - len);
    });

    var str = element.value.toString().replace(/[^0-9.+-]/g, '').replace(/(\..*)\./g, '$1');
    var val = str.split('.');
    val[0] = val[0].replace(/(\d)(?=(?:\d{3})+(?!\d))/g,'$1,');
    if( val.length > 1 )
        val[0] += "." + val[1];
    element.value = val[0];
    if( element.value == '0' ) element.value = '';
}

function amountAdd(obj, amount, is_count) {
    if( obj == null ) {
        return {
            _val:0,
            _cnt:0,
            val : function() { return this._val; },
            cnt : function() { return this._cnt; },
        };
    }
    amount = toInteger(amount);
    if( amount != 0 ) {
        obj._val += amount || 0;
        obj._cnt++;
    }
    else
    if( is_count == true ) {
        obj._cnt++;
    }
    return obj;
}
function amountFormat(unit, amount) {
    var value;
    if( typeof(amount) == 'object' ) {
        if( amount._val == 0 && amount._cnt > 0 )
            value = "0";
        else 
            value = moneyFormatter(amount._val);
    } else {
        value = moneyFormatter(amount);
    }
    switch( unit ) {
    case 'USD': value += " $"; break;
    case 'KRW':
    default:
        value += " 원"; break;
    }
    return value;
}

function compareMatch(match_item, check_item) {
    var format = match_item.mat_contents;
    try {
        var mat_amount = toInteger(match_item.mat_amount);
        var sms_amount = toInteger(check_item.sms_amount);
        if( mat_amount > 0 && match_item.mat_amount != sms_amount ) {
            return false;
        }
        format = format.replaceAll("%d", "\\d{1,80}");
        format = format.replaceAll("%s", "\\S{1,80}");
        format = format.replaceAll("\*", "\\*");
        format = format.replaceAll("\?", "\\?");
        format = format.replaceAll("\(", "\\(");
        format = format.replaceAll("\)", "\\)");
        if( check_item.sms_contents.match(format) != check_item.sms_contents ) {
            return false;
        }
        return true;
    } catch(err) {
        console.err(err);
    }
}
