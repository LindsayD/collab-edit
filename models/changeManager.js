var db = require("./../dbmodel/collabModels"),
	sessionMgr = require('./sessionManager'),
	async = require('async');

var getDoc = function (documentId, callback) {
	db.Models.Document.findLatestById(documentId, function (err, doc) {
		console.log("Retrieving document: " + documentId + "...");
		if (err === null) {
			console.log("Successfully retrieved document: " + JSON.stringify(doc));
		}
		else {
			console.log("ERROR retrieving doc id \"" + documentId + "\".");
		}
		callback(err, doc);
	});
};

exports.getDocumentRevision = function (documentId, revisionNum, callback) {
	db.Models.Document.findByIdAndRevision(documentId, revisionNum, function (err, doc) {
		console.log("Retrieving document: " + documentId + ", rev " + revisionNum + "...");
		if (err === null) {
			console.log("Successfully retrieved document: " + JSON.stringify(doc));
		}
		else {
			console.log("ERROR retrieving doc id \"" + documentId + "\".");
		}
		callback(err, doc);
	});
};

var template = "<html>\r\n\t<head>\r\n\t\t<title>My Page</title>\r\n\t\t<style type='text/css'>\r\n\t\t\tbody{margin:0;padding:10px;background-color:#FFF;color:#00B;font-weight:bold;font-size:32pt;font-family:Arial}\r\n\t\t\t.video-container { position: relative; padding-bottom: 56.25%; padding-top: 30px; height: 0; overflow: hidden; }\r\n\t\t\t.video-container iframe,.video-container object,.video-container embed {\r\n\t\t\t\tposition: absolute;top: 0;left: 0;width: 100%;height: 100%;\r\n\t\t\t}\r\n\t\t</style>\r\n\t</head>\r\n\t<body>\r\n\t\t<div>Pie Iesu Domine, Dona Eis Requiem</div>\r\n\t\t<div class='video-container'>\r\n\t\t\t<iframe src='http://www.youtube.com/embed/xOrgLj9lOwk?showinfo=0&showsearch=0&modestbranding=1&autoplay=0&rel=0&border=0#t=116s' frameborder='0' width='560' height='315' allowfullscreen></iframe>\r\n\t\t</div>\r\n\t</body>\r\n</html>";
exports.getOrCreateDocument = function (documentId, callback) {
	getDoc(documentId, function(err, data) {
		console.log( "GETORCREATEDOCUMENT(): " + JSON.stringify(data) );
	
		if (err === null && data === null) {
			// Create the doc
			var doc = new db.Models.Document({
				_id: documentId,
				revisionNum: 0,
				boilerplate: template,
				text: template
			});
			console.log("Creating new document...");
			doc.save(function (err, saved) {
				if (err) { console.log("Save failed."); }
				else { console.log("Saved: " + JSON.stringify(saved)); }
				callback(err, saved);
			});
		}
		else {
			callback(err, data);
		}
	});
}

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
