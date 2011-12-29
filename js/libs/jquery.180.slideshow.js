/**
 * 180° Slideshow plugin
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
	
	var methods = {
		
		init : function(options) {
			var settings = $.extend({
				sliderPagination: false,
				sliderTextPrev: "Prev",
				sliderTextNext: "Next"
			}, options);

			var $slider = $(this);
			var slider_width = $slider.data('slider-width');
			var slider_height = $slider.data('slider-height');
			var slider_width_value = parseInt(slider_width);
			var slides = $slider.find('ul').first().children().addClass('diapo');
			
			var inner_width = slider_width_value * slides.length;
			var move_left = slider_width_value * (-1);
			
			var slider_width_unit = 'px';
			if (slider_width != slider_width_value) {
				slider_width_unit = slider_width.replace(new RegExp('[0-9]*'), '');
			}

			if (slider_width_unit === '%') {
				slider_item = slider_width_value / slides.length + slider_width_unit;
			} else {
				slider_item = slider_width_value;
			}
			
			var $nav = $('<div class="buttons"></div>');
			
			$nav.insertAfter($slider);
			
			$('<a href="#prev" class="prev"><span>'+settings.sliderTextPrev+'</span></a>').appendTo($nav).bind('click._180 touchstart._180', function() {
				var $this = $(this);
				$this.parent('.buttons').prev().find('ul').first().animate({'left' : '+=' + slider_width}, 600, function() {
					$slider
						.find('li.diapo:first').before($slider.find('li.diapo:last'))
						.end()
						.find('ul').first().css({'left' : move_left  + slider_width_unit});
				});
				return false;
			});

			if (settings.sliderPagination === true) {
				var nb_slides = ($slider.find('ul').find('li').length);
				for (var i = 1; i <= nb_slides; i ++) {
					$('<a href="#slide-'+i+'" data-nav-id='+i+'><span>'+i+'</span></a>').appendTo($nav).bind('click._180 touchstart._180', function() {
						var $this = $(this);
						// TODO pagination
						/*$this.parent('.buttons').prev().find('ul').first().animate({'left' : slider_width * i + 'px'}, 600, function() {
							$slider
								.find('li.diapo:first').before($slider.find('li.diapo:last'))
								.end()
								.find('ul').first().css({'left' : move_left * $this.data('nav-id')  + slider_width_unit});
						});*/
						return false;
					});
				}
			}
			
			$('<a href="#next" class="next"><span>'+settings.sliderTextNext+'</span></a>').appendTo($nav).bind('click._180 touchstart._180', function() {
				var $this = $(this);
				$this.parent('.buttons').prev().find('ul').first().animate({'left' : '-=' + slider_width}, 600, function() {
					$slider
						.find('li.diapo:last').after($slider.find('li.diapo:first'))
						.end()
						.find('ul').first().css({'left' : move_left + slider_width_unit});
				});
				return false;
			});
			
			$slider
				.css({'width' : slider_width, 'height' : slider_height})
				.find('li.diapo:first').before($slider.find('li.diapo:last'))
				.end()
				.find('ul').first().css({'left' : move_left + slider_width_unit, 'width' : inner_width + slider_width_unit});
			$(slides).css({'width' : slider_item});

		}
	};
	
	$.fn._180_slideshow = function(method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || ! method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error( 'Method ' +  method + ' does not exist' );
		}
	};
})(jQuery);