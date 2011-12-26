/**
 * 180° Caption plugin
 * 
 * This is a part of the 180° Framework
 * 
 * @author Karine Do, Laurent Le Graverend
 * @see https://github.com/Asiance/180/ 
 * @version 2
 */
(function($) {

	var methods = {

		// Start
		init : function(options) {
			var $caption = $(this);
			var image = $caption.prev('img');
			var imagealign = image.css('float');
			$caption.prev('img').andSelf().wrapAll('<div>');
			$caption.parent('div').css({'width': image.outerWidth(true), 'height': image.outerHeight(true), 'float': imagealign, 'position': 'relative', 'overflow': 'hidden'});
		}
	};

	// Make it work
	// No chainability needed
	$.fn._180_caption = function(method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(
					arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist');
		}
	};
})(jQuery);