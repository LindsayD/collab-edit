// JavaScript Document

$(document).ready(function(){
	$( "#slider" ).slider({ disabled: true });
	$('#timeline_toggle').click(function(){
		
		var disabled = $( "#slider" ).slider( "option", "disabled" );
 		$( "#slider" ).slider( "option", "disabled", !disabled);
	});
});