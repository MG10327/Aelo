
//Animate on Scroll
$(function() {

	var $window           = $(window),
		win_height_padded = $window.height() * 1.1,
		isTouch           = Modernizr.touch;

	if (isTouch) { $('.revealOnScroll').addClass('animated'); }

	$window.on('scroll', revealOnScroll);

	function revealOnScroll() {
	var scrolled = $window.scrollTop(),
		win_height_padded = $window.height() * 1.1;

	// Showed...
	$(".revealOnScroll:not(.animated)").each(function () {
		var $this     = $(this),
			offsetTop = $this.offset().top;

		if (scrolled + win_height_padded > offsetTop) {
		if ($this.data('timeout')) {
			window.setTimeout(function(){
			$this.addClass('animated ' + $this.data('animation'));
			}, parseInt($this.data('timeout'),10));
		} else {
			$this.addClass('animated ' + $this.data('animation'));
		}
		}
	});
	// Hidden...
	$(".revealOnScroll.animated").each(function (index) {
		var $this     = $(this),
			offsetTop = $this.offset().top;
		if (scrolled + win_height_padded < offsetTop) {
		$(this).removeClass('animated fadeInUp flipInX lightSpeedIn')
		}
	});
	}

	revealOnScroll();
	});

	
	//Animated Contact Inputs
	(function() {
		// trim polyfill : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
		if (!String.prototype.trim) {
			(function() {
				// Make sure we trim BOM and NBSP
				var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
				String.prototype.trim = function() {
					return this.replace(rtrim, '');
				};
			})();
		}

		[].slice.call( document.querySelectorAll( 'input.input__field' ) ).forEach( function( inputEl ) {
			// in case the input is already filled..
			if( inputEl.value.trim() !== '' ) {
				classie.add( inputEl.parentNode, 'input--filled' );
			}

			// events:
			inputEl.addEventListener( 'focus', onInputFocus );
			inputEl.addEventListener( 'blur', onInputBlur );
		} );

		function onInputFocus( ev ) {
			classie.add( ev.target.parentNode, 'input--filled' );
		}

		function onInputBlur( ev ) {
			if( ev.target.value.trim() === '' ) {
				classie.remove( ev.target.parentNode, 'input--filled' );
			}
		}
	})();



