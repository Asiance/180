/**
 * 180° Core module
 * 
 * This is a part of the 180° Framework
 * 
 * @author  Karine Do, Laurent Le Graverend
 * @license Copyright (c) 2011 Asiance (http://www.asiance.com), Licensed under the MIT License.
 * @updated 2011-12-28
 * @link    https://github.com/Asiance/180/
 * @version 2.0
 */
(function($){
	// Cache variables
	var $window = $(window),
		$body = $('body'),
		$menu = $('#menu'),
		$menunavlinks = $menu.find('a').not('.customlink, .slidepanel'),
		$header = $('body>header').first(),
		$container = $('#container'),
		$slides = $('.slide');

	var myScroll,
		snaptoPage = 0;

	var timer_trackPage;

	// Detect browser
	if ($.browser.webkit) {
		scrollElement = 'body';
	} else {
		scrollElement = 'html';
	}
	var currentBrowser = navigator.userAgent.toLowerCase();
	var mobiledevices = 'iphone|ipod|android|blackberry|mini|windows\sce|palm';
	var tabletdevices = 'ipad|playbook|hp-tablet';
	
	// Has it been resized ? (for IE7)
	var resized = 0;

	// To determine container width
	var total_slides = $slides.length;
	
	// Some actions
	var methods = {
		// Start
		init : function(options) {
			// Framework options defaults
			siteOptions = $.extend({
				showHeader: true,
				headerPosition: 'top',
				menuPosition: 'top',
				menuHeight: 50,
				menuAlign: 'center',
				menuStyle: 'auto',
				menuSpacing: 10,
				sidePadding: 30,
				verticalScrolling: true,
				menuAnimation: true,
				mouseScroll: false,
				mobiles: '',
				tablets: '',
				tracker: function() {
					_gaq.push(['_trackPageview', '/' + activePage]);
				},
				utilities: true,
				before180: $.noop,
				after180: $.noop,
				beforeslide: $.noop,
				afterslide: $.noop,
				portrait: $.noop,
				landscape: $.noop
			}, options);
			
			// Custom init function
			if ($.isFunction(siteOptions.before180)) {
				siteOptions.before180.call();
			}
			
			// Add devices
			if (siteOptions.mobiles.length) {
				mobiledevices += '|' + siteOptions.mobiles;
			}
			if (siteOptions.tablets.length) {
				tabletdevices += '|' + siteOptions.tablets;
			}
			
			// Test devices
			var mobiles = new RegExp(mobiledevices, 'i');
			var tablets = new RegExp(tabletdevices, 'i');
			isMobile = (mobiles.test(currentBrowser));
			isTablet = (tablets.test(currentBrowser));

			// Avoid overlap if menu is set to fill and header is in the same position
			if (siteOptions.showHeader === true && siteOptions.menuStyle === 'fill' && siteOptions.headerPosition === siteOptions.menuPosition) {
				if (siteOptions.headerPosition === 'top') {
					siteOptions.menuPosition = 'bottom';
				} else if (siteOptions.headerPosition === 'bottom') {
					siteOptions.menuPosition = 'top';
				}
			}
			
			// Framework features for all
			$window.bind('load._180', function() {
				// Auto-load utilities?
				if (siteOptions.utilities === true) {
					utilities.caption.apply();
					utilities.hoverEffect.apply();
					utilities.slideshow.apply();
					utilities.collapsible.apply();
					utilities.lightbox.apply();
					utilities.scrollarea.apply();
					// sliding panel
					if (!isMobile && $('#slidingpanel').length) {
						$('#slidingpanel')._180_slidingpanel();
					}
				}
				// If it can read this, JS is enabled
				$('html').removeClass('no-js').addClass('js');
				if ($.isFunction(siteOptions.after180)) {
					siteOptions.after180.call();
				}
			});
			
			// First reposition
			// If hash, redefine the active page for tracking and reposition if needed
			// The page's offset is not defined yet so we need to place the page on the good slide
			if (document.location.hash != '') {
				activePage = $menu.find('a').filter('[href="' + document.location.hash + '"]').addClass('active').data('title');
				$(scrollElement).animate({
					scrollLeft: window.innerWidth*($('div.slide').index($(document.location.hash)))
					}, 0
				);
			} else {
				// Obviously by default the first slide is the one active
				activePage = $menunavlinks.filter(':first').addClass('active').data('title');
			}
			
			siteOptions.tracker.apply();
			
			// For mobile and tablet
			if (isMobile || isTablet) {
				if (isMobile) {
					methods.mobileStyle.apply();
				}
				if (isTablet) {
					$body.addClass('tablet');
					methods.style.apply();
				} else {
					$body.addClass('mobile');
				}
				
				// Orientation ?
				methods.detectOrientation.apply();
				
				// To use iScroll
				$container.wrap('<div id="scroller" />');
				
				// Framework options
				/*if (siteOptions.verticalScrolling === true) {
					$slides.not('.noscroll').wrapInner('<div class="scrollable">').wrapInner('<div class="verticalscroller">');
				}*/
				
				// Actions on load
				$window.bind('load._180', function() {
					if (isMobile) {
						methods.mobileSizes.apply();
					} else {
						methods.sizes.apply();
					}
					methods.mobileBase.apply();
					/*if (siteOptions.verticalScrolling === true) {
						methods.mobileVertScroll.apply();
					}*/
					if (siteOptions.verticalScrolling === true) {
						//$slides.css('overflow','auto');
						$slides.not('.noscroll').wrapInner('<div class="scroll">');
						methods.prettyScroll.apply();
					}
		
				});
				
				// Actions on resize or orientation change
				$window.bind('resize._180', function() {
					methods.detectOrientation.apply();
					if (isMobile) {
						methods.mobileSizes.apply();
					} else {
						methods.sizes.apply();
					}
					myScroll.refresh();
					// Reposition iScroll
					if (snaptoPage != 0) {
						myScroll.scrollToPage(snaptoPage, 0, 200);
					}
				});
				
				$body.bind('touchmove', function(event) {
					event.preventDefault();
				});
			}
			
			// For browsers
			else {
				// Apply style and sizes
				methods.style.apply();
				methods.sizes.apply();
				
				// Menu and internal links behaviour
				methods.menuLinks.apply();
				
				// Framework options
				$window.bind('load._180', function() {
					if (siteOptions.verticalScrolling === true) {
						//$slides.css('overflow','auto');
						$slides.not('.noscroll').wrapInner('<div class="scroll">');
						methods.prettyScroll.apply();
					} else {
						if (siteOptions.mouseScroll === true) {
							$(scrollElement)
								.bind('mousewheel._180', function(event, delta) {
									if (delta > 0) {
										event.preventDefault();
										$('.active').prev().not('.customlink,.slidepanel').click();
									} else {
										event.preventDefault();
										$('.active').next().not('.customlink,.slidepanel').click();
									}
										return false;
								});
						}
					}
				});
				
				// Actions on window resize
				$window.bind('resize._180', function() {
					methods.sizes.apply();
					methods.reposition.apply();
				});
				
				// Prevent Firefox from refreshing page on hashchange
				$window.bind('hashchange._180', function(event) {
					event.preventDefault();
					return false;
				});
				
				// Keyboard nav
				$(document).on('keydown._180', methods.keyboardNavigation);
			}
		},
		// Apply style options to browser
		style : function() {
			$slides
				.css('padding-' + siteOptions.menuPosition, '+=' + siteOptions.menuHeight + 'px')
				.css({'padding-left': siteOptions.sidePadding + 'px', 'padding-right': siteOptions.sidePadding + 'px', 'padding-top': '+=' + siteOptions.sidePadding + 'px', 'padding-bottom': '+=' + siteOptions.sidePadding + 'px'});
		
			$menu
				.css(siteOptions.menuPosition, '0px')
				.css('height', siteOptions.menuHeight + 'px')
				.find('a').css('line-height', siteOptions.menuHeight + 'px');
			
			// menu align
			if (siteOptions.menuAlign === 'center') {
				$menu.css('text-align','center');
			} else if (siteOptions.menuAlign === 'left') {
				$menu.css('text-align','left');
				if ($header.length && siteOptions.showHeader === true) {
					$header.css('right', '0px');
				}
			} else if (siteOptions.menuAlign === 'right') {
				$menu.css('text-align','right');
			}
			
			// menu style
			if (siteOptions.menuStyle === 'fill') {
				$menu.find('a').css('width',(100/$menu.find('a').length) + '%');
			} else if (siteOptions.menuStyle === 'auto') {
				$menu.find('a').css('padding-left', siteOptions.menuSpacing + 'px').css('padding-right', siteOptions.menuSpacing + 'px');
			}
			
			// header
			if ($header.length && siteOptions.showHeader === false) {
				$header.hide();
			} else if ($header.length && siteOptions.showHeader === true) {
				// If header and menu are on oposite sides
				if (siteOptions.headerPosition != siteOptions.menuPosition) {
					$slides
						.css('padding-' + siteOptions.headerPosition, '+=' + siteOptions.menuHeight + 'px');
				}
			
				$header
					.css(siteOptions.headerPosition, '0px')
					.css('height', siteOptions.menuHeight + 'px')
					.children()
					.css('line-height', siteOptions.menuHeight + 'px')
					.bind('click._180', function() {
						$menunavlinks.filter(':first').click();
					});
			}
		},
		// Apply style options to mobile
		mobileStyle : function() {
			$slides
				.css({'padding-left': siteOptions.sidePadding/2 + 'px', 'padding-right': siteOptions.sidePadding/2 + 'px', 'padding-top': '+=' + siteOptions.sidePadding + 'px', 'padding-bottom': '+=' + siteOptions.sidePadding/2 + 'px'});
			// TODO WTF Karine ? if true ?
			if ($header.length && (siteOptions.showHeader === true || siteOptions.showHeader === false)) {		
				$header
					.css('top', '0px')
					.css('height', siteOptions.menuHeight/2 + 'px')
					.children()
					.css('line-height', siteOptions.menuHeight/2 + 'px')
					.bind('click._180', function() {
						$menunavlinks.filter(':first').click();
					});
			}
		},
		// Flexible sizes
		sizes : function() {
			var windowH = $window.height(),
				windowW = $window.width();
			
			// Dertermine sizes of slides with or without padding
			if (siteOptions.showHeader === false || (siteOptions.showHeader === true && siteOptions.headerPosition === siteOptions.menuPosition)) {
				paddingTB = windowH - siteOptions.menuHeight - siteOptions.sidePadding*2;
				nopaddingTB = windowH - siteOptions.menuHeight;
			} else {
				paddingTB = windowH - siteOptions.menuHeight*2 - siteOptions.sidePadding*2;
				nopaddingTB = windowH - siteOptions.menuHeight*2;
			}
			
			// Set overall container size
			$container.width((windowW * total_slides)).height(windowH);
			
			// IE7 fix, remove scrollbar height on first loading
			if (($.browser.msie && $.browser.version === 7) && (resized === 0)) {
				$container.height(windowH-18);
				$slides.not('.nopadding')
					.width((windowW - siteOptions.sidePadding*2)).height((paddingTB - 18));
				if (siteOptions.headerPosition === siteOptions.menuPosition) {
					$('.nopadding')
						.attr('style', 'height:' + (nopaddingTB-18) + 'px; width:' + windowW + 'px; padding-' + siteOptions.menuPosition + ':' + siteOptions.menuHeight + 'px !important');
				} else {
					$('.nopadding')
						.attr('style', 'height:' + (nopaddingTB-18) + 'px; width:' + windowW + 'px; padding-' + siteOptions.menuPosition + ':' + siteOptions.menuHeight + 'px !important; padding-' + siteOptions.headerPosition + ':' + siteOptions.menuHeight + 'px !important;');
				}
				resized = 1;
			} else {
			// Good people not using IE7
				$slides.not('.nopadding')
					.width((windowW - siteOptions.sidePadding*2)).height((paddingTB));
				if (siteOptions.showHeader === true && siteOptions.headerPosition === siteOptions.menuPosition) {
					$('.nopadding')
						.attr('style', 'height:' + nopaddingTB + 'px; width:' + windowW + 'px; padding-' + siteOptions.menuPosition + ':' + siteOptions.menuHeight + 'px !important');
				} else {
					$('.nopadding')
						.attr('style', 'height:' + nopaddingTB + 'px; width:' + windowW + 'px; padding-' + siteOptions.menuPosition + ':' + siteOptions.menuHeight + 'px !important; padding-' + siteOptions.headerPosition + ':' + siteOptions.menuHeight + 'px !important;');
				}
				// For tablets
				if (isTablet) {
					$slides.not('.nopadding').find('.verticalscroller').height(paddingTB);
					$('.nopadding').find('.verticalscroller').height(nopaddingTB);			
				}
			}
			// Recalculate magic menu size
			if (siteOptions.menuAnimation === true) {
				methods.menuAnimation.apply();
			}
		},
		// Flexible sizes for mobile
		mobileSizes : function() {
			var windowH = $window.height(),
				windowW = $window.width();
			
			// Dertermine sizes of slides with or without padding
			if (siteOptions.showHeader === false || (siteOptions.showHeader === true && siteOptions.headerPosition === siteOptions.menuPosition)) {
				paddingTB = windowH - siteOptions.menuHeight - siteOptions.sidePadding*2;
				nopaddingTB = windowH - siteOptions.menuHeight;
			} else {
				paddingTB = windowH - siteOptions.menuHeight*2 - siteOptions.sidePadding*2;
				nopaddingTB = windowH - siteOptions.menuHeight*2;
			}
			
			// Set overall container size
			$container.width((windowW * total_slides)).height(windowH);
			
			// For mobiles
			$slides.not('.nopadding')
				.width((windowW - siteOptions.sidePadding)).height(windowH - siteOptions.sidePadding*1.5 + 70);
			$('.nopadding')
				.attr('style', 'height:' + (windowH - siteOptions.menuHeight + 70) + 'px; width:' + windowW + 'px; padding-top:' + siteOptions.menuHeight + 'px !important;');
			$('.verticalscroller').height((windowH - siteOptions.menuHeight + 70));
			
			setTimeout(function() {
				window.scrollTo(0,1);
			}, 100);
			
		},
		// Reposition if hash is used in URL (Browsers only)
		reposition : function() {
			if (document.location.hash != '') {
				methods.scrollSlide(document.location.hash);
				$('.active').removeClass('active');
				$menunavlinks.filter('[href=' + document.location.hash + ']').addClass('active');
			}
		},
		// Animate menu and internal links + track page views
		menuLinks : function() {
			$menunavlinks.bind('click._180', function(event){				
				event.preventDefault();
				var $this = $(this);
				// Scroll and make active
				methods.scrollSlide($this.attr('href'));
				$('.active').removeClass('active');
				$this.addClass('active');
				activePage = $(this).data('title');
				// Track pageview
				clearTimeout(timer_trackPage);
				timer_trackPage = setTimeout(siteOptions.tracker, 2500);
				// Animate menu if needed
				if (siteOptions.menuAnimation === true) {
					var $magicLine = $('#magic');
					leftPos = $this.position().left;
					newWidth = $this.outerWidth(true);
					$magicLine
						.data('origLeft', leftPos)
						.data('origWidth', newWidth);
					$magicLine.stop().animate({
						left: leftPos,
						width: newWidth
					});
				}
				return false;
			});
			// Other internal links
			$('a:not(#menu a, a[href="#"])').filter('[href^="#"]').bind('click._180', function(event) {
				var anchor = $(this).attr('href');
				if ($menu.find('a[href="'+ anchor +'"]').length) {
					event.preventDefault();
					$menu.find('a[href="'+ anchor +'"]').click();
				}
			});
			$('a[href="#"]').bind('click._180', function(event) {
				event.preventDefault();
			});
		},
		// Animate the menu
		menuAnimation : function() {
			var $el, leftPos, newWidth;
			if (!$('#magic').length) {
				$menu.append('<span id="magic"></span>');
			}
			var $magicLine = $('#magic');
			
			$window.bind('load._180', function() {
				$magicLine
					.width($('.active').outerWidth(true))
					.height(siteOptions.menuHeight)
					.css('left', $('.active').position().left)
					.data('origLeft', $magicLine.position().left)
					.data('origWidth', $magicLine.width());
			});
			
			$magicLine
				.css('left', $('.active').position().left)
				.data('origLeft', $magicLine.position().left)
				.data('origWidth', $magicLine.width());
			
			$menunavlinks.hover(function() {
				$el = $(this);
				leftPos = $el.position().left;
				newWidth = $el.outerWidth(true);
				$magicLine.stop().animate({
					left: leftPos,
					width: newWidth
				});
			}, function() {
				$magicLine.stop().animate({
					left: $magicLine.data('origLeft'),
					width: $magicLine.data('origWidth')
				});
			});
		},
		// Use pretty scrollbars for non-webkit browsers
		prettyScroll : function() {
			$('.scroll').each(function(){
				$(this).jScrollPane({
					showArrows: false
				});
				var api = $(this).data('jsp');
				var throttleTimeout;
				$window.bind('resize._180', function() {
					if ($.browser.msie) {
						if (!throttleTimeout) {
							throttleTimeout = setTimeout(function() {
								api.reinitialise();
								throttleTimeout = null;
							}, 50);
						}
					} else {
						api.reinitialise();
					}
				});
			});
		},
		// Detect devices orientation
		detectOrientation : function() {
			if (window.innerHeight > window.innerWidth) {
				$body.addClass('portrait').removeClass('landscape');
				if ($.isFunction(siteOptions.portrait)) {
					siteOptions.portrait.call();
				}
			} else if (window.innerHeight< window.innerWidth) {
				$body.removeClass('portrait').addClass('landscape');
				if ($.isFunction(siteOptions.landscape)) {
					siteOptions.landscape.call();
				}
			}
		},
		// Navigation by LR arrows
		keyboardNavigation : function(event) {
			if (event.which === 37) {
				event.preventDefault();
				$('.active').prev().not('.customlink,.slidepanel').click();
			} else if (event.which === 39) {
				event.preventDefault();
				$('.active').next().not('.customlink,.slidepanel').click();
			}
		},
		// Animate scrolling
		scrollSlide : function(page) {
			// do something before?
			var self = this;
			if ($.isFunction(siteOptions.beforeslide)) {
				siteOptions.beforeslide.call(this, page, self.getScrollDirection(page));
			}

			$(scrollElement).stop(true, true).animate({scrollLeft: $(page).offset().left}, 1000, function() {
				document.location.hash = page;
				// do something after?
				if ($.isFunction(siteOptions.afterslide)) {
					siteOptions.afterslide.call(this, page, self.getScrollDirection(page));
				}
			});
		},
		// Return the direction where the slides scroll to
		getScrollDirection : function(page) {
			var self = this;
			var j = self.getSlideNumber(page) - self.getSlideNumber(document.location.hash);
			if (j == 0) {
				return direction = 'none';
			} else if (j > 0) {
				return direction = 'right';
			} else {
				return direction = 'left';
			}
		},
		// Return the number of the slide
		getSlideNumber : function(page) {
			return $('div.slide').index($(page)) + 1;
		},
		mobileBase : function() {
			// init iScroll
			myScroll = new iScroll('scroller', {
				hScrollbar: false,
				vScrollbar: false,
				vScroll: false,
				snap: '.slide',
				snapThreshold: 80,
				momentum: false,
				bounce: false,
				lockDirection: true,
				useTransition: true,
				onScrollEnd: function() {
					$('.active').removeClass('active');
					activePage = $('#menu a:nth-child(' + (this.currPageX + 1) + ')').data('title');
					$('#menu a:nth-child(' + (this.currPageX + 1) + ')').addClass('active');
					snaptoPage = (this.currPageX);
					// Track pageview
					clearTimeout(timer_trackPage);
					timer_trackPage = setTimeout(siteOptions.tracker, 2000);
					if (siteOptions.menuAnimation === true) {
						var $magicLine = $('#magic');
						$magic = $('#menu a:nth-child(' + (this.currPageX + 1) + ')');
						leftPos = $magic.position().left;
						newWidth = $magic.outerWidth(true);
						$magicLine
							.data('origLeft', leftPos)
							.data('origWidth', newWidth);
						$magicLine.stop().animate({
							left: leftPos,
							width: newWidth
						});
					}
				}
			});
			$menunavlinks.bind('click._180', function(event){				
				event.preventDefault();
				var pagenumber = $(this).index();
				myScroll.scrollToPage(pagenumber, 0, 1000);
			});
			// TODO internal links iPad
		},
		mobileVertScroll : function() {
			var myScrolls = [];
			var wrappers = $('.verticalscroller');
			
			for (var i=0; i<wrappers.length; i++) {
				myScrolls[myScrolls.length] = new iScroll(wrappers[i], {
					checkDOMChanges: true,
					hScrollbar: false,
					vScrollbar: true,
					hScroll: false,
					bounce: false,
					lockDirection: true,
					hideScrollbar: false
				});
			}
		}
	};
	
	// Utilities
	var utilities = {
		collapsible : function() {
			$('.collapsible')._180_collapsible();
		},

		hoverEffect : function() {
			$('.hovereffect').each(function() {
				$(this)._180_hover();
			});
		},

		lightbox : function() {
			$('.lightbox')._180_lightbox();
		},

		slideshow : function() {
			$('.slider').each(function() {
				$(this)._180_slideshow();
			});
		},

		caption : function() {
			$('.caption').each(function() {
				$(this)._180_caption();
			});
		},

		scrollarea : function() {
			$('.scrollarea').each(function() {
				$(this)._180_scrollarea();
			});
		}
	};
	// Make it work
	// No chainability needed
	$.fn._180 = function(method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || ! method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error( 'Method ' +  method + ' does not exist' );
		}
	};
})(jQuery);