// site options
var siteOptions = {
	showHeader: true, // [true, false]
	headerPosition: 'top', // [top, bottom] header position
	menuPosition: 'top', // [top, bottom] menu position
	menuHeight: 50, // [integer]
	menuAlign: 'center', // [left, center, right]
	menuStyle: 'auto', // [fill, auto]
	menuSpacing: 10, // [integer] for menu style auto, spacing between links
	sidePadding: 30, // [integer] slides padding-left and padding-right
	verticalScrolling: false, // [true, false] allow vertical scrolling in the slides
	menuAnimation: true, // [true, false]
	useCollapsible: true // [true, false] generate collapsible blocks
};
if (siteOptions.menuStyle === 'fill' && siteOptions.headerPosition === siteOptions.menuPosition) {
	if (siteOptions.headerPosition === 'top') {
		siteOptions.menuPosition = 'bottom';
	} else if (siteOptions.headerPosition === 'bottom') {
		siteOptions.menuPosition = 'top';
	}
}
// cache
var $window = $(window),
	$body = $('body'),
	$menu = $('#menu'),
	$header,
	$container = $('#container'),
	$slides = $('.slide');

if ($('header').length) {
	$header = $('header');
}

var myScroll,
	snaptoPage = 0;

var resized = 0;

var total_slides = $slides.length;

var timer_trackPage;

if ($.browser.webkit) {
	scrollElement = 'body';
} else {
	scrollElement = 'html';
}

// functions

// fixed dimensions and styles
function styles () {
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
		// if header and menu are on oposite sides
		if (siteOptions.headerPosition != siteOptions.menuPosition) {
			$slides
				.css('padding-' + siteOptions.headerPosition, '+=' + siteOptions.menuHeight + 'px');
		}
	
		$header
			.css(siteOptions.headerPosition, '0px')
			.css('height', siteOptions.menuHeight + 'px')
			.children()
			.css('line-height', siteOptions.menuHeight + 'px')
			;
		
		$header.bind('click', function () {
			$menu.find('a').filter(':first').click();
		});
	}


}

// flexible sizes
function sizes () {
	var windowH = $window.height(),
		windowW = $window.width();
	if (siteOptions.headerPosition === siteOptions.menuPosition) {
		paddingTB = windowH - siteOptions.menuHeight - siteOptions.sidePadding*2;
	} else {
		paddingTB = windowH - siteOptions.menuHeight*2 - siteOptions.sidePadding*2;
	}
	$container.width((windowW * total_slides));
	
	if ((navigator.appVersion.indexOf("MSIE 7.") != -1) && (resized === 0)) {
		$slides
			.width((windowW - siteOptions.sidePadding*2)).height((paddingTB - 18));
		resized = 1;
	} else {
		$slides
			.width((windowW - siteOptions.sidePadding*2)).height((paddingTB));
	}
	
	
	if (document.location.hash != "") {
		scrollSlide(document.location.hash);
		$('.active').removeClass('active');
		$menu.find('a').filter('[href=' + document.location.hash + ']').addClass('active');
	}

	if (siteOptions.verticalScrolling === true) {
		$('.verticalscroller').height((windowH - siteOptions.menuHeight - siteOptions.sidePadding));
	}
	
	if (siteOptions.menuAnimation === true) {
		menuAnimation();
	}
}

