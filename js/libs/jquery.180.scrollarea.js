/**
 * scrollarea
 * 
 * This is a part of the 180° Framework
 * 
 * @package Feel Montpellier
 * @author Karine Do, Laurent Le Graverend
 * @version 2
 */
(function($) {

	var methods = {

		// Start
		init : function(options) {
			var area_width = $(this).data('area-width');
			var area_height = $(this).data('area-height');
			$(this)
				.css({'width': area_width, 'height': area_height})
				.jScrollPane({showArrows: false});
		}
	};

	// Make it work
	// No chainability needed
	$.fn._180_hoverEffect = function(method) {
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