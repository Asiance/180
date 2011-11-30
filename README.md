#  Hello

+ Container divs ID can be anything but must have `class="slide"`
+ Navigation links must have titles equal to div ID minus # (see example)
+ /!\ Make sure to set font-size on `#menu a`

**Required files:** reset.css, global.css, html5.js, jquery, iscroll.js, base.js

## Basic site structure

	<nav>
		<a href="#home" title="home">Home</a>
		<a href="#page_one" title="page_one">Page 1</a>
		<a href="#page_two" title="page_one">Page 2</a>
	</nav>
	
	<div id="container">
		<div id="home" class="slide">[ CONTENT ]</div>
		<div id="page_one" class="slide">[ CONTENT ]</div>
		<div id="page_two" class="slide">[ CONTENT ]</div>
	</div>

## Functions

### Create a slide without padding

- Add class nopadding to slide

### No scrolling for some slides

- Add class noscroll to slide

### Create collapsible blocks

	<div class="collapsible">
		<h2>[ BLOCK TITLE ]</h2>
		<div>[ CONTENT ]</div>
		<h2>[ BLOCK TITLE ]</h2>
		<div>[ CONTENT ]</div>
		<h2>[ BLOCK TITLE ]</h2>
		<div>[ CONTENT ]</div>
	</div>

### Create a hover effect on image

- Make sure to add width and height !

	<div class="hovereffect">
		<img src="[ IMAGE ]" width="" height="" alt="" />
		<div class="hovertext">[ CONTENT ]</div>
	</div>

### Create lightbox

1. Add this to any element: `data-lightbox-width="[ WIDTH ]" data-lightbox-name="[ LIGHTBOX NAME ]" class="lightbox"`
2. Create the lightbox content:
	<div id="[ POPUP NAME ]" class="lightbox_content">[ LIGHTBOX CONTENT ]</div>

### Create a slideshow
- Width and Height can be in percentage

	<div class="slider" data-slider-width="[ WIDTH ]" data-slider-height="[ HEIGHT ]">
		<ul>
			<li>
				[ CONTENT ]
			</li>
			<li>
				[ CONTENT ]
			</li>
			<li>
				[ CONTENT ]
			</li>
			<li>
				[ CONTENT ]
			</li>
			<li>
				[ CONTENT ]
			</li>
		</ul>
	</div>

### Automatic image captions
- Add a span with class caption right after the image

	<img src="[ IMAGE ]" alt="" />
	<span class="caption">[ CAPTION ]</span>

### Create a scrollable area
- Width and Height can be in percentage

	<div class="scrollarea" data-area-width="[ WIDTH ]" data-area-height="[ HEIGHT ]">
		[ CONTENT ]
	</div>

## Notes

### Youtube video
- Add `wmode=transparent` to the URL

## Body classes

- mobile
- tablet
- landscape
- portrait

# Credits

## Third-party scripts

- iScroll 4 : http://cubiq.org/iscroll-4/
	"position:fixed" for mobiles
- jScrollpane : http://jscrollpane.kelvinluck.com/
	pretty scrollbars
- jQuery mousewheel : http://brandonaaron.net/code/mousewheel/docs
	horizontal mousewheel navigation