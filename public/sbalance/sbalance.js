
function createSBalance()
{
    if( window.SBInterface == null ) {
        window.SBInterface = {
            m_signin : null,
            getMode : function() { return 'web'; },
            showMain : function() {},
            readMessage : function(inbound, str_cache) { return false; },
            shareLink : function(link_url, link_text) {
                if( navigator.share == null ) {
                    console.log("공유하기를 지원하지 않는 환경입니다.")
                    return;
                }
                let shareData = {
                    title: 'SBalance',
                    text: link_text,
                    url: `${link_url}${link_text}`,
                };
                navigator.share(shareData);
            },

            isRememberMe : function() {
                if( this.m_signin != null ) return this.m_signin.is_rememberme;
                return false;
            },
            getRememberMe : function() { return JSON.stringify(this.m_signin); },
            onSignin : function(str_result) {
                localStorage.setItem("signin", str_result);
                return true;
            },
            onSignout : function() {
                this.m_signin.is_rememberme = false;
                localStorage.setItem("signin", JSON.stringify(this.m_signin));
            },
        };

        window.SBInterface.m_signin = localStorage.getItem("signin");
        window.SBInterface.m_signin = JSON.parse(window.SBInterface.m_signin);
        console.log("SBInterface.sign:", window.SBInterface.m_signin);

        history.pushState(null, null, location.href);
        window.onpopstate = function(event) { 
            history.pushState(null, document.title, location.href);
            window.SBalance.onBackPressed();
        };
    } else {
        console.log("Mobile-Mode...");

        console.log = function() {};
        console.debug = function() {};
    }

    const screen_waitor = $("#screen-waitor");
    window.SBalance = {
        m_cache : {},
        m_signin : null,
        m_mframe : null,
        // user-declare
        // pre-declear
        getMode : function() { return window.SBInterface.getMode(); },
        getArgs : function(key) {
            if( key ) return this._args[key];
            return this._args;
        },
        setTimewait(is_wait) { 
            if( is_wait == true ) {
                screen_waitor.css("display", "block");
            } else {
                screen_waitor.css("display", "none");
            }
        },
        readMessage : function(inbound, _onRead, _onFinish) {
            var self = this;
            self.m_cache.readMessage = {
                onRead : function(readJson) { _onRead(readJson); },
                onFinish : function(readCount) {
                    self.m_cache.readMessage = null;
                    _onFinish(readCount);
                },
            };
            if( window.SBInterface.readMessage(JSON.stringify(inbound), 'SBalance.m_cache.readMessage') == false ) {
                _onFinish(0);
                return;
            }
        },
        shareLink : function(link_text) {
            return window.SBInterface.shareLink('https://sbalance.duckdns.org:8083', link_text);
        },
        isRememberMe : function() { return window.SBInterface.isRememberMe(); },
        getRememberMe : function() { return JSON.parse(window.SBInterface.getRememberMe()); },
        getSignin : function(key) {
            if( this.m_signin == null ) return null;
            if( key != null ) return this.m_signin[key];
            return this.m_signin;
        },

        getFrame : function() { return this.m_mframe; },
        setFrame : function(frame) { this.m_mframe = frame; },

        request : function(url, inbound, callback) {
            return new Promise(function(resolve, reject) {
                $.post(url, inbound)
                .done(function(result) {
                    if( result.error != null && result.error.success != 'Y' ) {
                        if( result.error.code != null ) {
                            STracer("request").err(`error:`, result.error);
                            setTimeout(function() {
                                window.location = "/";
                            }, 0);
                        }
                        reject(new Error(result.error.message));
                    } else {
                        resolve(result);
                    }
                })
                .fail(function(xhr, status, error) {
                    var err_svr = new Error(`서버 응답 오류 입니다. (${error||status})`);
                    err_svr.kind = "server";
                    reject(err_svr);
                });
            });
        },

        onBackPressed : function() {
            var self = this;
            var is_modal = false;
            if( window.dmodal != null && window.dmodal.isOpen() != false ) {
                window.dmodal.close(null);
            }
            else
            if( self.getFrame() != null ) {
                if( self.getFrame().send('backward') == null ) {
                    // 열린 Dialog 가 없으면 Exit Dialog 표시
                    console.log("modal.exit doModal...");
                    is_modal = true;
                }
            }
            else {
                is_modal = true;
            }

            if( is_modal == true ) {
                if( window.SBInterface.getMode() == 'web' ) {
                    this.onSignout();
                } else {
                    window.openModal('/public/modal/modal.exit.html', null, function(result) {
                        // console.log("modal.exit result:", result);
                        if( result != null ) {
                            window.SBInterface.exit();
                        }
                    });
                }
            }
        },
        onRefresh : function() {
            var self = this;
            console.log("onRefresh:", $("page"));
            self.getFrame() && self.getFrame().send('refresh');
        },
        onSignout : function() {
            var self = this;
            if( self.getFrame() == null ) {
                window.location = "/";
            } else {
                window.openModal('/main/modal/modal.signout.html', null, function(result) {
                    if( result && result.data && result.data.location != null ) {
                        window.SBInterface.onSignout();
                        onMainDestroy();
                        window.location = "/?type=passive";
                    }
                });
            }
        },
        onSignin(is_sign, result, saved) {
            var self = this;
            if( is_sign != true ) {
                self.onDisplay('sign').then(function() {
                    console.log("SBInterface.onDisplay()");
                    window.SBInterface.showMain();
                });
                return;
            }

            var timeouts = 0;
            var type_main = 'sign';
            if( result ) {
                if( window.SBInterface.onSignin(JSON.stringify(result)) == true ) {
                    self.m_signin = result;
                    timeouts = (self.getMode() != 'web') ? 2000 : 0;
                    type_main = 'main';
                }
            }
            setTimeout(function() {
                self.onDisplay(type_main).then(function() {
                    console.log("SBInterface.onDisplay()");
                    window.SBInterface.showMain();
                });
            }, timeouts);
        },
        onDisplay : function(type) {},
    };

    window.SBalance._args = parameterFromUrl(location.href);
    history.replaceState({}, null, "/");
    console.log("SBalance._args:", window.SBalance._args);

    /* window.SBalance.onBackPressed = function() {
        var $parray = $("page");
        var ppos = $parray.length - 1;
        console.log("$parray:", $parray.length);
        for( ; ppos>= 0; ppos-- ) { // 젤 하단 Child 한테만 넘긴다.
            var events = $._data($parray[ppos], "events");
            if( events && events.onbackward != null ) {
                console.log("onBackPressed event :", events);
                // $("page").last().trigger('onbackward');
                if( events.onbackward[0].handler() == true ) {
                    return;
                }
            }
        }
        $(window.document).trigger('onbackward');
    }; */

    console.log("createInterface:" + window.SBalance.getMode() + ", rememberme:" + window.SBalance.isRememberMe());
}

