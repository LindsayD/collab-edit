// JavaScript Document
$(document).ready(function(){
	//tab switching
	$('li').click(function(){
		var content = $('view').attr('src');
		var id = this.id;
		loadSplash(content);
		if(id === "desktop_switch"){
			$('#desktop_switch').addClass('active');
			$('#tablet_switch').removeClass('active');
			$('#mobile_switch').removeClass('active');
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

function loadSplash(src){
		$('#view').attr('src', "splash.html");
};

