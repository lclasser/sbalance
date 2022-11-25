
function dpageCreate(page_title, page_file, page_param, page_frame)
{
    return {
        getTitle   : function() { return this.title; },  title : page_title , 
        getFile    : function() { return this.file;  },  file  : page_file  , 
        getParam   : function() { return this.param; },  param : page_param ,
        getFrame   : function() { return this.frame; },  frame : page_frame , 
        getParent  : function() { return this.frame.getOwner(); },
        get$page   : function() { return this.$page; },  $page : null       , 
        getTemper  : function() { return this.temper; }, temper : {},
        createFrame: function(element_id) {
            var dframe = dframeCreate(element_id, this);
            dframe && dframe.makePageLink(this.$page);
            STracer("createFrame").frm(`Z.0 [createPage] : return...`);
            return dframe;
        },
        on(ev_name, ev_callback) {
            var self = this;
            this.$page.on(ev_name, function(event,page) {
                return ev_callback.call(self, event, page);
            });
            return this;
        },
        getReference : page_frame.getReference,
        setDisplay(display) {
            this.$page.css("display", display);
        },
        find : function(selector) {
            return this.$page.find(selector);
        },
        /*
        rumor(ev_name, ev_value) {
            $("page").each(function(idx, page) {
                STracer("pageAlloc").frm("each:", page);
                $(page).triggerHandler(jQuery.Event(ev_name), ev_value);
            });
        },
        publish() {
        },
        */
    };
}

$(function() {
    STracer("pageAlloc").frm(`initialize page.js $(function() {...`);
});
