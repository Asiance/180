#  Hello

+ Container divs ID can be anything but must have `class="slide"`
+ Navigation links must have titles equal to div ID minus # (see example)
+ **/!\** Make sure to set font-size on `#menu a`

**Required files:** reset.css, global.css, html5.js, jquery.js, iscroll.js, jquery.180.js

## Basic site structure

### HTML

index.html

```html
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
```

### Javascript

custom.js, initialize 180

```javascript
$(document).ready(function() {
	$('body')._180(options);
});
```

Read about the options in the next section

## Options

+ **showHeader:** [default: true] set this to false to hide the header (or footer depending on how you use it)
+ **headerPosition:** [default: 'top'] the header position can be `top` or `bottom`
+ **menuPosition:** [default: 'top'] the menu position can be `top` or `bottom`
+ **menuHeight:** [default: 50] menu height in pixels
+ **menuAlign:** [default: 'center'] menu links alignment, can be `left`, `center` or `right`
+ **menuStyle:** [default: 'auto'] the menu style can be `fill` (take 100% of the window width) or `auto`
+ **menuSpacing:** [default: 10] only if the menu style is set to auto, the spacing between links in pixels
+ **sidePadding:** [default: 30] slides side paddings in pixels
+ **verticalScrolling:** [default: true] set this to false to disable vertical scrolling on all the slides (to disable on a single slide, use `class="noscroll"`)
+ **menuAnimation:** [default: true] set this to false to disable the menu hover animation effect
+ **mouseScroll:** [default: false] can be true only if verticalScrolling is disabled, it allows mousewheel navigation
+ **mobiles:** [array] use this to add mobile devices
+ **tablets:** [array] use this to add tablet devices
+ **tracker:** [default: Google Analytics] function to track page views, can be customized, use variable `activePage` to fetch the active page
+ **before180:** [function] use this to do something before the framework is initialized
+ **onComplete:** [function] use this to do something after the framework has loaded

## Features

### Generated classes for further styling

- mobile
- tablet
- landscape
- portrait

### Create a slide without padding

- Add `class="nopadding"` to slide

### No scrolling for some slides

- Add `class="noscroll"` to slide

### Create collapsible blocks

```html
<div class="collapsible">
	<h2>[ BLOCK TITLE ]</h2>
	<div>[ CONTENT ]</div>
	<h2>[ BLOCK TITLE ]</h2>
	<div>[ CONTENT ]</div>
	<h2>[ BLOCK TITLE ]</h2>
	<div>[ CONTENT ]</div>
</div>
```

### Create a hover effect on image

- Make sure to add width and height !

```html
<div class="hovereffect">
	<img src="[ IMAGE ]" width="" height="" alt="" />
	<div class="hovertext">[ CONTENT ]</div>
</div>
```

### Create lightbox

1. Add this to any element: `data-lightbox-width="[ WIDTH ]" data-lightbox-name="[ LIGHTBOX NAME ]" class="lightbox"`
2. Create the lightbox content:

```html
<div id="[ POPUP NAME ]" class="lightbox_content">[ LIGHTBOX CONTENT ]</div>
```

### Create a slideshow

- Width and Height can be in percentage

```html
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
```

### Automatic image captions

- Add a span with `class="caption"` right after the image

```html
<img src="[ IMAGE ]" alt="" />
<span class="caption">[ CAPTION ]</span>
```

### Create a scrollable area

- Width and Height can be in percentage

```html
<div class="scrollarea" data-area-width="[ WIDTH ]" data-area-height="[ HEIGHT ]">
	[ CONTENT ]
</div>
```

## Notes

### Youtube video

- Add `wmode=transparent` to the URL

## Credits

### Third-party scripts

- **iScroll 4:** http://cubiq.org/iscroll-4/
	"position:fixed" for mobiles
- **jScrollpane:** http://jscrollpane.kelvinluck.com/
	pretty scrollbars
- **jQuery mousewheel:** http://brandonaaron.net/code/mousewheel/docs
	horizontal mousewheel navigation

### People

- **Laurent Le Graverend:** For his support and ideas :D