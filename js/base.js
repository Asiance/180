// site options
var siteOptions = {
	menuPosition: 'bottom', // [top, bottom] menu position
	menuHeight: 50, // [integer]
	menuAlign: 'center', // [left, center, right]
	menuStyle: 'fill', // [fill, auto]
	menuSpacing: 10, // [integer] for menu style auto, spacing between links
	sidePadding: 30, // [integer] slides padding-left and padding-right
	verticalScrolling: false, // [true, false] allow vertical scrolling in the slides
	menuAnimation: true, // [true, false]
	useCollapsible: true // [true, false] generate collapsible blocks
};

// cache
var $window = $(window),
	$menu = $('#menu'),
	$container = $('#container'),
	$slides = $('.slide');

var myScroll,
	snaptoPage = 0;

var resized = 0;

var total_slides = $slides.length;

var timer_track_page;

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
	
	if (siteOptions.menuAlign === 'center') {
		$menu.css('text-align','center');
	} else if (siteOptions.menuAlign === 'left') {
		$menu.css('text-align','left');
	} else if (siteOptions.menuAlign === 'right') {
		$menu.css('text-align','right');
	}
	
	if (siteOptions.menuStyle === 'fill') {
		$menu.find('a').css('width',(100/$menu.find('a').length) + '%');
	} else if (siteOptions.menuStyle === 'auto') {
		$menu.find('a').css('padding-left', siteOptions.menuSpacing + 'px').css('padding-right', siteOptions.menuSpacing + 'px');
	}
}

// flexible sizes
function sizes () {
	var windowH = $window.height(),
		windowW = $window.width();
	
	$container.width((windowW * total_slides));
	
	if ((navigator.appVersion.indexOf("MSIE 7.") != -1) && (resized === 0)) {
		$slides
			.width((windowW - siteOptions.sidePadding*2)).height((windowH - siteOptions.menuHeight - siteOptions.sidePadding*2 - 18));
		resized = 1;
	} else {
		$slides
			.width((windowW - siteOptions.sidePadding*2)).height((windowH - siteOptions.menuHeight - siteOptions.sidePadding*2));
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
		clearTimeout(timer_track_page);
		timer_track_page = setTimeout("track_page()", 2500);
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
		desktopCompatibility: true,
		onScrollEnd: function() {
			$(".active").removeClass("active");
			activePage = $("#menu a:nth-child(" + (this.currPageX + 1) + ")").attr("title");
			$("#menu a:nth-child(" + (this.currPageX + 1) + ")").addClass("active");
			snaptoPage = (this.currPageX);
			// analytics
			clearTimeout(timer_track_page);
			timer_track_page = setTimeout("track_page()", 2000);
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

// track page views
function track_page () {
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
	
	// init for all
	track_page();
	styles();
	sizes();
	
	// site options
	if (siteOptions.useCollapsible === true) {
		collapsibleBlocks();
	}
	// for mobiles
	var mobile = (/iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));
	if (mobile) {
		$container.wrap("<div id=\"scroller\" />");
		mobileSkeleton();
		if (siteOptions.verticalScrolling === true) {
			$slides.wrapInner('<div class="scrollable">').wrapInner('<div class="verticalscroller">');
			verticalScroll();
		}
		$window.bind('resize', function() {
			sizes();
			if (snaptoPage != 0) {
				myScroll.scrollToPage(snaptoPage, 0, 200);
			}
		});
	}
	
	// for browsers
	else {
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
$(document).keydown(keyboardNavigation);