// Contact Submit Button
;( function( window ) {
	
	'use strict';

	Modernizr.addTest('csstransformspreserve3d', function () {
		var prop = Modernizr.prefixed('transformStyle');
		var val = 'preserve-3d';
		var computedStyle;
		if(!prop) return false;

		prop = prop.replace(/([A-Z])/g, function(str,m1){ return '-' + m1.toLowerCase(); }).replace(/^ms-/,'-ms-');

		Modernizr.testStyles('#modernizr{' + prop + ':' + val + ';}', function (el, rule) {
			computedStyle = window.getComputedStyle ? getComputedStyle(el, null).getPropertyValue(prop) : '';
		});

		return (computedStyle === val);
	});

	function extend( a, b ) {
		for( var key in b ) { 
			if( b.hasOwnProperty( key ) ) {
				a[key] = b[key];
			}
		}
		return a;
	}

	// support
	var support = { transitions : Modernizr.csstransitions, transforms3d : Modernizr.csstransforms3d && Modernizr.csstransformspreserve3d },
		// transition end event name
		transEndEventNames = {
			'WebkitTransition': 'webkitTransitionEnd',
			'MozTransition': 'transitionend',
			'OTransition': 'oTransitionEnd',
			'msTransition': 'MSTransitionEnd',
			'transition': 'transitionend'
		},
		transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ];

	function ProgressButton( el, options ) {
		this.button = el;
		this.options = extend( {}, this.options );
  		extend( this.options, options );
  		this._init();
	}

	ProgressButton.prototype.options = {
		// time in ms that the status (success or error will be displayed)
		// during this time the button will be disabled
		statusTime : 1500
	};

	ProgressButton.prototype._init = function() {
		this._validate();
		// create structure
		this._create();
		// init events
		this._initEvents();
	};

	ProgressButton.prototype._validate = function() {
		// we will consider the fill/horizontal as default
		if( this.button.getAttribute( 'data-style' ) === null ) {
			this.button.setAttribute( 'data-style', 'fill' );
		}
		if( this.button.getAttribute( 'data-vertical' ) === null && this.button.getAttribute( 'data-horizontal' ) === null ) {
			this.button.setAttribute( 'data-horizontal', '' );
		}
		if( !support.transforms3d && this.button.getAttribute( 'data-perspective' ) !== null ) {
			this.button.removeAttribute( 'data-perspective' );
			this.button.setAttribute( 'data-style', 'fill' );
			this.button.removeAttribute( 'data-vertical' );
			this.button.setAttribute( 'data-horizontal', '' );
		}
	};

	ProgressButton.prototype._create = function() {
		var textEl = document.createElement( 'span' );
		textEl.className = 'content';
		textEl.innerHTML = this.button.innerHTML;
		var progressEl = document.createElement( 'span' );
		progressEl.className = 'progress';

		var progressInnerEl = document.createElement( 'span' );
		progressInnerEl.className = 'progress-inner';
		progressEl.appendChild( progressInnerEl );
		// clear content
		this.button.innerHTML = '';

		if( this.button.getAttribute( 'data-perspective' ) !== null ) {
			var progressWrapEl = document.createElement( 'span' );
			progressWrapEl.className = 'progress-wrap';
			progressWrapEl.appendChild( textEl );
			progressWrapEl.appendChild( progressEl );
			this.button.appendChild( progressWrapEl );
		}
		else {
			this.button.appendChild( textEl );
			this.button.appendChild( progressEl );
		}
		
		// the element that serves as the progress bar
		this.progress = progressInnerEl;

		// property to change on the progress element
		if( this.button.getAttribute( 'data-horizontal' ) !== null ) {
			this.progressProp = 'width';
		}
		else if( this.button.getAttribute( 'data-vertical' ) !== null ) {
			this.progressProp = 'height';
		}
		this._enable();
	};

	ProgressButton.prototype._setProgress = function( val ) {
		this.progress.style[ this.progressProp ] = 100 * val + '%';
	};

	ProgressButton.prototype._initEvents = function() {
		var self = this;
		this.button.addEventListener( 'click', function() {
			// disable the button
			self.button.setAttribute( 'disabled', '' );
			// add class state-loading to the button (applies a specific transform to the button depending which data-style is defined - defined in the stylesheets)
			classie.remove( self.progress, 'notransition' );
			classie.add( this, 'state-loading' );

			setTimeout( function() {
				if( typeof self.options.callback === 'function' ) {
					self.options.callback( self );
				}
				else {
					self._setProgress( 1 );
					var onEndTransFn = function( ev ) {
						if( support.transitions && ev.propertyName !== self.progressProp ) return;
						this.removeEventListener( transEndEventName, onEndTransFn );
						self._stop();
					};
					
					if( support.transitions ) {
						self.progress.addEventListener( transEndEventName, onEndTransFn );
					}
					else {
						onEndTransFn.call();
					}
					
				}
			}, 
			self.button.getAttribute( 'data-style' ) === 'fill' || 
			self.button.getAttribute( 'data-style' ) === 'top-line' ||
			self.button.getAttribute( 'data-style' ) === 'lateral-lines' ? 0 : 200 ); // TODO: change timeout to transitionend event callback
		} );
	};

	ProgressButton.prototype._stop = function( status ) {
		var self = this;

		setTimeout( function() {
			// fade out progress bar
			self.progress.style.opacity = 0;
			var onEndTransFn = function( ev ) {
				if( support.transitions && ev.propertyName !== 'opacity' ) return;
				this.removeEventListener( transEndEventName, onEndTransFn );
				classie.add( self.progress, 'notransition' );
				self.progress.style[ self.progressProp ] = '0%';
				self.progress.style.opacity = 1;
			};

			if( support.transitions ) {
				self.progress.addEventListener( transEndEventName, onEndTransFn );
			}
			else {
				onEndTransFn.call();
			}
			
			
			// add class state-success to the button
			if( typeof status === 'number' ) {
				var statusSuccessClass = 'state-success';
				var statusErrorClass = 'state-error';
				var regex=/^[0-9]+$/;
				if(document.getElementById('contactFName').value === "" || document.getElementById('contactLName').value === "" || document.getElementById('contactEmail').value === "" || document.getElementById('contactPhoneNumber').value === "" ||  document.getElementById('contactSubject').value === "" || document.getElementById('contactComments').value === "" ){
					classie.add( self.button, statusErrorClass);
					setTimeout( function() {
						classie.remove( self.button, statusErrorClass);
						self._enable();
					}, self.options.statusTime );
					
					setTimeout( function() {
						// remove class state-loading from the button
						classie.remove( self.button, 'state-loading' );
					}, 100 );
					return false;
					
				 }else {
					classie.add( self.button, statusSuccessClass);
				 }
			}
			else {
				self._enable();
			}

			// remove class state-loading from the button
			classie.remove( self.button, 'state-loading' );
		}, 100 );
	};

	// enable button
	ProgressButton.prototype._enable = function() {
		this.button.removeAttribute( 'disabled' );
	}

	// add to global namespace
	window.ProgressButton = ProgressButton;

})( window );

	[].slice.call( document.querySelectorAll( 'button.progress-button' ) ).forEach( function( bttn ) {
		new ProgressButton( bttn, {
			callback : function( instance ) {
				var progress = 0,
					interval = setInterval( function() {
						progress = Math.min( progress + Math.random() * 0.1, 1 );
						instance._setProgress( progress );

						if( progress === 1 ) {
							instance._stop(1);
							clearInterval( interval );
						}
					}, 200 );
			}
		} );
	} );

	

