function lslider(e,i){var t,n,s;null==e||$(e).length<=0||((i=i||{}).limit=i.limit||"100",t={limit:i.limit},n=i.limit.replace(/[0-9]/g,""),i=parseInt(i.limit.match(/[0-9]/g).join("")),t.limit="%"===n?Math.floor(window.screen.height*i/100,1):i,s={option:t,handle:null,element:e,reset:function(){this.handle=null,$(this.element).css("height",0)},_getpos:function(e){return e.touches&&0<e.touches.length?{pageY:e.touches[0].pageY,screenY:e.touches[0].screenY}:{pageY:e.pageY,screenY:e.screenY}},_begin:function(e,i){0==$(e).scrollTop()&&(e=this._getpos(i),this.reset(),this.handle={is_begin:!0,pageY:e.pageY},$(this.element).css("visibility","visible"),$(this.element).trigger("sliding",["begin"]))},_cancel:function(e){this.handle&&this.handle.is_begin&&this.reset()},_slided:function(e){this.handle&&this.handle.is_begin&&(this.handle.is_begin=null,parseInt($(this.element).css("height"))>=this.option.limit?$(this.element).trigger("slided",[this.handle.step]):this.reset(e))},_sliding:function(e){var i;this.handle&&this.handle.is_begin&&((i=this._getpos(e).pageY-this.handle.pageY)>this.option.limit&&(i=this.option.limit),this.handle.last!=i)&&(this.handle.last=i,this.handle.time=e.timeStamp,$(this.element).css("height",i),i==this.option.limit?(this.handle.step="slidon",$(this.element).trigger("sliding",["slidon"])):null!=this.handle.step&&(this.handle.step=null,$(this.element).trigger("sliding",["cancel"])))}},$(e)[0]._lslider=s,$(e)[0].sliderReset=function(){s.reset()},null==$(e).parent()&&console.error("not found parent-element."),$(e).parent().on("mousedown",function(e){s._begin($(this),e)}),$(e).parent().on("mouseup",function(e){s._slided(e)}),$(e).parent().on("mouseleave",function(e){s._cancel(e)}),$(e).parent().on("mousemove",function(e){s._sliding(e)}),$(e).parent().on("touchstart",function(e){s._begin($(this),e)}),$(e).parent().on("touchend",function(e){s._slided(e)}),$(e).parent().on("touchcancel",function(e){s._cancel(e)}),$(e).parent().on("touchmove",function(e){s._sliding(e)}),$(e).css("height","0"),$(e).css("width","100%"),$(e).css("background-color",t.background),$(e).css("top",0),$(e).css("overflow","hidden"),$(e).css("z-index","1001"))}