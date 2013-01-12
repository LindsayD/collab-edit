// ACE Syntax
var ace_syntax = {
	"ASCII" : "ace/mode/asciidoc",
	"C9" : "ace/mode/c9search",
	"C/C++" : "ace/mode/c_cpp",
	"Clojure" : "ace/mode/clojure",
	"Coffee" : "ace/mode/coffee",
	"Coldfusion" : "ace/mode/coldfusion",
	"C#" : "ace/mode/csharp",
	"CSS" : "ace/mode/css",
	"Dart" : "ace/mode/dart",
	"Go" : "ace/mode/golang",
	"Groovy" : "ace/mode/groovy",
	"HAML" : "ace/mode/haml",
	"HTML" : "ace/mode/html",
	"Jade" : "ace/mode/jade",
	"Java" : "ace/mode/java",
	"Javascript" : "ace/mode/javascript",
	"JSON" : "ace/mode/json",
	"JSP" : "ace/mode/jsp",
	"Latex" : "ace/mode/latex",
	"Less" : "ace/mode/less",
	"Lisp" : "ace/mode/lisp",
	"Lua" : "ace/mode/lua",
	"Makefile" : "ace/mode/makefile",
	"Markdown" : "ace/mode/markdown",
	"Objective-C" : "ace/mode/objectivec",
	"Perl" : "ace/mode/perl",
	"PHP" : "ace/mode/php",
	"Powershell" : "ace/mode/powershell",
	"Python" : "ace/mode/python",
	"R" : "ace/mode/r",
	"Ruby" : "ace/mode/ruby",
	"Scala" : "ace/mode/scala",
	"Shell" : "ace/mode/sh",
	"VB Script" : "ace/mode/vbscript",
	"XML" : "ace/mode/xml",
	"YAML" : "ace/mode/yaml"
};

/**
 *	Build the syntax dropdown
 */
function build_syntax() {
	// Loop through each of the possible syntax
	for( label in ace_syntax ) {
		// Create a path to the syntax
		var path = ace_syntax[label];

		// Create a dom element
		var element = $( "<LI>" ).append(
			$( "<A>", {
					"href" : "#",
					"data" : path
				}
			).click( function() {
					// Set the syntax
					set_syntax( $( this ).attr( "data" ) );
				}
			).append( label )
		);

		// Append the element to the dom
		$( "#syntax" ).append( element );
	}
}

/**
 * Set the syntax of the editor
 */
function set_syntax( mode ) {
	var editor = ace.edit( "editor" );
	editor.getSession().setMode( mode );
}