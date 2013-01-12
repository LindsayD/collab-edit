var db = require("./../dbmodel/collabModels"),
	sessionMgr = require('./sessionManager'),
	async = require('async');

var getDoc = function (documentId, callback) {
	db.Models.Document.findById(documentId, function (err, doc) {
		if (err === null) {
			console.log("Successfully retrieved document: " + JSON.stringify(doc));
		}
		else {
			console.log("ERROR retrieving doc id \"" + documentId + "\".");
		}
		callback(err, doc);
	});
};

var saveDoc = function (newText, dbDocument, callback) {
	if (newText !== dbDocument.text) {
		dbDocument.text = newText;
		console.log("Saving document change \"" + dbDocument.documentId + "\"...");
		
		// update the entity if a diff is detected
		dbDocument.save(function (err, saved) {
			if (err) { console.log("ERROR Save document failed: " + err); }
			console.log("Saved document: " + JSON.stringify(saved));
			callback(err, saved);
		});
	}
	else {
		callback(null, dbDocument);
	}
};

var emitChange = function (document, emailAddress, socket, callback) {
	if (document === null) {
		// No change detected
		callback(null, null);
		return;
	}
	
	// Change detected, emit back to the client
	var change = vm.convertToDocumentChangeViewModel(document, emailAddress);
	socket.emit('edit', change);	
};

exports.recordDocumentChange = function (documentChange, socket) {
	var changingUser = documentChange.emailAddress,
		documentId = documentChange.documentId,
		newText = documentChange.text;
	
	db.connect();
	async.waterfall([
			function (callback) { getDoc(documentId, callback); },
			function (doc, callback) { saveDoc(newText, doc, callback); },
			function (doc, callback) { emitChange(doc, changingUser, socket, callback); }
		],
		function (err, result) {
			db.disconnect();
		});
};
