// JavaScript Document
$(document).ready(function(){
	//tab switching
	$('li').click(function(){
		var id = this.id;
		if(id === "desktop_switch"){
			$('#desktop_switch').addClass('active');
			$('#tablet_switch').removeClass('active');
			$('#mobile_switch').removeClass('active');
			$('#view').attr('src', 'splash.html');
		}else if(id === "tablet_switch"){
			$('#tablet_switch').addClass('active');
			$('#desktop_switch').removeClass('active');
			$('#mobile_switch').removeClass('active');
		}else if(id == "mobile_switch"){
			$('#mobile_switch').addClass('active');
			$('#desktop_switch').removeClass('active');
			$('#tablet_switch').removeClass('active');
		}
	});
});
