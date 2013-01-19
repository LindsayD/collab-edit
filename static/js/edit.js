/**
 * LAZY LOAD
 */
$( function() {
		// Initialize the editor
		initEditor();

		// Initialize the timeline
		initTimeline();

		// Initialize the icons
		initIcons();

		// Build the ACE view components
		build_syntax();
		build_theme();

		// Resize the window
		resize();
		$( "#slider" ).on( "slidechange", function( event, ui ) { updateFile();} );
		// Bind to the window function
		$( window ).resize( function() { resize(); } );
	}
);

function updateFile(event, ui){
	var slide_val = ui.value;	
	console.log(slide_val);
}
/**
 * Resize the content pane
 */
function resize() {
	// Set the height of the content div
	$( "#content" ).height( Math.floor( $( window ).height() - $( "#content" ).offset().top ) - 1 );
	$( "#source" ).height( Math.floor( $( window ).height() - $( "#source" ).offset().top ) - 1 );
}

/**
 * Initialize the Editor
 */
function initEditor() {
	// Load the editor
	var editor = ace.edit( "editor" );
	editor.setTheme("ace/theme/monokai");
	editor.getSession().setMode("ace/mode/html");
	editor.getSession().setUseWrapMode(true);

	// Bind a change function
	editor.on( 'change', function( e ) {
		// Get the text
		var x = editor.getValue();
		
		// Attempt to append the html
		try {
			// Update the local document
			// $( '#source' ).contents().find( 'html' ).html( x );
			$( '#source' ).attr( 'srcdoc', x );

			// Update the document on the server
			
			updateDocument( x );
		} catch(e) {}
	});
	
	
	// COMMENTED OUT -- this is trying to update the server prior to the document even existing
	// $.get('../html/defaultTemplate.htm', function(html) {	
		// // TODO Load from db document.text
		// editor.setValue( html );
	// });
}

/**
 * Initialize the timeline component
 */
function initTimeline() {
	// Initialie the slider
	$( "#slider" ).slider( {disabled:false, slide: updateFile, value: 100} );
	var max = $( ".selector" ).slider( "option", "max" );
}


/**
 * Initialize the icons
 */
function initIcons() {
	// Initialize the priview toggle
	$("#timeline-icon").click( function() { toggleTimeline(); } );
	$( "#preview-icon" ).click( function() { togglePreview(); } );
}

/**
 * Toggle the Timeline
 */
function toggleTimeline() {
	// Toggle the slider
	$('#slide_container').toggle();
	var max = $( "#slider" ).slider( "option", "max" );
	$('#slider').slider('value', max);
	if($('#slide_container').css( 'display' ) === 'none' ){
		$('#content').css('margin-top','41px');
	}else{
		$('#content').css('margin-top','0');
	}
	
	// Resize the div
	resize();
}

/**
 * Toggle the preview
 */
function togglePreview() {
	$( ".view" ).toggle();
	$( ".editor").toggleClass( "span6" );
	$( ".editor").toggleClass( "span12" );

	// Resize the editor
	var editor = ace.edit( "editor" );
	editor.resize();
}