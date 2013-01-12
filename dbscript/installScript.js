Collabbit = typeof Collabbit !== 'undefined' || {};
Collabbit.Schema = typeof Collabbit.Schema !== 'undefined' || {};
Collabbit.Models = typeof Collabbit.Models !== 'undefined' || {};

var async = require("async");
var mongoose = require("mongoose");

// Setup the DB Schema
var setupSchema = function () {
	Collabbit.Schema.document = new mongoose.Schema({
		_id:			String,		// becomes part of the url for the document (base-64 string)
		boilerplate:	String,		// initial text for the document
		text:			String		// the current representation of the document
	});
	Collabbit.Models.Document = mongoose.model("Document", Collabbit.Schema.document);

	Collabbit.Schema.change = new mongoose.Schema({
		documentId:		String,		// Parent doc for the change
		lineNumber:		Number,		// Line Number affected
		charIndex:		Number,		// Char index of the changed character
		from:			String,		// The previous value (or null if an add)
		to:				String,		// The new value (or null if a delete)
		userEmail:		String,		// The e-mail address of the user who made the change
		timeStamp:		{ type: Date, default: Date.now }	// The timestamp when the change was made
	});
	Collabbit.Models.Change = mongoose.model("Change", Collabbit.Schema.change);

	Collabbit.Schema.session = new mongoose.Schema({
		emailAddress:	String,		// The e-mail address for the user
		ipAddress:		String,		// The ip address of the user
		lastActivity:	Date,		// The last time an action was recorded by the user
		userAgent:		String,		// The last captured user-agent string
		sessionKey:		String,		// The generated unique session key
		documentId:		String		// The document currently opened by the user, if any
	});
	Collabbit.Models.Session = mongoose.model("Session", Collabbit.Schema.session);
};

// Clear existing collections
var clearData = function (callback) {
	console.log("Begin Clearing MongoDB Data.");
	async.series([
			function (cb) { clearChange(cb); },
			function (cb) { clearSession(cb); },
			function (cb) { clearDocument(cb); }
		],
		function (err, result) {
			console.log("End Clearing MongoDB Data.");
			callback(err, result);
		});
};
var clearCollection = function (collection, callback) {
	collection.remove({}, function (err) {
		if (err) { console.log("Clear failed."); }
		else { console.log("Clear successful."); }
		callback(err, null);
	});
};
var clearChange = function (callback) {
	console.log("Clearing Change Collection...");
	clearCollection(Collabbit.Models.Change, callback);
};
var clearSession = function (callback) {
	console.log("Clearing Session Collection...");
	clearCollection(Collabbit.Models.Session, callback);
};
var clearDocument = function (callback) {
	console.log("Clearing Document Collection...");
	clearCollection(Collabbit.Models.Document, callback);
};

// Run simple connectivity test (save, remove)
var testData = function (callback) {
	console.log("Begin MongoDB Data Test.");
	async.series([
			function (cb) { createDocumentObject(cb); },
			function (cb) { retrieveDocumentObject(cb); }
		],
		function (err, result) {
			console.log("End MongoDB Data Test.");
			callback(err, result);
		});
};
var createDocumentObject = function (callback) {
	var doc = new Collabbit.Models.Document({
		_id: "abc123",
		boilerplate: "<html></html>",
		text: "<html>a</html>"
	});
	console.log("Created document \"abc123\": " + JSON.stringify(doc));
	console.log("Saving document...");
	doc.save(function (err, saved) {
		if (err) { console.log("Save failed."); }
		else { console.log("Saved: " + JSON.stringify(saved)); }
		callback(err, saved);
	});
};

var retrieveDocumentObject = function (callback) {
	console.log("Retrieving document \"abc123\"...");
	Collabbit.Models.Document.findOne({ _id: "abc123" },
		function (err, retrieved) {
			if (err) { console.log("Retrieve failed."); }
			else { console.log("Retrieved document: " + JSON.stringify(retrieved)); }
			callback(err, retrieved);
		});
};

// Run the script
var main = function () {
	console.log("Begin Mongoose Script.");
	
	console.log("Connecting to MongoDB Instance...");
	mongoose.connect("mongodb://50.62.76.170:13838/collabbit");

	setupSchema();
	async.series([
			function (callback) { clearData(callback); },
			function (callback) { testData(callback); },
			function (callback) { clearData(callback); }
		],
		function (err, result) {
			if (err) {
				console.log("**ERROR**: " + JSON.stringify(err));
			}
			console.log("Disconnecting from MongoDB Instance...");
			mongoose.disconnect();
			console.log("End Mongoose Script.");
		});
};

main();