// for browsers
function skeleton () {
	// make menu links scroll to page
	$menu.find('a').bind('click', function(event){				
		event.preventDefault();
		var $this = $(this);
		// slide and make active
		scrollSlide($this.attr('href'));
		$(".active").removeClass("active");
		$this.addClass('active');
		activePage = $(this).attr("title");
		// analytics
		clearTimeout(timer_trackPage);
		timer_trackPage = setTimeout("trackPage()", 2500);
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
	
}

//for mobiles
function mobileSkeleton () {
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
			// analytics
			clearTimeout(timer_trackPage);
			timer_trackPage = setTimeout("trackPage()", 2000);
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
}

// slide to anchor
function scrollSlide (page) {
	$(scrollElement).animate({scrollLeft: $(page).offset().left}, 1000, function() {document.location.hash = page;});
}

// vertical iScroll for mobiles
function verticalScroll () {
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

// animate menu
function menuAnimation () {
	var $el, leftPos, newWidth;
	$menu.append('<span id="magic"></span>');
	var $magicLine = $('#magic');
	$magicLine
		.width($('.active').outerWidth(true))
		.height(siteOptions.menuHeight)
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
	
}

// keyboard navigation
function keyboardNavigation (event) {
	if (event.which === 37) {
		event.preventDefault();
		$('.active').prev().click();
	} else if (event.which === 39) {
		event.preventDefault();
		$('.active').next().click();
	}
}

// accordion
function collapsibleBlocks () {
	$('.collapsible div').hide();
	$('.collapsible h2:first').addClass('opened').next().show();
	$('.collapsible h2').css('cursor','pointer');
	$('.collapsible h2').click(function(){
		if( $(this).next().is(':hidden') ) {
			$('.collapsible h2').removeClass('opened').next().slideUp();
			$(this).toggleClass('opened').next().slideDown();
		}
		return false;
	});
}

// adds image hover effect
function hoverEffect () {
	$('.hovereffect').each(function () {
		$(this).css({'width': $(this).children('img').width(), 'height': $(this).children('img').height()});
		$(this).hover(function () {
			$(this).children('div').stop(true,true).fadeIn('slow');
			$(this).children('img').stop(false,true).animate({'width':$(this).width()*1.2, 'height':$(this).height()*1.2, 'top':'-'+$(this).width()*0.1, 'left':'-'+$(this).height()*0.1}, {duration:200});
		}, function () {
			$(this).children('div').hide();
			$(this).find('img').stop(false,true).animate({'width':$(this).width(), 'height':$(this).height(), 'top':'0', 'left':'0'}, {duration:100});
		});
	});
}

// lightbox
function lightbox () {
	$('.lightbox').click(function() {
	    var lightboxID = $(this).attr('data-lightbox-name');
	    var lightboxWidth = $(this).attr('data-lightbox-width');
	    
	    $(this).after('<div id="overlay" onclick=""></div>');
	    
	    $('#overlay').css({'filter' : 'alpha(opacity=80)'}).fadeIn();
	    
	    $(document).off('keydown', keyboardNavigation);
	    
	    $('#' + lightboxID).fadeIn().css({ 'width': Number( lightboxWidth ) }).prepend('<a href="#" class="close"><span>Close<span></a>');
	    
	    var lightboxMargTop = ($('#' + lightboxID).height()) / 2;
	    var lightboxMargLeft = ($('#' + lightboxID).width()) / 2;
	    
	    $('#' + lightboxID).css({
	        'margin-top' : -lightboxMargTop,
	        'margin-left' : -lightboxMargLeft
	    });
	    
	    return false;
	});
	
	$('a.close, #overlay').live('click', function() {
	    $('#overlay , .lightbox_content').fadeOut(function() {
	        $('#overlay, .close').remove();
	    });
	    $(document).on('keydown', keyboardNavigation);
	    return false;
	});
}

// detect devices orientation
function detectOrientation () {
	if ( orientation == 0 ) {
		$body.addClass('portrait').removeClass('landscape');
	} else if ( orientation == 90 ) {
        $body.removeClass('portrait').addClass('landscape');
	} else if ( orientation == -90 ) {
        $body.removeClass('portrait').addClass('landscape');
	} else if ( orientation == 180 ) {
        $body.addClass('portrait').removeClass('landscape');
	}
}


// track page views
function trackPage () {
	// test if it works
	console.log(activePage);
	// for google analytics
	//_gaq.push(['_trackPageview', '/' + activePage]);
}

// ready to go
$(document).ready(function () {
	$('html').removeClass('no-js');
	$menu.find('a').filter(':first').addClass('active');
	
	// define landing page for tracking
	if (document.location.hash != "") {
		activePage = $menu.find('a').filter('[href="' + document.location.hash + '"]').attr('title');
	} else {
		activePage = $menu.find('a').filter(':first').attr('title');
	}
	
	
	// site options
	if (siteOptions.useCollapsible === true) {
		collapsibleBlocks();
	}
	hoverEffect();
	lightbox();
	// init for all
	trackPage();
	styles();

	// for mobiles
	var mobile = (/iphone|ipod|ipad|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));
	var tablet = (/ipad/i.test(navigator.userAgent.toLowerCase()));
	if (mobile) {
		if (tablet) {
			$body.addClass('tablet');
			alert('tablet');
		} else {
			$body.addClass('mobile');
			alert('mobile');
		}
		detectOrientation();
		$container.wrap('<div id="scroller" />');
		
		$window.bind('load', function() {
			mobileSkeleton();
		});
		
		if (siteOptions.verticalScrolling === true) {
			$slides.wrapInner('<div class="scrollable">').wrapInner('<div class="verticalscroller">');
			verticalScroll();
		}
		
		sizes();
	
		$window.bind('resize', function() {
			detectOrientation();
			sizes();
			myScroll.refresh();
			if (snaptoPage != 0) {
				myScroll.scrollToPage(snaptoPage, 0, 200);
			}
		});
		
		$body.bind("touchmove", function(event) {
			event.preventDefault();
		});
	}
	
	// for browsers
	else {
		sizes();
		skeleton();
		if (siteOptions.verticalScrolling === true) {
			$slides.css('overflow','auto');
		}
		$window.bind('resize', function() {
			sizes();
		});
		
		// prevent Firefox from refreshing page on hashchange
		$window.bind('hashchange', function (event) {
			event.preventDefault();
			return false;
		});
		
	}

});
$(document).on('keydown', keyboardNavigation);