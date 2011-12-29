$(document).ready(function() {
	window._180.init({
		tracker: function() {
			console.log(window._180.activePage);
		},
		/*
		before180: function () {
			alert('start');
		},*/
		verticalScrolling: true	});});