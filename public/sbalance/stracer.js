var g_tracename = "sbalance";
function traceWrite(trace_type, trace_args) {
  Array.call;
  // make Head
  var text = trace_type + '|' + formaterFmtTime_fromDate() + '.' + new Date().getTime() % 1000 + '|' + Array.from(trace_args).join(':').toString() + '|';
  return text;
}
var STracer = function () {
  var obj = {
    dbg: console.debug.bind(console, traceWrite("dbg", arguments)),
    frm: console.debug.bind(console, traceWrite("frm", arguments)),
    log: console.log.bind(console, traceWrite("log", arguments)),
    err: console.error.bind(console, traceWrite("err", arguments))
  };
  obj.frm = function () {};
  return obj;
};

/*
stracer.dbg = function() {
    traceWrite("dbg", arguments);
}

stracer.sql = function() {
    traceWrite("sql", arguments);
}

stracer.log = function() {
    return {
        log : console.log.bind(console, traceWrite("log", arguments)),
    };
}

stracer.err = function() {
    traceWrite("err", arguments);
}
*/