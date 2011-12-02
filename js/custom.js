$(document).ready(function() {
	$('body')._180({
		tracker: function() {
			console.log(activePage);
		},
		/*onComplete: function() {
			alert('done');
		},
		before180: function () {
			alert('start');
		},*/
		verticalScrolling: true	});});