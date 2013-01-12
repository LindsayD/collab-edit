// JavaScript Document
$(document).ready(function(){
	init();
	$desk_view = $('#desktop_view');
	$tab_view = $('#tablet_view');
	$mob_view = $('#mobile_view');
	//tab switching
	$('li').click(function(){
		var id = this.id;
		if(id === "desktop_switch"){
			$tab_view.fadeOut('fast');
			$mob_view.fadeOut('fast');
			$desk_view.fadeIn('fast');
		}else if(id === "tablet_switch"){
			$mob_view.fadeOut('fast');
			$desk_view.fadeOut('fast');
			$tab_view.fadeIn('fast');
		}else if(id == "mobile_switch"){
			$desk_view.fadeOut('fast');
			$tab_view.fadeOut('fast');	
			$mob_view.fadeIn('fast');
		}
	});
});

//init function, currently sets page borders
function init(){
	var h = $('.tabs li').height();
	$('#tab_container').height(h);	
}
