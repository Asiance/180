/**
 * lightbox
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
			this.bind('click._180 touchstart._180', function() {
				var lightboxID = $(this).data('lightbox-name');
				var lightboxWidth = parseInt($(this).data('lightbox-width'));
				var lightboxMargTop = ($('#' + lightboxID).height()) / 2;
				var lightboxMargLeft = lightboxWidth/2;
				
				$body.append('<div id="overlay" onclick=""></div>');
				
				$('#overlay').css({'filter' : 'alpha(opacity=80)', 'width': $container.width()}).stop().fadeIn();
				
				$(document).off('keydown._180', jQuery.fn._180('keyboardNavigation')).on('keydown._180', function(e) {e.preventDefault(); });
				
				$('#' + lightboxID)
					.insertAfter('#overlay')
					.stop().fadeIn()
					.css({ 'width': lightboxWidth })
					.prepend('<a href="#" class="close"><span><span></a>')
					.css({'margin-top' : -lightboxMargTop, 'margin-left' : -lightboxMargLeft});
				
				return false;
			});
			
			$('a.close, #overlay').live('click._180 touchstart._180', function() {
				$('#overlay , .lightbox_content').stop(true, true).fadeOut();
				$('#overlay, .close').remove();
				$(document).on('keydown._180', jQuery.fn._180('keyboardNavigation')).off('keydown._180', function(e) {e.preventDefault(); });
				return false;
			});
		}
	};

	// Make it work
	// No chainability needed
	$.fn._180_lightbox = function(method) {
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