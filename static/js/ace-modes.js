var mode = {
	"Chrome":"chrome", 
	"Clouds":"clouds",
	"Clouds Midnight":"clouds_midnight",
	"Cobalt":"cobalt",
	"Crimson":"crimson_editor",
	"Dawn":"dawn",
	"Dreamweaver":"dreamweaver",
	"Eclipse":"eclipse",
	"Github":"github",
	"Idle Fingers":"idle_fingers",
	"Merbivore":"merbivore",
	"Merbivore Soft":"merbivore_soft",
	"Mono Industrial":"mono_industrial",
	"Monokai":"monokai",
	"Pastel on Dark":"pastel_on_dark",
	"Solarized Light":"solarized_light",
	"Text mate":"textmate",
	"Tomorrow":"tomorrow",
	"Tomorrow Night":"tomorrow_night",
	"Tomorrow Night Bight":"tomorrow_night_blue",
	"Tomorrow Night Bright":"tomorrow_night_bright",
	"Tomorrow Night Eighties":"tomorrow_night_eighties",
	"Twilight":"twilight",
	"Vibrant Ink":"vibrant_ink"
};

function build_theme() {
	// Loop through each of the possible theme
	for( label in mode ) {
		// Create a path to the theme
		var path = "ace/theme/"+mode[label];

		// Create a dom element
		var element = $( "<LI>" ).append(
			$( "<A>", {
					"href" : "#",
					"data-path" : path
				}
			).click( function() {
					// Set the theme
					set_theme( $( this ).attr( "data-path" ) );
				}
			).append( label )
		);

		// Append the element to the dom
		$( "#theme" ).append( element );
	}
}

/**
 * Set the theme of the editor
 */
function set_theme( mode ) {
	var editor = ace.edit( "editor" );
	editor.setTheme( mode );
}