// Particle BG

var particles= document.getElementById("particles");

function main(){
    var np = document.documentElement.clientWidth / 27;
    particles.innerHTML = "";
    for (var i = 0; i < np; i++) {
        var w = document.documentElement.clientWidth;
        var h = document.documentElement.clientHeight;
        var rndw = Math.floor(Math.random() * w ) + 1;
        var rndh = Math.floor(Math.random() * h ) + 1;
        var widthpt = Math.floor(Math.random() * 8) + 3;
        var opty = Math.floor(Math.random() * 5) + 2;
        var anima = Math.floor(Math.random() * 12) + 8;

        var div = document.createElement("div");
        div.classList.add("particle");
        div.style.marginLeft = rndw+"px";
        div.style.marginTop = rndh+"px";
        div.style.width = widthpt+"px";
        div.style.height = widthpt+"px";
        div.style.background = "white";
        div.style.opacity = opty;
        div.style.animation = "move "+anima+"s ease-in infinite ";
        particles.appendChild(div);
    }
}
window.addEventListener("resize", main);
window.addEventListener("load", main);




// Line Maker
;(function(window) {

	'use strict';

	// Helper vars and functions.
	function extend( a, b ) {
		for( var key in b ) { 
			if( b.hasOwnProperty( key ) ) {
				a[key] = b[key];
			}
		}
		return a;
	}

	/** Line obj.  */
	function Line(options) {
		this.options = extend({}, this.options);
		extend(this.options, options);
		this._init();
	}

	Line.prototype.options = {
		// top, left, width, height: numerical for pixels or string for % and viewport units. Examples: 2 || '20%' || '50vw'.
		// color: the (bg)color of the line.
		// hidden: defines if the line is rendered initially or hidden by default.
		// animation: animation properties for the line
		// 		duration: animation speed.
		// 		easing: animation easing (animejs easing. To see all possible values console animejs.easings).
		// 		delay: animation delay.
		// 		direction: line animation direction. Possible values: TopBottom || BottomTop || LeftRight || RightLeft || CenterV || CenterH.
		width: 1,
		height: '100%',
		left: '50%',
		top: '0%',
		color: '#000',
		hidden: false,
		animation: {
			duration: 500,
			easing: 'linear',
			delay: 0,
			direction: 'TopBottom'
		}
	};

	/** Set style. */
	Line.prototype._init = function() {
		this.el = document.createElement('div');
		this.el.className = 'decoline';
		var opts = this.options;
		this.el.style.width = typeof opts.width === 'number' ? opts.width + 'px' : opts.width;
		this.el.style.height = typeof opts.height === 'number' ? opts.height + 'px' : opts.height;
		this.el.style.left = typeof opts.left === 'number' ? opts.left + 'px' : opts.left;
		this.el.style.top = typeof opts.top === 'number' ? opts.top + 'px' : opts.top;
		this.el.style.background = opts.color || opts.color;
		this.el.style.opacity = opts.hidden ? 0 : 1;
		this._setOrigin();
		this.rendered = !opts.hidden;
	};

	/** Transform origin is set according to the animation direction. */
	Line.prototype._setOrigin = function() {
		var opts = this.options, tOrigin = '50% 50%';

		if( opts.animation.direction === 'TopBottom' ) {
			tOrigin = '50% 0%';
		}
		else if( opts.animation.direction === 'BottomTop' ) {
			tOrigin = '50% 100%';
		}
		else if( opts.animation.direction === 'LeftRight' ) {
			tOrigin = '0% 50%';
		}
		else if( opts.animation.direction === 'RightLeft' ) {
			tOrigin = '100% 50%';
		}
		
		this.el.style.WebkitTransformOrigin = this.el.style.transformOrigin = tOrigin;
	};

	/** Animates the line. */
	Line.prototype.animate = function(settings) {
		if( this.isAnimating ) {
			return false;
		}
		this.isAnimating = true;

		var animeProps = {
			targets: this.el,
			duration: settings && settings.duration != undefined ? settings.duration : this.options.animation.duration,
			easing: settings && settings.easing != undefined ? settings.easing : this.options.animation.easing,
			delay: settings && settings.delay != undefined ? settings.delay : this.options.animation.delay
		};

		if( settings && settings.direction ) {
			this.options.animation.direction = settings.direction;
		}

		// Sets origin again. Settings might contain a different animation direction?
		this._setOrigin();

		if( this.options.animation.direction === 'TopBottom' || this.options.animation.direction === 'BottomTop' || this.options.animation.direction === 'CenterV' ) {
			animeProps.scaleY = this.rendered ? [1, 0] : [0, 1];
		}
		else {
			animeProps.scaleX = this.rendered ? [1, 0] : [0, 1];
		}

		if( !this.rendered ) {
			this.el.style.opacity = 1;
		}

		var self = this;
		animeProps.complete = function() {
			self.rendered = !self.rendered;
			if( settings && settings.complete ) {
				settings.complete();
			}
			self.isAnimating = false;
		}

		anime(animeProps);
	};

	/** Show the line. */
	Line.prototype.show = function() {
		this.el.style.opacity = 1;
		this.el.style.WebkitTransform = this.el.style.transform = 'scale3d(1,1,1)';
		this.rendered = true;
	};

	/** Hide the line. */
	Line.prototype.hide = function() {
		this.el.style.opacity = 0;
		this.rendered = false;
	};

	/** LineMaker obj. */
	function LineMaker(options) {
		this.options = extend({}, this.options);
		extend(this.options, options);
		this._init();
	}

	/** LineMaker options. */
	LineMaker.prototype.options = {
		// Where to insert the lines container.
		// element: the DOM element or a string to specify the selector, e.g. '#id' or '.classname'.
		// position: Whether to prepend or append to the parent.element
		parent: {element: document.body, position: 'prepend'},
		// position: if fixed the lines container will have fixed position.
		position: 'absolute',
		// The lines settings.
		lines: []
	};

	/** Create the lines and its structure. */
	LineMaker.prototype._init = function() {
		this.lines = [];

		this.decolines = document.createElement('div');
		this.decolines.className = 'decolines';
		if( this.options.position === 'fixed' ) {
			this.decolines.className += ' decolines--fixed';
		}

		for(var i = 0, len = this.options.lines.length; i < len; ++i) {
			var lineconfig = this.options.lines[i],
				line = new Line(lineconfig);

			this.decolines.appendChild(line.el);
			this.lines.push(line);
		}

		var p = this.options.parent, 
			pEl = typeof p.element === 'string' ? document.querySelector(p.element) : p.element;

		if( p.position === 'prepend' ) {
			pEl.insertBefore(this.decolines, pEl.firstChild);
		}
		else {
			pEl.appendChild(this.decolines);
		}
	};

	/** Shows/Hides one line with an animation. */
	LineMaker.prototype._animateLine = function(lineIdx, dir, settings) {
		var line = this.lines[lineIdx];
		if( line && dir === 'in' && !line.rendered || dir === 'out' && line.rendered ) {
			line.animate(settings);
		}
	};

	/** Shows/Hides all lines with an animation. */
	LineMaker.prototype._animateLines = function(dir, callback) {
		var completed = 0, totalLines = this.lines.length;

		if( totalLines === 0 ) {
			callback();
			return;
		}

		var checkCompleted = function() {
			completed++;
			if( completed === totalLines && typeof callback === 'function' ) {
				callback();
			}
		};

		for(var i = 0; i < totalLines; ++i) {
			var line = this.lines[i];
			if( dir === 'in' && !line.rendered || dir === 'out' && line.rendered ) {
				line.animate({
					complete: function() {
						checkCompleted();
					}
				});
			}
			else {
				checkCompleted();
			}
		}
	};

	/** Shows/Hides one line. */
	LineMaker.prototype._toggleLine = function(lineIdx, action) {
		var line = this.lines[lineIdx];
		if( !line ) { return; }
		
		if( action === 'show' && !line.rendered ) {
			line.show();
		}
		else if( action === 'hide' && line.rendered ) {
			line.hide();
		}
	};

	/** Shows/Hides all lines. */
	LineMaker.prototype._toggleLines = function(action) {
		for(var i = 0, len = this.lines.length; i < len; ++i) {
			this._toggleLine(i, action);
		}
	};

	/**
	 * Shows one line with an animation.
	 * lineIndex: index/position of the line in the LineMaker.options.lines array.
	 * animationSettings is optional: if not passed, the animation settings defined in LineMaker.options.lines for each line will be used.
	 */
	LineMaker.prototype.animateLineIn = function(lineIdx, settings) {
		this._animateLine(lineIdx, 'in', settings);
	};

	/**
	 * Hides one line with an animation.
	 * lineIndex: index/position of the line in the LineMaker.options.lines array.
	 * animationSettings is optional: if not passed, the animation settings defined in LineMaker.options.lines for each line will be used.
	 */
	LineMaker.prototype.animateLineOut = function(lineIdx, settings) {
		this._animateLine(lineIdx, 'out', settings);
	};

	/**
	 * Shows all lines with an animation.
	 */
	LineMaker.prototype.animateLinesIn = function(callback) {
		this._animateLines('in', callback);
	};

	/**
	 * Hides all lines with an animation.
	 */
	LineMaker.prototype.animateLinesOut = function(callback) {
		this._animateLines('out', callback);
	};

	/**
	 * Shows one line.
	 * lineIndex: index/position of the line in the LineMaker.options.lines array.
	 */
	LineMaker.prototype.showLine = function(lineIdx) {
		this._toggleLine(lineIdx, 'show');
	};
	
	/**
	 * Hides one line.
	 * lineIndex: index/position of the line in the LineMaker.options.lines array.
	 */
	LineMaker.prototype.hideLine = function(lineIdx) {
		this._toggleLine(lineIdx, 'hide');
	};

	/** Shows all lines. */
	LineMaker.prototype.showLines = function() {
		this._toggleLines('show');
	};

	/** Hides all lines. */
	LineMaker.prototype.hideLines = function() {
		this._toggleLines('hide');
	};

	/**
	 * Removes a line.
	 * lineIndex: index/position of the line in the LineMaker.options.lines array.
	 */
	LineMaker.prototype.removeLine = function(lineIdx) {
		var line = this.lines[lineIdx];
		if( line ) {
			this.lines.splice(lineIdx, 1);
			this.decolines.removeChild(this.decolines.children[lineIdx]);
		}
	};

	/** Removes all lines. */
	LineMaker.prototype.removeLines = function() {
		this.lines = [];
		this.decolines.innerHTML = '';
	};

	/**
	 * Creates a line.
	 * settings is optional: same settings passed in LineMaker.options.lines for one line.
	 */
	LineMaker.prototype.createLine = function(settings) {
		var line = new Line(settings);
		this.decolines.appendChild(line.el);
		this.lines.push(line);
	};

	/** Returns the total number of lines. */
	LineMaker.prototype.getTotalLines = function() {
		return this.lines.length;
	}

	window.LineMaker = LineMaker;

})(window);

