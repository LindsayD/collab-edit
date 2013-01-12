var db = require("./../dbmodel/collabModels"),
	sessionMgr = require('./sessionManager'),
	async = require('async');

var getDoc = function (documentId, callback) {
	for (var i = 0; i < docs.length; i++) {
		if (docs[i].documentId === documentId) {
			callback(null, docs[i].document);
			return;
		}
	}
	callback(null, null);
	// db.Models.Document.findLatestById(documentId, function (err, doc) {
		// console.log("Retrieving document: " + documentId + "...");
		// if (err === null) {
			// console.log("Successfully retrieved document: " + JSON.stringify(doc));
		// }
		// else {
			// console.log("ERROR retrieving doc id \"" + documentId + "\".");
		// }
		// callback(err, doc);
	// });
};

var docs = [];

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

var template = "<html></html>";//"<!DOCTYPE html>\r\n<html>\r\n  <head>\r\n    <link rel=\"stylesheet\" type=\"text/css\" href=\"http://collabb.it/css/bootstrap.min.css\" />\r\n<link rel=\"stylesheet\" type=\"text/css\" href=\"http://collabb.it/css/index.css\" />\r\n  </head>\r\n\r\n	<body>\r\n		<!-- NAVBAR -->\r\n		<div class=\"navbar navbar-fixed-top\">\r\n			<div class=\"navbar-inner\">\r\n				<div class=\"container-fluid\">\r\n					<a class=\"brand\" href=\"#\">Collabb.it</a>\r\n\r\n					<ul class=\"nav\">\r\n						<li><a href=\"#about\">About</a></li>\r\n						<li><a href=\"#contact\">Contact</a></li>\r\n						<li><a href=\"#team\">The Team</a></li>\r\n					</ul>\r\n    			</div>\r\n  			</div>\r\n            </li>\r\n                    </ul>\r\n				</div>\r\n			</div>\r\n           \r\n            </div>\r\n		</div>\r\n\r\n		<!-- PAGE -->\r\n		<div class=\"content\">\r\n			<!-- TOP -->\r\n			<section id=\"top\">\r\n				<div class=\"row-fluid\" style=\"min-width: 900px;\">\r\n					<div class=\"span5 pagination-centered\"></div>\r\n					<div class=\"span6 pagination-right\">\r\n						<h1>Collaborate. Edit. Enjoy.</h1>\r\n						<div id=\"currentUser\"><br/></div>\r\n						<button id=\"btnLogin\" class=\"btn btn-success btn-large\">Create New Document</button>\r\n					</div>\r\n					<div class=\"span1 pagination-centered\"></div>\r\n				</div>\r\n			</section>\r\n\r\n\r\n			<!-- ABOUT -->\r\n			<section id=\"about\">\r\n				<div class=\"row-fluid\">\r\n					<div class=\"span1 pagination-left\"></div>\r\n					<div class=\"span6 pagination-left\">\r\n						<h1>About Collabb.it<img src=\"http://collabb.it/images/fang.png\" style=\"height:70px; margin-top: -40px; margin-left: 5px;\" /></h1>\r\n						<p>\r\n						Collabb.it is a web application that allows many users to edit the same HTML document concurrently. <br/><br/>\r\n						Users can create a new document and share the URL with other developers, join a document provided by \r\n						another developer, or view a document as it is being created.\r\n						<br/><br/><br/>\r\n						<img src=\"http://collabb.it/images/buggy.png\" style=\"height:70px;margin-top: -40px; float:left;\" />\r\n						<strong style=\"font-size: 115%\">Collabb.it is web development collaboration \r\n						without the pointy teeth!</strong></p>\r\n					</div>\r\n					<div class=\"span1 pagination-left\"></div>\r\n					<div class=\"span3 pagination-left\">\r\n						<div class=\"sponsors\">\r\n							<h3>Sponsored By:</h3>\r\n								<a href=\"http://www.godaddy.com\"><img src=\"http://collabb.it/images/godaddy.png\" style=\"height: 100px;\" alt=\"Go Daddy\"/></a>\r\n								<br/><br/>\r\n								<a href=\"http://www.signalfire.com\"><img src=\"http://collabb.it/images/signalfire.png\" style=\"height: 100px;\" alt=\"Signal Fire\"/></a>\r\n							</div>\r\n						</div>\r\n					</div>\r\n					<div class=\"span1 pagination-left\"></div>\r\n				</div>\r\n			</section>\r\n\r\n			<!-- CONTACT -->\r\n			<section id=\"contact\">\r\n				<div class=\"well\">\r\n					<div class=\"container-fluid\">\r\n						<h1>Contact Collabb.it</h1>\r\n\r\n						<form method=\"post\" action=\"\" id=\"contactform\">\r\n							<fieldset>\r\n								<!-- Name -->\r\n								<div class=\"clearfix\">\r\n									<label for=\"name\">\r\n										Your Name<span class=\"help-required\">*</span>\r\n									</label>\r\n									<div class=\"input\">\r\n										<input type=\"text\" name=\"contactname\" id=\"contactname\" value=\"\" class=\"span6 required\" role=\"input\" aria-required=\"true\" />\r\n									</div>\r\n								</div>\r\n								\r\n								<!-- Email -->\r\n								<div class=\"clearfix\">\r\n									<label for=\"email\">\r\n										Your Email<span class=\"help-required\">*</span>\r\n									</label>\r\n									<div class=\"input\">\r\n										<input type=\"text\" name=\"email\" id=\"email\" value=\"\" class=\"span6 required email\" role=\"input\" aria-required=\"true\" />\r\n									</div>\r\n								</div>\r\n\r\n								<!-- Subject -->\r\n								<div class=\"clearfix\">\r\n									<label for=\"subject\">\r\n										Subject<span class=\"help-required\">*</span>\r\n									</label>\r\n									<div class=\"input\">\r\n										<input type=\"text\" name=\"subject\" id=\"subject\" value=\"\" class=\"span6 required\" role=\"input\" aria-required=\"true\" />\r\n									</div>\r\n								</div>\r\n\r\n								<!-- Message -->\r\n								<div class=\"clearfix\">\r\n									<label for=\"message\">Message<span class=\"help-required\">*</span></label>\r\n									<div class=\"input\">\r\n										<textarea rows=\"8\" name=\"message\" id=\"message\" class=\"span10 required\" role=\"textbox\" aria-required=\"true\"></textarea>\r\n									</div>\r\n								</div>\r\n\r\n								<div class=\"actions\">\r\n									<input type=\"submit\" value=\"Send Your Message\" name=\"submit\" id=\"submitButton\" class=\"btn primary\" title=\"Click here to submit your message!\" />\r\n									<input type=\"reset\" value=\"Clear Form\" class=\"btn\" title=\"Remove all the data from the form.\" />\r\n								</div>\r\n							</fieldset>\r\n						</form>\r\n					</div>\r\n				</div>\r\n			</section>\r\n\r\n			<!-- TEAM -->\r\n			<section id=\"team\">\r\n				<div class=\"container-fluid\">\r\n					<div class=\"row-fluid\" >\r\n						<div class=\"span2 pagination-left\"></div>\r\n						<div class=\"span8 pagination-left\"><h1>The Collabb.it Team</h1></div>\r\n						<div class=\"span2 pagination-left\"></div>\r\n					</div>\r\n					<div class=\"row-fluid\" id=\"team\">\r\n						<div class=\"span2 pagination-left\"></div>\r\n						<div class=\"span4 pagination-left\">\r\n							<ul class=\"nav nav-pills nav-stacked\">\r\n								<li class=\"nav-header\">Student Members</li>\r\n								<li><a href=\"http://www.linkedin.com/pub/xinan-wang/25/783/b2a\" target=\"linkedIn\"><img src=\"http://www.gravatar.com/avatar/9f33eb595d952092b4ce08d86c3253d3?s=30\" />Xinan Wang</a></li>\r\n								<li><a href=\"http://www.linkedin.com/pub/brendan-conron/52/22/611\" target=\"linkedIn\"><img src=\"http://www.gravatar.com/avatar/a82654db2a2a17fac9f77e458a59f815?s=30\" />Brendan Conron</a></li>\r\n								<li><a href=\"http://www.linkedin.com/in/jpitzeruse\" target=\"linkedIn\"><img src=\"http://www.gravatar.com/avatar/b8380695473076ab190a18aa548242d3?s=30\" />Jeremy Pitzeruse</a></li>\r\n								<li><a href=\"mailto:sindhu22@gmail.com\" target=\"linkedIn\"><img src=\"http://www.gravatar.com/avatar/935804588aee7ceb019568b2e53a2d79?s=30\" />Sindhu Suryanarayana</a></li>\r\n							</ul>\r\n						</div>\r\n						<div class=\"span4 pagination-left\">\r\n							<ul class=\"nav nav-pills nav-stacked\">\r\n								<li class=\"nav-header\">GoDaddy Members</li>\r\n								<li><a href=\"http://www.linkedin.com/in/wildfiction\" target=\"linkedIn\"><img src=\"http://www.gravatar.com/avatar/d9f2c02c23a3013166710a1d24bca056?s=30\" />Guy Ellis</a></li>\r\n								<li><a href=\"http://www.linkedin.com/pub/aaron-silvas/6/762/581\" target=\"linkedIn\"><img src=\"http://www.gravatar.com/avatar/9e64baef8549d829306f7e36140b3b2a?s=30\" />Aaron Silvas</a></li>\r\n								<li><a href=\"http://www.linkedin.com/in/lindsayd\" target=\"linkedIn\"><img src=\"http://www.gravatar.com/avatar/7c340a830b0cb1f9651b532b8fe742d8?s=30\" />Lindsay Donaghe</a></li>\r\n								<li><a href=\"http://www.linkedin.com/in/stevecommisso\" target=\"linkedIn\"><img src=\"http://www.gravatar.com/avatar/ad6740168414ea06d3d8ddc94d3514e0?s=30\" />Stephen Commisso</a></li>\r\n							</ul>\r\n						</div>\r\n						<div class=\"span2 pagination-left\"></div>\r\n					</div>\r\n				</div>\r\n			</section>\r\n		</div>\r\n	</body>\r\n</html>";
exports.getOrCreateDocument = function (documentId, callback) {
	getDoc(documentId, function(err, data) {
		console.log( "GETORCREATEDOCUMENT(): " + JSON.stringify(data) );
		if (data === null) {
			var doc = new db.Models.Document({
				_id: documentId,
				revisionNum: 0,
				boilerplate: template,
				text: template
			});
			callback(null, doc);
		}
		else {
			callback(null, data);
		}
	
		// if (err === null && data === null) {
			// // Create the doc
			// var doc = new db.Models.Document({
				// _id: documentId,
				// revisionNum: 0,
				// boilerplate: template,
				// text: template
			// });
			// console.log("Creating new document...");
			// doc.save(function (e, saved) {
				// if (e !== null) { console.log("Save failed."); }
				// else { console.log("Saved: " + JSON.stringify(saved)); }
				// callback(e, saved);
			// });
		// }
		// else {
			// callback(err, data);
		// }
	});
}

