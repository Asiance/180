/**
 * collapsible
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
			$(this).children('div').hide().end().find('h2').css('cursor', 'pointer');

			$(this).each(function() {
				$(this).find('h2:first').addClass('opened').next().show();
			});

			$(this).find('h2').bind('click._180 touchstart._180',
				function() {
					if ($(this).next().is(':hidden')) {
						$(this).parent('.collapsible').find('h2')
								.removeClass('opened').next().slideUp();
						$(this).toggleClass('opened').next().slideDown();
					} else if ($(this).hasClass('opened')
							&& $(this).next().is(':visible')) {
						$(this).removeClass('opened').next().slideUp();
					}
					return false;
				});

		}
	};

	// Make it work
	// No chainability needed
	$.fn._180_collapsible = function(method) {
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