/*
    framework
        - top
        - main
            - page 
                - view
        - footer
        + dialog
*/
function onMainInit()
{
    createSBalance();
    // createPage();
}

function onMainDestroy()
{
    window.SBalance.setFrame(null);
}

function includePage(tag_name, jbody)
{
    if( jbody == null ) {
        return;
    }
    var next = Promise.resolve();
    jbody.find(`[${tag_name}]`).each(function(index, item) {
        var attr = $(item).attr(tag_name);
        next = next.then(function() {
            return new Promise(function(resolve, reject) {
                STracer("includePage").log(`page loaded:`, attr);
                $.get(attr, function(data) {
                    $(item).removeAttr(tag_name, '');
                    $(item).html(data);
                    resolve();
                });
            });
        });
    });
    return next;
}

// $(onMainInit);

window.openModal = function(dlg_file, param, callback) {
    var dmodal = window.dmodal;
    if( dmodal == null ) {
        dmodal = {
            $modal : $("#dialog_modal"),
            _pages : [],
            _data : null,
            isOpen : function() { return this._data == null ? false : true; },
            getParam : function() { return this._data.param; },
            getModal : function() { return this.$modal; },
            exit : function(result) {
                var self = this;
                console.log("doModal: exit()...");
                var _data = self._pages.pop();
                self._pages = [];

                if( self._data == null ) {
                    if( _data != null && _data.callback ) {
                        _data.callback(result, _data.param);
                        _data.callback = null;
                    }
                } else {
                    self._data = _data || self._data;
                    self._data.result = result;
                    self._data.is_closing = false;
                    self.$modal.modal('hide');
                }
            },
            close : function(result) {
                var self = this;
                console.log("doModal: close()...");
                if( self._data == null || self._data.is_closing != null ) {
                    console.log("doModal: close()... already");
                    return;
                }
                self._data.result = result;
                self._data.is_closing = false;
                console.log("doModal: close()... hide");
                self.$modal.modal('hide');
            },
            _open : function() {
                var self = this;
                console.log("doModal: _open", self._data);
                // modal-page setting...
                self._data = self._pages.shift();
                if( self._data == null ) {
                    console.log("doModal: _data clear.");
                    SBalance.setTimewait(false);
                    return;
                }
                self._data.is_closing = null;
                self._data._no_close = null;

                // self._pages = [];
                $.get(`${self._data.file}`, function(data) {
                    self.$modal.ready(function() {
                        console.log("doModal: onready...", self.$modal);
                        self.$modal.modal('show');
                    });
                    self.$modal.html(data);
                    SBalance.setTimewait(false);
                })
                .catch(function(err) {
                    self.close();
                    SBalance.setTimewait(false);
                    if( err.status == 401 ) {
                        window.location = "/";
                    }
                });
            },
        };

        dmodal.$modal.on('hidden.bs.modal', function() {
            console.log("doModal: hidden.bs.modal... 1");
            dmodal._data.is_closing = true;
            dmodal.$modal.empty();
            setTimeout(function() {
                console.log("doModal: hidden.bs.modal... 2");
                var _data = dmodal._data;
                dmodal._data = null;
                if( _data.callback && _data._no_close != true ) {
                    _data.callback(_data.result, _data.param);
                    _data.callback = null;
                }
                if( dmodal._data == null )
                    dmodal._open();
            }, 0);
        });

        dmodal.$modal.on('shown.bs.modal', function() {
            console.log("doModal: shown.bs.modal...");
            dmodal.$modal.focus();
            dmodal._data.param && dmodal._data.param._oninit && dmodal._data.param._oninit();
        });
        window.dmodal = dmodal;
    }

    if( dmodal._data != null && dmodal._data.is_closing == null ) {
        dmodal._data._no_close = true;
        dmodal._pages.unshift(dmodal._data);
    }

    SBalance.setTimewait(true);
    console.log("window.openModal: starting...");
    dmodal._pages.unshift({
        file  : dlg_file,
        param : param,
        callback : callback,
        result: null,
    });
    if( dmodal._data == null ) {
        console.log("window.openModal: openning...");
        dmodal._open();
    } else {
        console.log("window.openModal: closing...");
        dmodal.close();
    }
    return dmodal;
};

