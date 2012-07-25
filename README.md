#  Hello

+ Container divs ID can be anything but must have `class="slide"`
+ Navigation links must have `data-title` equal to div ID minus # (see example)
+ **/!\\** Make sure to set font-size on `#menu a`

## Basic site structure

### HTML

index.html

```html
<nav>
	<a href="#home" data-title="home">Home</a>
	<a href="#page_one" data-title="page_one">Page 1</a>
	<a href="#page_two" data-title="page_one">Page 2</a>
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

+ **menuPosition:** [default: 'top'] the menu position can be `top` or `bottom`
+ **menuHeight:** [default: 50] menu height in pixels
+ **menuAlign:** [default: 'center'] menu links alignment, can be `left`, `center` or `right`
+ **menuStyle:** [default: 'auto'] the menu style can be `fill` (take 100% of the window width) or `auto`
+ **menuSpacing:** [default: 10] only if the menu style is set to auto, the spacing between links in pixels
+ **slidingpanelHeight:** [default: 400] sliding panel height
+ **sidePadding:** [default: 30] slides side paddings in pixels
+ **verticalScrolling:** [default: true] set this to false to disable vertical scrolling on all the slides (to disable on a single slide, use `class="noscroll"`)
+ **menuAnimation:** [default: true] set this to false to disable the menu hover animation effect
+ **mouseScroll:** [default: false] can be true only if verticalScrolling is disabled, it allows mousewheel navigation
+ **mobiles:** use this to add mobile devices, separate them with `|`
+ **tablets:** use this to add tablet devices, separate them with `|`
+ **tracker:** [default: Google Analytics] function to track page views, can be customized, use variable `activePage` to fetch the active page
+ **before180:** [function] use this to do something before the framework is initialized
+ **after180:** [function] use this to do something after the framework has loaded
+ **beforeslide:** [function] use this to do something before a page slide
+ **afterslide:** [function] use this to do something after a page slide
+ **portrait:** [function] use this to do something in portrait mode
+ **landscape:** [function] use this to do something in landscape mode

## Features

### Generated classes for further styling

- mobile
- tablet
- landscape
- portrait

### Header and footer

- To add a header:

```html
<div id="header">
	[ CONTENT ]
</div>
```

- To add a footer:

```html
<div id="footer">
	[ CONTENT ]
</div>
```

### Create a slide without padding

- Add `class="nopadding"` to slide

### No scrolling for some slides

- Add `class="noscroll"` to slide

### Create collapsible blocks

By default, use `<h2>` to create a clickable title and `<div>` to create a collapsible block.

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

You can use your own HTML tags to define clickable titles and blocks

```html
<div class="collapsible" data-options='{"title":"h3","block":"p"}'>
	<h3>[ BLOCK TITLE ]</h3>
	<p>[ CONTENT ]</p>
	<h3>[ BLOCK TITLE ]</h3>
	<p>[ CONTENT ]</p>
	<h3>[ BLOCK TITLE ]</h3>
	<p>[ CONTENT ]</p>
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
<div class="slider" data-options='{"width":"[ WIDTH ]", "height":"[ HEIGHT ]", "loop":[ BOOLEAN ], "paginate":[ BOOLEAN ], "display":"[ INTEGER ]", "prev":"[ CUSTOM TEXT]", "next":"[ CUSTOM TEXT]"}'>
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

- Or add `class="caption"` to an image to use its alt property as a caption

```html
<img src="[ IMAGE ]" alt="[ CAPTION ]" class="caption" />
```

### Create a scrollable area

- Width and Height can be in percentage

```html
<div class="scrollarea" data-options='{"width":"[ WIDTH ]", "height":"[ HEIGHT ]"}'>
	[ CONTENT ]
</div>
```
### Create a sliding panel

- Create a link with `class="slidepanel"` and add the following to your source code

```html
<div id="slidingpanel">
	<div>
		[ CONTENT ]
	</div>
</div>
```

### Exclude link from menu

- Create a link with `class="customlink"` if you want it to be in the menu bar but if it's not a navigation link

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
- Keumbi
- Hello