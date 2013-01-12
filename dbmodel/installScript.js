var db = require("./collabModels");
var async = require("async");

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
	clearCollection(db.Models.Change, callback);
};
var clearSession = function (callback) {
	console.log("Clearing Session Collection...");
	clearCollection(db.Models.Session, callback);
};
var clearDocument = function (callback) {
	console.log("Clearing Document Collection...");
	clearCollection(db.Models.Document, callback);
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
	var doc = new db.Models.Document({
		_id: "abc123",
		revisionNum: 1,
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
	db.Models.Document.findById("abc123",
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
	db.connect();

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
			db.disconnect();
			console.log("End Mongoose Script.");
		});
};

main();