window.toast = function(options) {
    window.dtoast = window.dtoast || { toast : null, queue : [], };
    if( window.dtoast.toast == null ) {
        var jtoast = $("#alert_toast");
        if( jtoast == null || jtoast.length <= 0 ) {
            return;
        }

        function show_toast(xtoast, item) {
            var toast_head = xtoast.find(".toast-header");
            toast_head.find(".toast-title").html(item.title_text);
            if( item.title_class ) {
                toast_head.attr('class', 'toast-header'); 
                toast_head.addClass(item.title_class);
                toast_head.find("button").attr('class', 'btn').addClass(item.title_class);
            }

            var toast_body = xtoast.find(".toast-body");
            toast_body.attr('class', 'toast-body');
            toast_body.html(item.mesg_text);
            if( item.mesg_class ) toast_body.addClass(item.mesg_class);

            xtoast.parent().css('display', 'block');
            window.dtoast.toast = new bootstrap.Toast(xtoast[0], {delay: 3000});
            window.dtoast.toast.show();
        }

        show_toast(jtoast, options);
        jtoast.on("hidden.bs.toast", function() {
            if( window.dtoast == null )
                return;
            if( window.dtoast.queue.length > 0 ) {
                var item = window.dtoast.queue.shift();
                show_toast(jtoast, item);
            } else {
                jtoast.parent().css('display', 'none');
                window.dtoast = null;
            }
        });
    } else {
        window.dtoast.queue.push(options);
    }
};

