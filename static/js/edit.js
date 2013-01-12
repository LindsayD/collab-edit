// Template Code
var template = "<html>\r\n\t<head>\r\n\t\t<title>CATS IN PAJAMAS!</title>\r\n\t\t<style type='text/css'>\r\n\t\t\tbody{margin:0;padding:10px;background-color:#FFF;color:#00B;font-weight:bold;font-size:32pt;font-family:Arial}\r\n\t\t\t.video-container { position: relative; padding-bottom: 56.25%; padding-top: 30px; height: 0; overflow: hidden; }\r\n\t\t\t.video-container iframe,.video-container object,.video-container embed {\r\n\t\t\t\tposition: absolute;top: 0;left: 0;width: 100%;height: 100%;\r\n\t\t\t}\r\n\t\t</style>\r\n\t</head>\r\n\t<body>\r\n\t\t<div>Pie Iesu Domine, Dona Eis Requiem</div>\r\n\t\t<div class='video-container'>\r\n\t\t\t<iframe src='http://www.youtube.com/embed/xOrgLj9lOwk?showinfo=0&showsearch=0&modestbranding=1&autoplay=0&rel=0&border=0#t=116s' frameborder='0' width='560' height='315' allowfullscreen></iframe>\r\n\t\t</div>\r\n\t</body>\r\n</html>";

/**
 * LAZY LOAD
 */
$( function() {
		// Initialize the editor
		initEditor();

		// Initialize the timeline
		initTimeline();

		// Resize the window
		resize();

		// Bind to the window function
		$( window ).resize( function() { resize(); } );
	}
);

/**
 * Resize the content pane
 */
function resize() {
	// Set the height of the content div
	$( "#content" ).height( $( window ).height() - $( "#content" ).offset().top );
	$( "#source" ).height( $( window ).height() - $( "#source" ).offset().top );
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
		}
	);
	
	// TODO Load from db document.text
	editor.setValue(template);
}

/**
 * Initialize the timeline component
 */
function initTimeline() {
	// Initialize the Slider
	$( "#slider" ).slider( {
			value:100,
			min: 0,
			max: 500,
			step: 50,
			slide: function( event, ui ) {
	 			
			}
		}
	);

	//toggle timeline
	$("#timeline-icon").click( function() {
			$('#slider').fadeIn('fast');
		}
	);
}

function togglePreview() {
	$( ".view" ).toggle();
	$( ".editor").toggleClass( "span6" );
	$( ".editor").toggleClass( "span12" );
}