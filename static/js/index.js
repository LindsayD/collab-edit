/**
 * Shuffle the string
 */
String.prototype.shuffle = function () {
	var a = this.split(""),
		n = a.length;

	for(var i = n - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var tmp = a[i];
		a[i] = a[j];
		a[j] = tmp;
	}

	return a.join("");
}

/**
 * Create a new Document
 */
function createNewDocument() {
	// Create a soup to pull from
	var soup = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
		documentId = "",
		length = 6;
	
	// Shuffle the soup
	soup = soup.shuffle();

	// Loop until you have a sufficiently long string
	while( documentId.length < length ) {
		// Create a position
		var pos = Math.floor( Math.random() * soup.length ) + 1

		// Append the document id
		documentId += soup.charAt( pos );
	}

	// Redirect to the new location
	window.location.href = "/edit/" + documentId;
};

$(function () {
	$("#btnLogin").click(createNewDocument);
	setCurrentUser();
});