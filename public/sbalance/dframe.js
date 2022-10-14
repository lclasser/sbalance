
const _common_page = {
    getReference : function(name, dvalue) {
        window._refernce = window._refernce || dvalue || {};
        window._refernce[name] = window._refernce[name] || {};
        return window._refernce[name];
    },
    _event_function2(element, ev_name, ev_value) {
        var events = $._data(element, "events");
        console.log("_event_function2:", events);
        if( events && events[ev_name] != null ) {
            STracer("_event_function2").frm("events :", events);
            // $("page").last().trigger('onbackward');
            if( events[ev_name][0].handler(jQuery.Event(ev_name), ev_value) == true ) {
                return true;
            }
        }
    },
    _event_function($element, event) {
        $element.each(function(idx, element) {
            var fnCallback = Function(element.getAttribute(event));
            if( fnCallback != null )
                return fnCallback.call(element);
        });
    },
};

function dframeInitialize(element_id)
{
    var dframe = dframeCreate(element_id, null);
    window['dframeInitialize'] = null;

    STracer("pageAlloc").frm(`initialize page.js $(function() {...`);
    return dframe;
}

function dframeCreate(element_id, owner)
{    var $body = null;
    if( owner != null ) {
        $body = owner.find(`#${element_id}`);
    } else {
        $body = $(`#${element_id}`);
    }
    $body.attr('page-declare', 'dframe');

    return {
        _element_id : element_id, // owner body-element like <div>
        _history    : [],
        _$body      : $body,
        _owner     : owner,
        get$body    : function() { return this._$body; },
        getOwner   : function() { return this._owner; },

        send : function(ev_name, ev_value) {
            // this.$page.trigger(ev_name, ev_value);
            var ebody;
            var result;
            var $parray = $("[page-declare]");
            var ppos = $parray.length - 1;
            STracer("frameAlloc").frm("send $parray:", $parray.length);
            for( ; ppos>= 0; ppos-- ) { // 젤 하단 Child 한테만 넘긴다.
                ebody = $parray[ppos];
                result = $(ebody).triggerHandler(jQuery.Event(ev_name), ev_value);
                if( result != null ) return result;
            }
            // 위에서 끝나지 않으면 body까지 올라간다.
            $(window.document).trigger(jQuery.Event(ev_name), ev_value);
        },
        getReference : _common_page.getReference,
        makePageLink : function($body) {
            var self = this;
            $body = $body || self._$body;
            if( $body == null ) return;
            STracer("frameAlloc").frm("makePageLink:", self, $body.find("[page-link]"));

            $body.find("[page-link]").on('click', function() {
                STracer("frameAlloc").frm("page-link click...");
                self.openPage($(this).attr("page-link"), $(this).text(), $(this));
            });
        },
        makePageInclude : function($body) {
            var self = this;
            $body = $body || self._$body;
            if( $body == null ) return;

            var next = Promise.resolve();
            $body.find(`[page-include]`).each(function(index, item) {
                var attr = $(item).attr("page-include");
                next = next.then(function() {
                    return new Promise(function(resolve, reject) {
                        STracer("makePageInclude").log(`page loaded:`, attr);
                        var page_url = "https://lclasser.github.io/sbalance/pages" + attr;
                        $.get(page_url, function(data) {
                            $(item).removeAttr(tag_name, '');
                            $(item).html(data);
                            resolve();
                        });
                    });
                });
            });
            return next;
        },
        getHistory : function() { return this._history; },
        addHistory : function(dpage) { this._history.push(dpage); },
        popHistory : function() {
            var self = this;
            var dpage = null;
            STracer("frameAlloc").frm(`backHistory...`, self._history);
            var hist_last = self._history.length - 1;
            if( hist_last <= 0 )
                return;

            self._history.pop();
            dpage = self._history[hist_last - 1];
            return dpage;
        },
        on : function(ev_name, ev_callback) {
            var self = this;
            this._$body.on(ev_name, function(event, page) {
                return ev_callback.call(self, event, page);
            });
            return this;
        },
        openPage : function(page_file, page_title, page_param, callback) {
            var self = this;
            try {
                if( self._$body == null ) throw new Error("self._$body: invalid body.");
                if( page_file  == null ) throw new Error("self.openPage: invalid page_file.");
            } catch(err) {
                STracer("openPage").err(err);
                return;
            }

            if( typeof(page_file) == 'object' ) {
                page_title = page_file.title;
                page_file = page_file.file;
            }

            var dpage = dpageCreate(page_title, page_file, page_param, self);
            // self._$body.children().remove();
            SBalance.setTimewait(true);
            STracer("openPage").frm(`0.2 [${self._element_id}] : get~~~`, self._element_id);
            var page_url = "https://lclasser.github.io/sbalance/pages" + page_file;
            $.get(page_url, function(data) {
                try {
                    // PAGE: 이전 Page 의 onclose 이벤트
                    var $page = self._$body.children("[page-declare='dpage']");
                    if( $page && $page.length > 0 ) {
                        STracer("openPage").frm(`0.5 [${self._element_id}]: onclose trigger.`, $page);
                        // _common_page._event_function2($page, 'onclose');
                        // onclose를 호출할수가 없다... (onPageClose 함수가 여러개인데 이중 마지막것만 가지고 있음...)

                        // FRAME: 이전 Page의 page_close 이벤트
                        self._$body.triggerHandler(jQuery.Event('page_close'), $page[0] && $page[0].getPage());
                    }

                    // PAGE: 화면 내용 변경
                    STracer("openPage").frm(`1.0 [${self._element_id}] : body.thml.`);
                    self._$body.html(data);

                    // PAGE tag 찾아 dpage 연결
                    $page = dpage.$page = self._$body.children("[page-declare='dpage']");
                    $page.each(function(idx, epage) {
                        STracer("openPage").frm(`2.0 [${self._element_id}]: element link.`, $page);
                        // epage._dpage = dpage;
                        epage.getPage = function() { return dpage; };
                        epage.getParam = function() { return page_param; };
                    });

                    // FRAME: page_open 이벤트
                    STracer("openPage").frm(`3.0 [${self._element_id}]: onPageOpen.`, $page);
                    if( callback == null ) {
                        self._$body.triggerHandler(jQuery.Event('page_open'), dpage, page_param);
                    } else {
                        callback(dpage);
                        callback = null;
                    }

                    // FRAME: include-page replace 후 page_load 이벤트
                    self.makePageInclude(self._$body).then(function() {
                        STracer("openPage").frm(`6.0 [${self._element_id}]: onPageLoad...`);
                        self._$body.triggerHandler(jQuery.Event('page_load'), dpage);
                    });

                    // PAGE: onload 인벤트
                    STracer("openPage").frm(`4.0 [${self._element_id}]: onload trigger (before).`, $page);
                    _common_page._event_function($page, 'onopen');

                    self._$body.ready(function() {
                        STracer("openPage").frm(`12 [${self._element_id}]: onPageReady...`);
                        self._$body.triggerHandler(jQuery.Event('page_ready'), dpage);
                        _common_page._event_function($page, 'onload');
                    });
                } catch(err) {
                    STracer("openPage").err(`error[${page_file}]:`, err);
                    dpage.error = err;
                    callback && callback(dpage);
                }

                STracer("openPage").frm(`5.0 [${self._element_id}]: openPage finish.`, $page);
                SBalance.setTimewait(false);
            })
            .catch(function(err) {
                SBalance.setTimewait(false);
                STracer("openPage").err(`response.catch[${page_file}]:`, err);
                if( err.status == 401 ) {
                    window.location = "/";
                }
            });
            return dpage;
        },
    };
}
