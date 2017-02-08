/*
 * writer : onekwan
 * version : 1.0.0
 */
(function(window){
	if(window.imagesSlider) return false;
	var evTouchStart;
    var evTouchMove;
    var evTouchEnd;
    var resizeEvent = 'onorientationchange' in window ? 'orientationchange' : 'resize'
    function inferInputModel() {
	    if (window.navigator.msPointerEnabled) {
       		return 'pointer';
	    } else if (window.ontouchstart !== undefined) {
	        return 'touch';
	    } else {
	        return 'unknown';
	    }
	}
	switch (inferInputModel()) {
	    case 'pointer':
	    	evTouchStart = "MSPointerDown";
	        evTouchMove = "MSPointerMove";
	        evTouchEnd = "MSPointerUp";
	        /*  'MSPointerDown','MSPointerOut','MSPointerUp','MSPointerCancel','MSHoldVisual'  */
	        break;
	    case 'touch':
	    	evTouchStart = "touchstart";
	        evTouchMove = "touchmove";
	        evTouchEnd = "touchend";
	    	/* 'touchstart', 'touchend', 'mousedown', 'mouseout', 'mouseup' */
	        break;
	    default:
	    	evTouchStart = "mousedown";
	        evTouchMove = "mousemove";
	        evTouchEnd = "mouseup";
	        /* 'mousedown', 'mouseout', 'mouseup' */
	        break;
	};
	var dummyStyle = document.createElement('div').style,
	vendor = (function () {
		var vendors = 't,webkitT,MozT,msT,OT'.split(','),
			t,
			i = 0,
			l = vendors.length;

		for ( ; i < l; i++ ) {
			t = vendors[i] + 'ransform';
			if ( t in dummyStyle ) {
				return vendors[i].substr(0, vendors[i].length - 1);
			}
		}
		return false;
	})(),
	defaultOptions = {
    	before : null,
    	change : null,
    	after : null
    },
    transform = prefixStyle('transform'),
	transitionDuration = prefixStyle('transitionDuration'),
	transitionTimingFunction = prefixStyle('transitionDuration'),
    CONT_WIDTH = 720,
	CONT_HEIGHT = 734,
	CONT_RATIO = CONT_HEIGHT/CONT_WIDTH,
    hasTouch = 'ontouchstart' in window,
    DRAG_BOUNDARY = 0.15
    circleWidth = 16,
    circleMargin = 0
    ;
	function prefixStyle (style) {
		if ( vendor === '' ) return style;

		style = style.charAt(0).toUpperCase() + style.substr(1);
		return vendor + style;
		return vendor + style;
	}
	function extend(el, attribs) {
		var obj = {};
		for (var x in attribs) obj[x] = el[x];
		for (var y in attribs) obj[y] = attribs[y];
		return obj;
	}
	window.imagesSlider = function(container,options){
		var instance = new ImagesSlider(container,options);
		instance.init();
		return instance;
	};
	function ImagesSlider(container,options){
		this.$container = container;
		this.defaultOptions = extend(defaultOptions, options);
		this.$itemsWrapper = this.$container.querySelector(".list_wrap");
		this.$itemsWrapper.style[transitionTimingFunction] = "linear";
		this.items = this.$itemsWrapper.querySelectorAll(".item");
		this.itemsLength = this.items.length;
		this.itemsWidth = this.$container.offsetWidth;
		this.itemsHeight = this.$container.offsetWidth*CONT_RATIO;
		if(this.itemsHeight > 600){
			this.itemsHeight = 600;
			this.itemsWidth = this.itemsHeight * (1/CONT_RATIO);
		}
		this.$container.style.height = this.itemsHeight + "px";
		this.funcArea = this.itemsWidth * DRAG_BOUNDARY;
        this.curItem = 0;
	}

	ImagesSlider.prototype = {
		init : function(container,options){
			if(this.itemsLength <= 1) {
				return false;
			}
			this.buildChain();
			this.buildHtml();
			this.addEvent();
		},
		buildHtml : function(){
			var self=this;
			for(var i = 0;i<this.items.length;i++){
				var img = this.items[i].querySelector("img");
				if (img.complete || img.readyState === 'complete') {
					imgSizing(img);
				} else {
					img.onload = function(){
						imgSizing(this);
					};
					if (navigator.userAgent.indexOf("Trident/5") >= 0 || navigator.userAgent.indexOf("Trident/6")) {
						img.src = img.src;
					}
				}
			}
			function imgSizing(img){
				var n_width = img.naturalWidth;
				var n_height = img.naturalHeight;

				if(n_width>self.itemsWidth || n_height>self.itemsHeight){
					var p_r = self.itemsWidth / self.itemsHeight;
					var c_r = n_width / n_height;
					if (p_r < c_r) {
						img.style.width = self.itemsWidth  + "px";
						img.style.height =  self.itemsWidth*(1/c_r)  + "px";
					} else {
						img.style.width = self.itemsHeight*(c_r)  + "px";
						img.style.height =  self.itemsHeight + "px";
					}
				}
				img.style.position = "absolute";
				img.style.top = "50%";
				img.style.left = "50%";
				img.style.marginTop = -(img.offsetHeight/2) + "px";
				img.style.marginLeft = -(img.offsetWidth/2) + "px";
				img.style.visibility = "visible";
			}
		},
		moveImage : function(distance){
			this.$itemsWrapper.style[transform] = "translate3d("+distance+"px,0,0)";
		},
		moveStep : function(step){
			var self = this;
			self.curItem = step;
			self.curPos = -(self.itemsWidth*(1+self.curItem));
			self.moveImage(self.curPos);
		},
		changeStatus : function(){
			for(var i=0;i<this.items.length;i++){
				this.items[i].className = this.items[i].className.replace(/focus/ig,"");
			}
			this.items[this.curItem+1].className = this.items[this.curItem+1].className + " focus";
			if(this.defaultOptions.change) this.defaultOptions.change();
		},
		buildChain : function(){
			var self = this;
			this.$itemsWrapper.appendChild(this.items[0].cloneNode(true));
			this.$itemsWrapper.insertBefore(this.items[this.itemsLength-1].cloneNode(true),this.items[0]);
			this.items = this.$itemsWrapper.querySelectorAll(".item");
			for(var i=0;i<this.items.length;i++){
				this.items[i].style.width = self.itemsWidth + "px";
				this.items[i].style.height = self.itemsHeight + "px";
				this.items[i].style.left = i*self.itemsWidth + "px";
			}
			this.moveImage(-this.itemsWidth);
		},
		animIntervalFunc : function(end,easingTime){
			var self = this;
			if(self.animing) return;
			self.animing = true;
			this.$itemsWrapper.style[transitionDuration] = easingTime+"s";
			self.moveImage(end);
			self.changeStatus();
			setTimeout(function(){
				self.$itemsWrapper.style[transitionDuration] = "0s";
				self.animing = false;
			},easingTime*1000);
		},
		handleEvent : function(e){
			switch (e.type) {
				case evTouchStart:
					this.start(e);
					break;
				case evTouchMove:
					this.move(e);
					break;
				case evTouchEnd:
					this.end(e);
					break;
				case resizeEvent :
					this.resize();
					break;
			}
		},
		addEvent : function(){
			var self = this;
			window.addEventListener(resizeEvent, this, false);
			self.$container.addEventListener(evTouchStart, this, false);
			self.$container.addEventListener(evTouchMove, this, false);
			self.$container.addEventListener(evTouchEnd, this, false);
		},
		start : function(e){
			var self = this;
			if(self.animing || self.exclusive) return;
			var ev = hasTouch ? e.touches[0] : e;
			self.focusMoving = false;
			self.moved = true;
			self.exclusive = true;
			self.dontMoveFlag = false;
			self.startX = ev.pageX;
			self.startY = ev.pageY;
			self.moveX = ev.pageX;
			self.moveY = ev.pageY;
			self.moveDx = 0;
			self.curPos = -(self.itemsWidth*(1+self.curItem));
			self.totmX = 0;
			self.totmY = 0;
			self.directionLocked = false;
			self.curPos;
			self.animing = false;
		},
		move : function(e){
			var self=this;
			var ev = hasTouch ? e.touches[0] : e;
			if(self.animing || !self.exclusive) return;
			var deltaX = ev.pageX - self.startX;
			var deltaY = ev.pageY - self.startY;
			self.moveDx = ev.pageX - self.startX;

			self.totmX += Math.abs(deltaX);
			self.totmY += Math.abs(deltaY);

			if (self.totmX < 10 && self.totmY < 10) {
				//self.moved = false;
				return;
			}

			if (!self.focusMoving && self.totmY > self.totmX) {
				self.exclusive = false;
				return;
			}

			e.preventDefault();
			self.focusMoving = true;
			self.moveDistance = self.moveDx + parseInt(self.curPos);
			self.moveImage(self.moveDistance);

		},
		end : function(e){
			var self=this;
			if(self.animing || !self.exclusive) return;
			self.exclusive = false;
			if (self.moveDx == 0) {
				if(self.defaultOptions.onClick) {
					self.defaultOptions.onClick(self.items, self.curItem)
				}
				return;
			}
			if(Math.abs(self.moveDx)>self.funcArea){
				self.curItem = self.moveDx>0? self.curItem -1:self.curItem +1;
				var end = -(self.itemsWidth*(1+self.curItem));
				if(self.curItem>=self.itemsLength){
					self.curItem=0;
					self.curPos = -self.itemsWidth;
				}
				if(self.curItem<0){
					self.curItem = self.itemsLength - 1;
					self.curPos = -(self.itemsWidth*self.itemsLength);
				}
				if(self.defaultOptions.before) self.defaultOptions.before();
				self.animIntervalFunc(end,0.5);
			}else{
				var end = -(self.itemsWidth*(1+self.curItem));
				if(self.moveDx!=0){
					self.animIntervalFunc(end,0.2);
				}
			}
		},
		resize : function(){
			var self = this;
			this.itemsWidth = this.$container.offsetWidth;
			this.itemsHeight = this.itemsWidth*CONT_RATIO;

			if(this.itemsHeight > 600){
				this.itemsHeight = 600;
				this.itemsWidth = this.itemsHeight * (1/CONT_RATIO);
			}
			this.$container.style.height = this.itemsHeight + "px";
			this.funcArea = this.itemsWidth * DRAG_BOUNDARY;
			for(var i = 0;i<this.items.length;i++){
				this.items[i].style.width = self.itemsWidth + "px";
				this.items[i].style.height = self.itemsHeight + "px";
				this.items[i].style.left = i*self.itemsWidth + "px";
			}
			self.curPos = -(self.itemsWidth*(1+self.curItem));
			self.moveImage(self.curPos);
			self.buildHtml();
		},
		destroy : function(){
			var self=this;
			self.$container.removeEventListener(evTouchStart, this, false);
			self.$container.removeEventListener(evTouchMove, this, false);
			self.$container.removeEventListener(evTouchEnd, this, false);
		}
	}
})(window);