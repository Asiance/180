/**
 * 180° Scrollarea plugin
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
			var area_width = $(this).data('area-width');
			var area_height = $(this).data('area-height');
			$(this)
				.css({'width': area_width, 'height': area_height})
				.jScrollPane({showArrows: false});
		}
	};

	// Make it work
	// No chainability needed
	$.fn._180_scrollarea = function(method) {
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