var saveDoc = function (newText, dbDocument, callback) {
	if (newText !== dbDocument.text) {
		dbDocument.text = newText;
		dbDocument.revisionNum+= 1;
		console.log("Saving document change \"" + dbDocument.documentId + "\"...");
		
		// update the entity if a diff is detected
		
		// dbDocument.save(function (err, saved) {
			// if (err) { console.log("ERROR Save document failed: " + err); }
			// console.log("Saved document: " + JSON.stringify(saved));
			// callback(err, saved);
		// });
	}
	else {
		callback(null, dbDocument);
	}
};

var emitChange = function (document, emailAddress, socket, callback) {
	if (document === null) {
		// No change detected
		console.WriteLine("EMITTING CHANGE() -- NULL DOC");
		callback(null, null);
		return;
	}
	
	// Change detected, emit back to the client
		console.WriteLine("EMITTING CHANGE()");
	var change = vm.convertToDocumentChangeViewModel(document, emailAddress);
	socket.broadcast.to(document.documentId).emit('edit', change);
	console.log("CHANGE DOCUMENT: " + document.documentId + ", " + emailAddress);
};

exports.recordDocumentChange = function (documentChange, socket) {
	var changingUser = documentChange.emailAddress,
		documentId = documentChange.documentId,
		newText = documentChange.text;
	
	getDoc(documentId, function(err, data) {
		if (err !== null) {
			saveDoc(newText, data, function (e, d) {
				emitChange(d, changingUser, socket, function (e2, d2) {
				});
			});
		}
	});
	
	// async.waterfall([
			// function (callback) { getDoc(documentId, callback); },
			// function (doc, callback) { saveDoc(newText, doc, callback); },
			// function (doc, callback) { emitChange(doc, changingUser, socket, callback); }
		// ],
		// function (err, result) {
			// if (err) { console.log("ERROR Record document change failed: " + err); }
		// });
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
		cursorPositions[i].userPositions[cursorPositions[i].userPositions.length] = newUser;
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
