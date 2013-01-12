// JavaScript Document
$(document).ready(function(){
	//init();
	$desk_view = $('#desktop_view');
	$tab_view = $('#tablet_view');
	$mob_view = $('#mobile_view');
	//tab switching
	$('li').click(function(){
		var id = this.id;
		if(id === "desktop_switch"){
			$tab_view.fadeOut(1, function(){
				$mob_view.fadeOut(1, function(){
					$desk_view.fadeIn('fast');
				});
			});
		$('#desktop_switch').addClass('active');
		$('#tablet_switch').removeClass('active');
		$('#mobile_switch').removeClass('active');
		}else if(id === "tablet_switch"){
			$mob_view.fadeOut(1, function(){
				$desk_view.fadeOut(1, function(){
					$tab_view.fadeIn('fast');
				});
			});
			$('#tablet_switch').addClass('active');
			$('#desktop_switch').removeClass('active');
			$('#mobile_switch').removeClass('active');
		}else if(id == "mobile_switch"){
			$desk_view.fadeOut(1, function(){
				$tab_view.fadeOut(1, function(){
					$mob_view.fadeIn('fast');
				});	
			});
			$('#mobile_switch').addClass('active');
			$('#desktop_switch').removeClass('active');
			$('#tablet_switch').removeClass('active');
		}
	});
});

//init function, currently sets page borders
/*function init(){
	var h = $('.tabs li').height();
	$('#tab_container').height(h);	
}*/
