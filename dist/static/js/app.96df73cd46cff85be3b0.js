webpackJsonp([1],{"2Jmu":function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=i("Gu7T"),s=i.n(n),o=i("mvHQ"),r=i.n(o),a=i("c/Tr"),h=i.n(a),c=i("woOf"),u=i.n(c),d=i("Zrlr"),l=i.n(d),p=i("wxAW"),f=i.n(p),v={currentIndex:0,width:0,slideDerection:"",list:[],interval:4e3,auto:!1,loop:!1,direction:"horizontal",showDots:!1,dotsPosition:"center",duration:500,minMovingDistance:30},m=function(){function t(e){l()(this,t);var i=u()({},v,e),n=i.currentIndex,s=i.width,o=i.slideDerection,r=i.list,a=i.wrap,h=i.duration,c=i.interval,d=i.auto,p=i.loop,f=i.direction,m=i.minMovingDistance;this.currentIndex=n,this.width=s,this.slideDerection=o,this._touchStartInfo={},this._touchMoveInfo={},this._touchEndInfo={},this.isTouchMoving=!1,this.list=r,this.wrap=a,this.duration=h,this._eventHandler={},this.interval=c,this.auto=d,this.loop=p,this.minMovingDistance=m,this.direction=f,this.onlyOne=1===this.list.length,this.list.length&&(this._init(),this._auto(),this._bindEvent())}return f()(t,[{key:"_init",value:function(){this._updateWidth(),this.getSwiperItem(),this.setOffset(),this.setInitTransform()}},{key:"_auto",value:function(){var t=this;this._stop(),this.auto&&(this.timer=setTimeout(function(){t.next()},this.interval))}},{key:"_stop",value:function(){this.timer&&clearTimeout(this.timer)}},{key:"_bindEvent",value:function(){var t=this.checkTransitionEvent(),e=this.getSwiperItem(),i=this.getSwiper();e[0]&&e[0].addEventListener(t,this.transitionEndHandler.bind(this),!1),i.addEventListener("touchstart",this.handleTouchStart.bind(this),!1),i.addEventListener("touchmove",this.handleTouchMove.bind(this),!1),i.addEventListener("touchend",this.handleTouchEnd.bind(this),!1),window.addEventListener("orientationchange",this.handleTouchResize.bind(this),!1)}},{key:"_unbindEvent",value:function(){var t=this.checkTransitionEvent(),e=this.getSwiperItem(),i=this.getSwiper();e[0]&&e[0].removeEventListener(t,this.transitionEndHandler,!1),i.removeEventListener("touchstart",this.handleTouchStart,!1),i.removeEventListener("touchmove",this.handleTouchMove,!1),i.removeEventListener("touchend",this.handleTouchEnd,!1),window.removeEventListener("orientationchange",this.handleTouchResize.bind(this),!1)}},{key:"on",value:function(t,e){return this._eventHandler[t]&&console.error("event不能重复注册"),"function"!=typeof e&&console.error("callback需要是function"),this._eventHandler[t]=e,this}},{key:"_updateWidth",value:function(){var t=this.getSwiper();this.width="horizontal"===this.direction?t.offsetWidth||document.documentElement.offsetWidth:t.offsetHeight}},{key:"next",value:function(){this.slideDerection="nexted",this.currentIndex+=1,this.go(this.currentIndex)}},{key:"prev",value:function(){this.slideDerection="preved",this.currentIndex-=1,this.go(this.currentIndex)}},{key:"go",value:function(t){var e=this;this._stop(),t>this.list.length-1&&(this.currentIndex=0),t<0&&(this.currentIndex=this.list.length-1),this.forItems(function(t,i){e.setTransition(t,e.duration);var n="nexted"===e.slideDerection?e._offset[i]-e.width:e._offset[i]+e.width;!e.loop&&e.auto&&0===e.currentIndex&&(n=i*e.width),e.setTransform(t,n)}),this._auto()}},{key:"setDom",value:function(t,e,i,n){switch(t){case"remove":i.removeChild(e);break;case"append":i.appendChild(e);break;case"insertBefore":i.insertBefore(e,n);break;default:console.log("无匹配操作")}return e}},{key:"transitionEndHandler",value:function(t){var e=this;if(this.loop){var i=this.getSwiperItem(),n=i[0].parentNode,s="nexted"===this.slideDerection?this.setDom("remove",i[0],n):this.setDom("remove",i[i.length-1],n);i=this.getSwiperItem(),"nexted"===this.slideDerection?this.setDom("append",s,n):this.setDom("insertBefore",s,n,i[0])}this.forItems(function(t,i){e.setTransition(t);var n=e._offset[i];e.loop||(n="nexted"===e.slideDerection?n-e.width:n+e.width,e.auto&&0===e.currentIndex&&(n=i*e.width)),e.setTransform(t,n)}),this.setOffset(),this._eventHandler.swiperEnd&&this._eventHandler.swiperEnd.call(this,this.currentIndex),t.preventDefault()}},{key:"checkTransitionEvent",value:function(){var t=document.createElement("div"),e={transition:"transitionend",OTransition:"oTransitionEnd",MozTransition:"transitionend",WebkitTransition:"webkitTransitionEnd"};for(var i in e)if(void 0!==t.style[i])return e[i]}},{key:"handleTouchStart",value:function(t){var e=t.targetTouches[0];this._touchStartInfo={pageX:e.pageX,pageY:e.pageY}}},{key:"handleTouchMove",value:function(t){var e=this;this.isTouchMoving=!0;var i=t.targetTouches[0];this._touchMoveInfo={pageX:i.pageX,pageY:i.pageY};var n=this._touchMoveInfo.pageX-this._touchStartInfo.pageX,s=this._touchMoveInfo.pageY-this._touchStartInfo.pageY,o="horizontal"===this.direction?n:s;this.forItems(function(t,i){e.setTransition(t);var n=parseInt(t.dataset.offset,10)+o;e.setTransform(t,n)})}},{key:"handleTouchEnd",value:function(t){var e=this;this.isTouchMoving=!1;var i=t.changedTouches[0];this._touchEndInfo={pageX:i.pageX,pageY:i.pageY};var n=this._touchEndInfo.pageX-this._touchStartInfo.pageX,s=this._touchEndInfo.pageY-this._touchStartInfo.pageY,o="horizontal"===this.direction?n:s;o>this.minMovingDistance&&(this.loop||!this.loop&&0!==this.currentIndex)?this.prev():o<-this.minMovingDistance&&(this.loop||!this.loop&&this.currentIndex!==this.list.length-1)?this.next():this.forItems(function(t){e.setTransition(t);var i=parseInt(t.dataset.offset,10);e.setTransform(t,i)})}},{key:"handleTouchResize",value:function(){var t=this;setTimeout(function(){t._updateWidth(),t.setOffset(),t.setInitTransform()},100)}},{key:"setTransition",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;if(!this.onlyOne){var i="all "+e+"ms ease 0s";t.style.webkitTransition=i,t.style.transition=i}}},{key:"setTransform",value:function(t,e){if(!this.onlyOne){var i="horizontal"===this.direction?"translate3d("+e+"px, 0, 0)":"translate3d(0, "+e+"px, 0)";t.style.transform=i}}},{key:"setOffset",value:function(){var t=this,e=this.list.map(function(e,i){return t.loop?-t.width*(1-i):t.width*(i-t.currentIndex)});this._offset=e||[];var i=this.getSwiperItem();this._offset.forEach(function(t,e){i[e].setAttribute("data-offset",t)})}},{key:"getSwiperItem",value:function(){var t=this.wrap.querySelectorAll(".slide-item")||[];return h()(t)}},{key:"getSwiper",value:function(){return this.wrap||{}}},{key:"forItems",value:function(t){this.getSwiperItem().forEach(t)}},{key:"setInitTransform",value:function(){var t=this;this.getSwiperItem().forEach(function(e,i){if(!t.onlyOne){var n=t._offset[i];t.setTransform(e,n)}})}},{key:"destory",value:function(){this._stop(),this._unbindEvent(),this.currentIndex=0}}]),t}(),g={name:"Swiper",props:{value:{type:Number,default:0},list:{type:Array,default:function(){return[]}},height:{type:[String,Number]},duration:{type:Number,default:300},auto:{type:Boolean,default:!0},showDots:{type:Boolean,default:!1},loop:{type:Boolean,default:!1},direction:{type:String,default:"horizontal"},isBroadcast:{type:Boolean,default:!1},minMovingDistance:{type:Number,default:30},interval:{type:Number,default:4e3},className:{type:String}},data:function(){return{currentIndex:(this.value>=this.list.length?0:this.value)||0,newList:[]}},computed:{newHeight:function(){return this.height}},methods:{init:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,e=this;this.swiper&&this.swiper.destory(),this.swiper=new m({wrap:this.$refs.box,currentIndex:t,slideDerection:this.slideDerection,list:this.newList,duration:this.duration,auto:this.auto,loop:this.loop,direction:this.direction,minMovingDistance:this.minMovingDistance}).on("swiperEnd",function(t){var i=t;e.loop&&2===e.list.length&&(i=t%2),e.currentIndex=i,e.$emit("swiperEnd",this.swiper)})},reRender:function(){var t=this;this.$el&&this.$nextTick(function(){t.destory(),t.currentIndex=t.value,t.getNewList(),t.init(t.value)})},getNewList:function(){var t=JSON.parse(r()(this.list));return this.loop&&(2===t.length&&(t=[].concat(s()(t),s()(t))),t=[].concat(s()(t.slice(this.currentIndex-1)),s()(t.slice(0,this.currentIndex-1)))),t},selectItem:function(){this.$emit("selectItem",this.currentIndex)}},watch:{currentIndex:function(t){this.$emit("input",t)},list:function(t,e){r()(t)!==r()(e)&&this.reRender()}},created:function(){this.newList=this.getNewList()},mounted:function(){this.newList.length&&this.init(this.currentIndex)},beforeDestory:function(){this.swiper&&this.swiper.destroy()}},w={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{ref:"box",staticClass:"slide-wrap",class:{className:t.className}},[i("div",{ref:"slide",staticClass:"slide-content",style:{height:t.height},attrs:{currentIndex:t.currentIndex}},t._l(t.newList,function(e,n){return i("div",{key:n,staticClass:"slide-item",class:[1===n&&"active"],on:{click:t.selectItem}},[t.isBroadcast?i("div",{staticClass:"swiper-txt",style:{height:t.height,lineHeight:t.height}},[t._v("\n                "+t._s(e.txt)+"\n            ")]):i("div",{staticClass:"slide-item__img",style:{backgroundImage:"url("+e.img+")"}})])})),t._v(" "),t.showDots?i("div",{staticClass:"swiper-dots"},t._l(t.list,function(e,n){return i("span",{key:n,class:[n===t.currentIndex?"active":""]})})):t._e()])},staticRenderFns:[]};var I=i("VU/8")(g,w,!1,function(t){i("nrFZ")},"data-v-5a7316fe",null);e.default=I.exports},"4OB5":function(t,e,i){t.exports=i.p+"static/img/pic2.391dace.jpg"},"7x6j":function(t,e,i){t.exports=i("2Jmu")},"8FKN":function(t,e){},KZxS:function(t,e,i){t.exports=i.p+"static/img/pic3.e34c6fa.png"},NHnr:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=i("7+uW"),s=i("7x6j"),o={name:"App",components:{swiper:i.n(s).a},data:function(){return{bannerList:[{img:i("gZAi"),href:"0",txt:"这是一条消息0"},{img:i("4OB5"),href:"1",txt:"这是一条消息1"},{img:i("KZxS"),href:"2",txt:"这是一条消息2"},{img:i("az8C"),href:"3",txt:"这是一条消息3"}],swiperIndex:4}},watch:{swiperIndex:function(t){console.log("swiperIndex",t)}},methods:{selectItem:function(t){console.log(t)}},computed:{}},r={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{attrs:{id:"app"}},[i("swiper",{attrs:{list:t.bannerList,height:"180px",loop:!0,auto:!1,showDots:!0},on:{selectItem:t.selectItem},model:{value:t.swiperIndex,callback:function(e){t.swiperIndex=e},expression:"swiperIndex"}}),t._v(" "),i("div",{staticStyle:{"margin-top":"10px"}}),t._v(" "),i("swiper",{attrs:{list:t.bannerList,height:"180px",loop:!0,auto:!0,direction:"vertical"}}),t._v(" "),i("div",{staticStyle:{"margin-top":"10px"}}),t._v(" "),i("div",{staticClass:"broadcast"},[i("p"),t._v(" "),i("swiper",{attrs:{isBroadcast:!0,showDots:!1,list:t.bannerList,height:"30px",loop:!0,auto:!0}})],1),t._v(" "),i("div",{staticStyle:{"margin-top":"10px"}}),t._v(" "),i("div",{staticClass:"broadcast"},[i("p"),t._v(" "),i("swiper",{attrs:{isBroadcast:!0,showDots:!1,list:t.bannerList,height:"30px",loop:!0,auto:!0,minMovingDistance:10,direction:"vertical"}})],1)],1)},staticRenderFns:[]};var a=i("VU/8")(o,r,!1,function(t){i("8FKN")},null,null).exports;n.a.config.productionTip=!1,new n.a({el:"#app",components:{App:a},template:"<App/>"})},az8C:function(t,e,i){t.exports=i.p+"static/img/pic4.e22f0fb.jpg"},gZAi:function(t,e,i){t.exports=i.p+"static/img/pic1.db97e40.jpg"},nrFZ:function(t,e){}},["NHnr"]);
//# sourceMappingURL=app.96df73cd46cff85be3b0.js.map