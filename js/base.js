/*
 * 180° framework
 * 
 */
(function( $ ){
	// Cache variables
	var $window = $(window),
		$body = $('body'),
		$menu = $('#menu'),
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
	if ($('footer').length) {
		$footer = $('footer');
	}
	
	// Has it been resized ? (for IE7)
	var resized = 0;

	// To determine container width
	var total_slides = $slides.length;
	
	// Utilities
	var utilities = {
		collapsibleBlocks : function () {
			$('.collapsible').children('div').hide();
			$('.collapsible h2').css('cursor','pointer');
			$('.collapsible').each(function() { $(this).find('h2:first').addClass('opened').next().show(); });
			if (isMobile || isTablet) {
				$('.collapsible h2').bind('touchstart', function(){
					if( $(this).next().is(':hidden') ) {
						$(this).parent('.collapsible').find('h2').removeClass('opened').next().slideUp();
						$(this).toggleClass('opened').next().slideDown();
					}
					else if ( $(this).hasClass('opened') && $(this).next().is(':visible') ) {
						$(this).removeClass('opened').next().slideUp();
					}
					return false;
				});
			} else {
				$('.collapsible h2').bind('click', function(){
					if( $(this).next().is(':hidden') ) {
						$(this).parent('.collapsible').find('h2').removeClass('opened').next().slideUp();
						$(this).toggleClass('opened').next().slideDown();
					}
					else if ( $(this).hasClass('opened') && $(this).next().is(':visible') ) {
						$(this).removeClass('opened').next().slideUp();
					}
					return false;
				});
			}
		},
		hoverEffect : function () {
			$('.hovereffect').each(function () {
				$(this).css({'width': $(this).find('img').width(), 'height': $(this).find('img').height()});
				$(this).hover(function () {
					$(this).find('.hovertext').stop(true,true).fadeIn('slow');
					if ($(this).find('.caption').length) {
						$(this).find('.caption').stop().hide();
					}
					//$(this).find('img').stop(false,true).animate({'width':$(this).width()*1.2, 'height':$(this).height()*1.2, 'top':'-'+$(this).width()*0.1, 'left':'-'+$(this).height()*0.1}, {duration:200});
				}, function () {
					$(this).find('.hovertext').hide();
					if ($(this).find('.caption').length) {
						$(this).find('.caption').stop().show();
					}
					//$(this).find('img').stop(false,true).animate({'width':$(this).width(), 'height':$(this).height(), 'top':'0', 'left':'0'}, {duration:100});
				});
			});
		},
		lightbox : function () {
			$('.lightbox').click(function() {
			    var lightboxID = $(this).attr('data-lightbox-name');
			    var lightboxWidth = parseInt($(this).attr('data-lightbox-width'));
			    
			    $body.append('<div id="overlay" onclick=""></div>');
			    
			    $('#overlay').css({'filter' : 'alpha(opacity=80)', 'width': $container.width()}).stop().fadeIn();
			    
			    $(document).off('keydown', methods.keyboardNavigation);
			    $(document).on('keydown', function(e) {e.preventDefault(); });
			    
			    $('#' + lightboxID).insertAfter('#overlay').stop().fadeIn().css({ 'width': Number( lightboxWidth ) }).prepend('<a href="#" class="close"><span><span></a>');
			    var lightboxMargTop = ($('#' + lightboxID).height()) / 2;
			    var lightboxMargLeft = ($('#' + lightboxID).width()) / 2;
			    
			    $('#' + lightboxID).css({
			        'margin-top' : -lightboxMargTop,
			        'margin-left' : -lightboxMargLeft
			    });
			    
			    return false;
			});
			
			if (isMobile || isTablet) {
				$('a.close, #overlay').live('touchstart', function() {
				    $('#overlay , .lightbox_content').stop(true, true).fadeOut();
				    $('#overlay, .close').remove();
				    $(document).on('keydown', methods.keyboardNavigation);
				    $(document).off('keydown', function(e) {e.preventDefault(); });
				    return false;
				});		
			} else {
				$('a.close, #overlay').live('click', function() {
				    $('#overlay , .lightbox_content').stop(true, true).fadeOut();
					$('#overlay, .close').remove();
				    $(document).on('keydown', methods.keyboardNavigation);
				    $(document).off('keydown', function(e) {e.preventDefault(); });
				    return false;
				});
			}
		},
		slideshow : function () {
			$('.slider').each(function() {
				var $slider = $(this);
				var slider_width = $slider.attr('data-slider-width');
				var slider_height = $slider.attr('data-slider-height');
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
				
				$('<div class="buttons"><a href="#" class="prev"><span>Prev</span></a><a href="#" class="next"><span>Next</span></a></div>').insertAfter($slider);
				$slider.find('li:first').before( $slider.find('li:last'));
				$slider.css({'width' : slider_width, 'height' : slider_height});
				$slider.find('ul').css({'left' : move_left + slider_width_unit, 'width' : inner_width + slider_width_unit});
				$slider.find('li').css({'width' : slider_item});
				
				if (isMobile || isTablet) {
					$slider.next().find('.prev').bind('touchstart', function() {
						var $this = $(this);
						$this.parent('.buttons').prev().find('ul').animate({'left' : '+=' + slider_width}, 600, function(){
							$slider.find('li:first').before($slider.find('li:last'));
							$slider.find('ul').css({'left' : move_left  + slider_width_unit});
						});
						return false;
					});
					
					$slider.next().find('.next').bind('touchstart', function() {
						var $this = $(this);
						$this.parent('.buttons').prev().find('ul').animate({'left' : '-=' + slider_width}, 600, function () {
							$slider.find('li:last').after($slider.find('li:first'));
							$slider.find('ul').css({'left' : move_left + slider_width_unit});
						});
						return false;
					});
				} else {
					$slider.next().find('.prev').click(function() {
						var $this = $(this);
						$this.parent('.buttons').prev().find('ul').animate({'left' : '+=' + slider_width}, 600, function(){
							$slider.find('li:first').before($slider.find('li:last'));
							$slider.find('ul').css({'left' : move_left  + slider_width_unit});
						});
						return false;
					});
					
					$slider.next().find('.next').click(function() {
						var $this = $(this);
						$this.parent('.buttons').prev().find('ul').animate({'left' : '-=' + slider_width}, 600, function () {
							$slider.find('li:last').after($slider.find('li:first'));
							$slider.find('ul').css({'left' : move_left + slider_width_unit});
						});
						return false;
					});
				}
			});
		},
		caption : function () {
			$('.caption').each(function() {
				var $caption = $(this);
				var image = $caption.prev('img');
				var imagealign = image.css('float');
				$caption.prev('img').andSelf().wrapAll('<div>');
				$caption.parent('div').css({'width': image.outerWidth(true), 'height': image.outerHeight(true), 'float': imagealign, 'position': 'relative', 'overflow': 'hidden'});
			});
		},
		scrollarea : function () {
			$('.scrollarea').each(function () {
				var area_width = $(this).attr('data-area-width');
				var area_height = $(this).attr('data-area-height');
				$(this)
					.css({'width': area_width, 'height': area_height})
					.jScrollPane({
						showArrows: false
					});
			});
		}
	};	
	// Some actions
	var methods = {
		// Start
		init : function (options) {
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
				before180: $.noop,
				after180: $.noop,				beforeslide: $.noop,				afterslide: $.noop
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
			$menu.find('a').filter(':first').addClass('active');
			
			// If hash, redefine the active page for tracking and reposition if needed
			if (document.location.hash != "") {
				activePage = $menu.find('a').filter('[href="' + document.location.hash + '"]').attr('title');
			} else {
				activePage = $menu.find('a').filter(':first').attr('title');
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
				
				$body.bind("touchmove", function(event) {
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
										$('.active').prev().click();
									} else {
										event.preventDefault();
										$('.active').next().click();
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
				$window.bind('hashchange._180', function (event) {
					event.preventDefault();
					return false;
				});
				
				// Keyboard nav
				$(document).on('keydown._180', methods.keyboardNavigation);
			}
		},
		// Apply style options to browser
		style : function () {
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
					.css('line-height', siteOptions.menuHeight + 'px');
				
				$header.bind('click', function () {
					$menu.find('a').filter(':first').click();
				});
			}
			
			// footer
			if ($('footer').length) {
				$footer.css({'top' : '-' + (siteOptions.menuHeight*10) + 'px', 'height' : (siteOptions.menuHeight*10) + 'px'});
				$('.showfooter').toggle(function() {
					$footer.stop().animate({'top': 0});
					$menu.stop().animate({'top':(siteOptions.menuHeight*10) + 'px'});
				},function() {
					$footer.stop().animate({'top': '-' + (siteOptions.menuHeight*10) + 'px'});
					$menu.stop().animate({'top':0});
				});
			}
		},
		// Apply style options to mobile
		mobileStyle : function () {
			$slides
				.css({'padding-left': siteOptions.sidePadding/2 + 'px', 'padding-right': siteOptions.sidePadding/2 + 'px', 'padding-top': '+=' + siteOptions.sidePadding + 'px', 'padding-bottom': '+=' + siteOptions.sidePadding/2 + 'px'});		
			if ($('header').length && (siteOptions.showHeader === true || siteOptions.showHeader === false)) {		
				$header
					.css('top', '0px')
					.css('height', siteOptions.menuHeight/2 + 'px')
					.children()
					.css('line-height', siteOptions.menuHeight/2 + 'px');
				
				$header.bind('click', function () {
					$menu.find('a').filter(':first').click();
				});
			}
		},
		// Flexible sizes
		sizes : function () {
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
			
			// IE7 fix
			if ( ($.browser.msie && $.browser.version === 7) && (resized === 0)) {
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
		mobileSizes : function () {
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
			
			setTimeout(function () {
				window.scrollTo(0,1);
			}, 100);
			
		},
		// Reposition if hash is used in URL (Browsers only)
		reposition : function () {
			if (document.location.hash != "") {
				methods.scrollSlide(document.location.hash);
				$('.active').removeClass('active');
				$menu.find('a').filter('[href=' + document.location.hash + ']').addClass('active');
			}
		},
		// Animate menu and internal links + track page views
		menuLinks : function () {
			$menu.find('a').not('.customlink').bind('click', function(event){				
				event.preventDefault();
				var $this = $(this);
				// Scroll and make active
				methods.scrollSlide($this.attr('href'));
				$(".active").removeClass("active");
				$this.addClass('active');
				activePage = $(this).attr("title");
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
			$('a:not(#menu a)').filter('[href^="#"]').bind('click', function(event) {
				var anchor = $(this).attr('href');
				if($menu.find('a[href="'+ anchor +'"]').length) {
					event.preventDefault();
					$menu.find('a[href="'+ anchor +'"]').click();
				}
			});
		},
		// Animate the menu
		menuAnimation : function () {
			var $el, leftPos, newWidth;
			if(!$('#magic').length) {
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
			
			$menu.find('a').hover(function() {
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
		prettyScroll : function () {
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
		detectOrientation : function () {
			if ( orientation == 0 ) {
				$body.addClass('portrait').removeClass('landscape');
			} else if ( orientation == 90 ) {
		        $body.removeClass('portrait').addClass('landscape');
			} else if ( orientation == -90 ) {
		        $body.removeClass('portrait').addClass('landscape');
			} else if ( orientation == 180 ) {
		        $body.addClass('portrait').removeClass('landscape');
			}
		},
		// Navigation by LR arrows
		keyboardNavigation : function (event) {
			if (event.which === 37) {
				event.preventDefault();
				$('.active').prev().click();
			} else if (event.which === 39) {
				event.preventDefault();
				$('.active').next().click();
			}
		},
		// Animate scrolling
		scrollSlide : function (page) {			// do something before?			if ($.isFunction(siteOptions.beforeslide)) {
				siteOptions.beforeslide.call();
			}
			$(scrollElement).stop(true, true).animate({scrollLeft: $(page).offset().left}, 1000, function() {				document.location.hash = page;				// do something after?				if ($.isFunction(siteOptions.afterslide)) {
					siteOptions.afterslide.call();
				}			});
		},
		mobileBase : function () {
			// init iScroll
			myScroll = new iScroll("scroller", {
				hScrollbar: false,
				vScrollbar: false,
				vScroll: false,
				snap: ".slide",
				snapThreshold: 80,
				momentum: false,
				bounce: false,
				lockDirection: true,
				useTransition: true,
				onScrollEnd: function() {
					$(".active").removeClass("active");
					activePage = $("#menu a:nth-child(" + (this.currPageX + 1) + ")").attr("title");
					$("#menu a:nth-child(" + (this.currPageX + 1) + ")").addClass("active");
					snaptoPage = (this.currPageX);
					// Track pageview
					clearTimeout(timer_trackPage);
					timer_trackPage = setTimeout(siteOptions.tracker, 2000);
					if (siteOptions.menuAnimation === true) {
						var $magicLine = $('#magic');
						$magic = $("#menu a:nth-child(" + (this.currPageX + 1) + ")");
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
			$menu.find('a').bind('click', function(event){				
				event.preventDefault();
				var pagenumber = $(this).index();
				myScroll.scrollToPage(pagenumber, 0, 1000);
			});
			// TODO internal links iPad
		},
		mobileVertScroll : function () {
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
	
	// Make it work
	// No chainability needed
	$.fn._180 = function (method) {
		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist' );
		}
	};
})( jQuery );