(function() {
    var lineMaker = new LineMaker({
        position: 'absolute',
        lines: [
            {top: '15%', left: 0, width: '100%', height: 2, color: '#ddd', hidden: true},
            {top: '85%', left: 0, width: '100%', height: 2, color: '#ddd', hidden: true},
            {top: 0, left: '90%', width: 2, height: '100%', color: '#ddd', hidden: true},
            {top: 0, left: '10%', width: 2, height: '100%', color: '#ddd', hidden: true},
            {top: '15%', left: 0, width: '100%', height: 2, color: '#000', hidden: true, animation: { duration: 1000, easing: 'easeInOutExpo', delay: 0, direction: 'LeftRight' }},
            {top: '85%', left: 0, width: '100%', height: 2, color: '#000', hidden: true, animation: { duration: 1000, easing: 'easeInOutExpo', delay: 100, direction: 'RightLeft' }},
            {top: 0, left: '90%', width: 2, height: '100%', color: '#000', hidden: true, animation: { duration: 1000, easing: 'easeInOutExpo', delay: 200, direction: 'BottomTop' }},
            {top: 0, left: '10%', width: 2, height: '100%', color: '#000', hidden: true, animation: { duration: 1000, easing: 'easeInOutExpo', delay: 300, direction: 'TopBottom' }}
        ]
    });
    
    setTimeout(function() {
        lineMaker.animateLineIn(4, {
            complete: function() { lineMaker.showLine(0); }
        });
        lineMaker.animateLineIn(5, {
            complete: function() { lineMaker.showLine(1); }
        });
        lineMaker.animateLineIn(6, {
            complete: function() { lineMaker.showLine(2); }
        });
        lineMaker.animateLineIn(7, {
            complete: function() { lineMaker.showLine(3); }
        });
    }, 100);

    setTimeout(function() {
        lineMaker.animateLineOut(4);
        lineMaker.animateLineOut(5);
        lineMaker.animateLineOut(6);
        lineMaker.animateLineOut(7);
    }, 2000);

    setTimeout(function() {
        lineMaker.createLine({ top: '50vh', left: '21vw', width: '60vw', height: 16, color: '#e91e1e', hidden: true, animation: { duration: 1000, easing: 'easeInOutExpo', delay: 300, direction: 'LeftRight' }});
        
        lineMaker.animateLineIn(8);
    }, 2000);
})();

