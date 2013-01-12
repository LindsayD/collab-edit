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
	socket.broadcast.to(document.documentId).emit('edit', change);
	console.log("CHANGE DOCUMENT: " + document.documentId + ", " + emailAddress);
};

exports.recordDocumentChange = function (documentChange, socket) {
	var changingUser = documentChange.emailAddress,
		documentId = documentChange.documentId,
		newText = documentChange.text;
	
	async.waterfall([
			function (callback) { getDoc(documentId, callback); },
			function (doc, callback) { saveDoc(newText, doc, callback); },
			function (doc, callback) { emitChange(doc, changingUser, socket, callback); }
		],
		function (err, result) {
			if (err) { console.log("ERROR Record document change failed: " + err); }
		});
};

exports.recordCursorChange = function (cursorChange, socket) {
	console.log("CHANGE CURSOR: " + JSON.stringify(cursorChange));
	var docPositions = exports.storeCursorPosition(cursorChange);
	console.dir(docPositions);
	socket.emit('change_cursor', docPositions);
	socket.broadcast.to(cursorChange.documentId).emit('change_cursor', docPositions);
};

var cursorPositions = [];
exports.storeCursorPosition = function (documentId, emailAddress, lineNumber, charIndex) {
	var emailLower = emailAddress.toLowerCase(),
		i, j;
	for (i = 0; i < cursorPositions.length; i++) {
		if (cursorPositions[i].documentId !== documentId) { continue; }
		for (j = 0; j < cursorPositions[i].userPositions.length; j++) {
			if (cursorPositions[i].userPositions[j].emailAddress.toLowerCase() === emailLower) {
				// doc and user found, update the position
				cursorPositions[i].userPositions[j].lineNumber = lineNumber;
				cursorPositions[i].userPositions[j].charIndex = charIndex;
				return cursorPositions[i].userPositions;
			}
		}
		// document found, but user not. Add the user
		var newUser = {
			emailAddress: emailAddress,
			lineNumber: lineNumber,
			charIndex: charIndex
		};
		cursorPositions[i].userPositions[userPositions.length] = newUser;
		return cursorPositions[i].userPositions;
	}
	
	// doc not found, add the doc
	var newDoc = {
		documentId: documentId,
		userPositions: []
	};
	cursorPositions[cursorPositions.length] = newDoc;
	newDoc.userPositions[0] = {
		emailAddress: emailAddress,
		lineNumber: lineNumber,
		charIndex: charIndex
	};
	return newDoc.userPositions;
		
};
