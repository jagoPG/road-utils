
$(document).ready(function () {
	
	$('#navbar > a').click(function() {
    	$('li').removeClass();
    	$(this).parent().addClass('active');
	});

});