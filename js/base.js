/*
 *
 * 180° framework
 *
 */
(function($){
	// Cache variables
	var $window = $(window),
		$body = $('body'),
		$menu = $('#menu'),
		$menunavlinks = $menu.find('a').not('.customlink, .slidepanel'),
		$header,
		$footer,
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

	// Is there a header ?
	if ($('header').length) {
		$header = $('header');
	}
	// Is there a footer ?
	if ($('#slidingpanel').length) {
		$slidingpanel = $('#slidingpanel');
	}
	
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
				slidingpanelHeight: 400,
				sidePadding: 30,
				verticalScrolling: true,
				menuAnimation: true,
				mouseScroll: false,
				mobiles: '',
				tablets: '',
				tracker: function() {
					_gaq.push(['_trackPageview', '/' + activePage]);
				},
				before180: $.noop,
				after180: $.noop,
				beforeslide: $.noop,
				afterslide: $.noop,
				portrait: $.noop,
				landscape: $.noop,
				textPrev: "Prev",
				textNext: "Next"
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
				utilities.caption.apply();
				utilities.hoverEffect.apply();
				utilities.slideshow.apply();
				utilities.collapsibleBlocks.apply();
				utilities.lightbox.apply();
				utilities.scrollarea.apply();
				// If it can read this, JS is enabled
				$('html').removeClass('no-js').addClass('js');
				if ($.isFunction(siteOptions.after180)) {
					siteOptions.after180.call();
				}
			});
			
			// Obviously by default the first slide is the one active
			$menunavlinks.filter(':first').addClass('active');
			
			// If hash, redefine the active page for tracking and reposition if needed
			if (document.location.hash != '') {
				activePage = $menu.find('a').filter('[href="' + document.location.hash + '"]').data('title');
			} else {
				activePage = $menunavlinks.filter(':first').data('title');
			}
			siteOptions.tracker.apply();
			methods.reposition.apply();
			
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
				if ($('header').length && siteOptions.showHeader === true) {
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
			if ($('header').length && siteOptions.showHeader === false) {
				$header.hide();
			} else if ($('header').length && siteOptions.showHeader === true) {
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
			
			// footer
			if ($('#slidingpanel').length) {
				$slidingpanel
					.css(siteOptions.menuPosition, 0 + siteOptions.menuHeight)
					.css({'height' : (siteOptions.slidingpanelHeight) + 'px'}).hide();
				$('.slidepanel').bind('click._180', function() {
					$slidingpanel.stop().animate({'height':'toggle'});
				});
			}
		},
		// Apply style options to mobile
		mobileStyle : function() {
			$slides
				.css({'padding-left': siteOptions.sidePadding/2 + 'px', 'padding-right': siteOptions.sidePadding/2 + 'px', 'padding-top': '+=' + siteOptions.sidePadding + 'px', 'padding-bottom': '+=' + siteOptions.sidePadding/2 + 'px'});		
			if ($('header').length && (siteOptions.showHeader === true || siteOptions.showHeader === false)) {		
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
			var string = '';
			$($menunavlinks).each (function (e) {
				string += '#' + $(this).data('title');
			});
			var j = string.indexOf(page) - string.indexOf(document.location.hash)
			if (j == 0) {
				return direction = 'none';
			} else if (j > 0) {
				return direction = 'right';
			} else {
				return direction = 'left';
			}
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
		collapsibleBlocks : function() {
			$('.collapsible')
				.children('div').hide()
				.end()
				.find('h2').css('cursor','pointer');
			
			$('.collapsible').each(function() {
				$(this).find('h2:first').addClass('opened').next().show();
			});
			
			$('.collapsible').find('h2').bind('click._180 touchstart._180', function() {
				if ($(this).next().is(':hidden')) {
					$(this).parent('.collapsible').find('h2').removeClass('opened').next().slideUp();
					$(this).toggleClass('opened').next().slideDown();
				}
				else if ($(this).hasClass('opened') && $(this).next().is(':visible')) {
					$(this).removeClass('opened').next().slideUp();
				}
				return false;
			});
		},
		hoverEffect : function() {
			$('.hovereffect').each(function() {
				$(this).css({'width': $(this).find('img').width(), 'height': $(this).find('img').height()});
				
				$(this).hover(function() {
					$(this).find('.hovertext').stop(true,true).fadeIn('slow');
					if ($(this).find('.caption').length) {
						$(this).find('.caption').stop().hide();
					}
					//$(this).find('img').stop(false,true).animate({'width':$(this).width()*1.2, 'height':$(this).height()*1.2, 'top':'-'+$(this).width()*0.1, 'left':'-'+$(this).height()*0.1}, {duration:200});
				}, function() {
					$(this).find('.hovertext').hide();
					if ($(this).find('.caption').length) {
						$(this).find('.caption').stop().show();
					}
					//$(this).find('img').stop(false,true).animate({'width':$(this).width(), 'height':$(this).height(), 'top':'0', 'left':'0'}, {duration:100});
				});
			});
		},
		lightbox : function() {
			$('.lightbox').bind('click._180 touchstart._180', function() {
			    var lightboxID = $(this).data('lightbox-name');
			    var lightboxWidth = parseInt($(this).data('lightbox-width'));
			    var lightboxMargTop = ($('#' + lightboxID).height()) / 2;
			    var lightboxMargLeft = lightboxWidth/2;
			    
			    $body.append('<div id="overlay" onclick=""></div>');
			    
			    $('#overlay').css({'filter' : 'alpha(opacity=80)', 'width': $container.width()}).stop().fadeIn();
			    
			    $(document).off('keydown._180', methods.keyboardNavigation).on('keydown._180', function(e) {e.preventDefault(); });
			    
			    $('#' + lightboxID)
			    	.insertAfter('#overlay')
			    	.stop().fadeIn()
			    	.css({ 'width': lightboxWidth })
			    	.prepend('<a href="#" class="close"><span><span></a>')
			    	.css({'margin-top' : -lightboxMargTop, 'margin-left' : -lightboxMargLeft});
			    
			    return false;
			});
			
			$('a.close, #overlay').live('click._180 touchstart._180', function() {
			    $('#overlay , .lightbox_content').stop(true, true).fadeOut();
				$('#overlay, .close').remove();
			    $(document).on('keydown._180', methods.keyboardNavigation).off('keydown._180', function(e) {e.preventDefault(); });
			    return false;
			});
		},
		slideshow : function() {
			$('.slider').each(function() {
				var $slider = $(this);
				var slider_width = $slider.data('slider-width');
				var slider_height = $slider.data('slider-height');
				var slider_width_value = parseInt(slider_width);
				var slider_width_unit = slider_width.slice(-1);
				var inner_width = slider_width_value * $slider.find('li').length;
				var move_left = slider_width_value * (-1);
				
				if (slider_width_unit === '%') {
					slider_item = slider_width_value / $slider.find('li').length + slider_width_unit;
				} else {
					slider_item = slider_width_value;
					slider_width_unit = 'px';
				}
				
				$('<div class="buttons"><a href="#" class="prev"><span>'+siteOptions.txtPrev+'</span></a><a href="#" class="next"><span>'+siteOptions.txtNext+'</span></a></div>').insertAfter($slider);
				
				$slider
					.css({'width' : slider_width, 'height' : slider_height})
					.find('li:first').before($slider.find('li:last'))
					.end()
					.find('ul').css({'left' : move_left + slider_width_unit, 'width' : inner_width + slider_width_unit})
					.end()
					.find('li').css({'width' : slider_item});
				
				$slider.next().find('.prev').bind('click._180 touchstart._180', function() {
					var $this = $(this);
					$this.parent('.buttons').prev().find('ul').animate({'left' : '+=' + slider_width}, 600, function(){
						$slider
							.find('li:first').before($slider.find('li:last'))
							.end()
							.find('ul').css({'left' : move_left  + slider_width_unit});
					});
					return false;
				});
				
				$slider.next().find('.next').bind('click._180 touchstart._180', function() {
					var $this = $(this);
					$this.parent('.buttons').prev().find('ul').animate({'left' : '-=' + slider_width}, 600, function() {
						$slider
							.find('li:last').after($slider.find('li:first'))
							.end()
							.find('ul').css({'left' : move_left + slider_width_unit});
					});
					return false;
				});

			});
		},
		caption : function() {
			$('.caption').each(function() {
				var $caption = $(this);
				var image = $caption.prev('img');
				var imagealign = image.css('float');
				$caption.prev('img').andSelf().wrapAll('<div>');
				$caption.parent('div').css({'width': image.outerWidth(true), 'height': image.outerHeight(true), 'float': imagealign, 'position': 'relative', 'overflow': 'hidden'});
			});
		},
		scrollarea : function() {
			$('.scrollarea').each(function() {
				var area_width = $(this).data('area-width');
				var area_height = $(this).data('area-height');
				$(this)
					.css({'width': area_width, 'height': area_height})
					.jScrollPane({showArrows: false});
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