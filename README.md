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
	window._180.init(options);
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
+ **menuSpacing:** [default: 10] only if the menu style is set to auto, the spacing between links in pixels+ **slidingpanelHeight:** [default: 400] sliding panel height
+ **sidePadding:** [default: 30] slides side paddings in pixels
+ **verticalScrolling:** [default: true] set this to false to disable vertical scrolling on all the slides (to disable on a single slide, use `class="noscroll"`)
+ **menuAnimation:** [default: true] set this to false to disable the menu hover animation effect
+ **mouseScroll:** [default: false] can be true only if verticalScrolling is disabled, it allows mousewheel navigation
+ **mobiles:** use this to add mobile devices, separate them with `|`
+ **tablets:** use this to add tablet devices, separate them with `|`
+ **tracker:** [default: Google Analytics] function to track page views, can be customized, use variable `activePage` to fetch the active page
+ **utilities:** [default: true] autoload utilities (see the section above)
+ **before180:** [function] use this to do something before the framework is initialized
+ **after180:** [function] use this to do something after the framework has loaded+ **beforeslide:** [function] use this to do something before a page slide
+ **afterslide:** [function] use this to do something after a page slide
+ **portrait:** [function] use this to do something in portrait mode
+ **landscape:** [function] use this to do something in landscape mode


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

## Utilities

### Create collapsible blocks

#### Constructor
```javasript
$(element)._180_collapsible();
```

#### Format
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

#### Constructor
```javasript
$(element)._180_hover();
```

#### Format
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

#### Constructor
```javasript
$(element)._180_slideshow(options);
```

#### Options
+ **sliderPagination:** [default: false] add a pagination for the sliders [1..n]
+ **sliderTextPrev:** [default: 'Prev'] text for previous button
+ **sliderTextNext:** [default: 'Next'] text for next button
    
- Width and Height can be in percentage

#### Format
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
	</ul>
</div>
```

### Automatic image captions

#### Constructor
```javasript
$(element)._180_caption();
```

#### Format
```html
<img src="[ IMAGE ]" alt="" />
<span class="caption">[ CAPTION ]</span>
```

### Create a scrollable area

#### Constructor
```javasript
$(element)._180_scrollarea();
```

#### Format
```html
<div class="scrollarea" data-area-width="[ WIDTH ]" data-area-height="[ HEIGHT ]">
	[ CONTENT ]
</div>
```

- Width and Height can be in percentage
### Create a sliding panel
#### Constructor
```javasript
$(element)._180_slidepanel();
```

#### Options
+ **height:** [default: 400] integer, height of the panel

#### Format```html
<a href="" class="slidepanel"></a>
[...]<div id="slidingpanel">
	<div>
		[ CONTENT ]
	</div>
</div>```
## Notes

### Exclude link from menu

- Create a link with `class="customlink"` if you want it to be in the menu bar but if it's not a navigation link

### Youtube video

- Add `wmode=transparent` to the URL

## Changelog

+ **V3:** The Framework is now an object, not a plugin anymore 
+ **V2:** Extract utilities to JQuery plugins
+ **V1:** Plugin creation

## Credits

### Third-party scripts

- **iScroll 4:** http://cubiq.org/iscroll-4/
	"position:fixed" for mobiles
- **jScrollpane:** http://jscrollpane.kelvinluck.com/
	pretty scrollbars
- **jQuery mousewheel:** http://brandonaaron.net/code/mousewheel/docs
	horizontal mousewheel navigation

### People

- **Karine Do:** The creator
- **Laurent Le Graverend:** For his support and ideas :D