// popage
window.popver = function(pop_file, param, callback) {
    // <!-- popver -->
    var $popade = $(`<div class="w-100 h-100 position-fixed left-0 top-0" style="z-index:1060;background-color:#000;opacity: .5;"></div>`);
    var $popver = $(`<div class="w-100 h-100 position-fixed left-0 top-0" tabindex="-1" style="z-index:1065; display:none;"></div>`);
    $('body').append($popver);

    function _event_trigger($element, event) {
        $element.each(function(idx, element) {
            var fnCallback = Function(element.getAttribute(event));
            if( fnCallback != null )
                fnCallback.call(dpopver);
        });
    }

    SBalance.setTimewait(true);
    var dpopver = {
        $body : $popver,
        find : function(selector) {
            return this.$body.find(selector);
        },
        getPage : function() {
            return this.$body.find("page");
        },
        getParam : function() { return param; },
        _open : function(file, param, callback) {
            var self = this;
            $.get(`${pop_file}`, function(data) {
                /*
                1. document.ready 호출됨 -> onopen
                2. window.onload 호출된 -> onload
                */
                console.log("self.$body:", self.$body);
                self.$body.ready(function() {
                    $('body').append($popade);
                    _event_trigger(self.$body.children('page'), 'onload', self);
                    $popver.show();
                    $popver.focus();
                });

                self.$body.html(data);
                _event_trigger(self.$body.children('page'), 'onopen', self);

                $popver.find("[data-bs-dismiss]").unbind("click");
                $popver.find("[data-bs-dismiss]").click(function(event) {
                    console.log("click:", event);
                    self.close();
                    event.preventDefault();
                });
                SBalance.setTimewait(false);
            })
            .catch(function(err) {
                console.error(err);
                self.close();
                SBalance.setTimewait(false);
            });
        },
        close : function(value) {
            var self = this;
            $popver.remove();
            $popade.remove();
            _event_trigger(self.$body.children('page'), 'onclose');
            callback && callback(value);
            callback = null;
        },
    };
    dpopver._open(pop_file, param, callback);

    $popver[0].addEventListener('mousedown', function(event) {
        var mcontent = $(this).find(".modal-content");
        if( mcontent == null || mcontent.length <= 0 )
            return;
        mcontent = mcontent[0];

        var oleft  = mcontent.offsetLeft;
        var oright = oleft + mcontent.offsetWidth;
        var otop    = mcontent.offsetTop;
        var obottom = otop + mcontent.offsetHeight;

        console.log("chrect~",
            `${oleft} <= ${event.clientX} <= ${oright} : `,
            `${otop} <= ${event.clientY} <= ${obottom}`,
        );
        var is_in = false;
        if( event.clientX >= oleft && event.clientX <= oright ) {
            if( event.clientY >= otop && event.clientY <= obottom ) {
                is_in = true;
                console.log("inrect~",
                    `${oleft} <= ${event.clientX} <= ${oright} : `,
                    `${otop} <= ${event.clientY} <= ${obottom}`,
                );
            }
        }
        if( is_in != true ) {
            dpopver.close();
        }
    });

    var focused = document.activeElement;
    $popver[0].addEventListener('keydown', function(event) {
        console.log("keydown:", event);
        if( event.key != 'Escape' )
            return;

        dpopver.close();
        if( focused != null ) $(focused).focus();
    });
    return dpopver;
}

function getStringByCateType(ci_type) {
    switch( ci_type ) {
    case "N": return "일반";
    case "T": return "이체 계좌";
    case "E": return "예외 (일별만 표시)";
    }
    return "(알수 없음)";
}

function getStringByAccountType(acc_type) {
    switch( acc_type ) {
    case "A": return "자동";
    case "S": return "본인";
    case "L": return "공유";
    }
    return "(알수 없음)";
}
