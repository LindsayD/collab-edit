// JavaScript Document
$(document).ready(function(){
	init();
	$desk_view = $('#desktop_view');
	$tab_view = $('#tablet_view');
	$mob_view = $('#mobile_view');
	$('li').click(function(){
		var id = this.id;
		if(id === "desktop_switch"){
			$tab_view.fadeTo(1, 0);
			$mob_view.fadeTo(1,0);
			$desk_view.fadeTo(1, 1);
		}else if(id === "tablet_switch"){
			$mob_view.fadeTo(1,0);
			$desk_view.fadeTo(1,0);
			$tab_view.fadeTo(1, 1);
			$tab_view.css('border', '5px solid green');
		}else if(id == "mobile_switch"){
			$desk_view.fadeTo(1, 0);
			$tab_view.fadeTo(1, 0);	
			$mob_view.fadeTo(1,1);
		}
	});
});

function init(){
	var h = $('.tabs li').height();
	$('#tab_container').height(h);	
}
