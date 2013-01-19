var connect = require('connect'),
	db = require('./../dbmodel/collabModels'),
	vm = require('./socketModels');

exports.setSessionData = function (request, emailAddress) {
	var MSEC_IN_DAY = 86400000;
	var MSEC_IN_MINUTE = 3600000;
	var sessionKey = generateSessionKey();
	request.session.sessionKey = sessionKey;
	request.session.emailAddress = emailAddress;
};

exports.getSessionData = function (request, includeDocumentIds, callback) {
	var currentUser = {
		sessionKey: request.session.sessionKey || null,
		emailAddress: request.session.emailAddress || null,
		currentDocumentIds: []
	};
	if (currentUser.emailAddress === null) {
		// If no current user, don't bother trying to retrieve documents
		console.log("GetSessionData: No current user.");
		callback(currentUser);
	}
	else if (includeDocumentIds === true) {
		console.log("GetSessionData: Loading Gravatar For " + currentUser.emailAddress);
		// add gravatar info
		currentUser.gravatar = vm.getGravatar(currentUser.emailAddress);

		// Get the currently edited docs
		getDocuments(currentUser.emailAddress, function (err, data) {
			if (err === null) {
				var i;
				for (i = 0; i < data.length; i++) {
					currentUser.currentDocumentIds[i] = data[i].documentId;
				}
			}
			callback(currentUser);
		});
	}
	else {
		currentUser.gravatar = vm.getGravatar(currentUser.emailAddress);
		callback(currentUser);
	}
};

var generateSessionKey = function () {
	var shuffleString = function (str) {
		var a = str.split(""),
			n = a.length;

		for(var i = n - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));
			var tmp = a[i];
			a[i] = a[j];
			a[j] = tmp;
		}

		return a.join("");
	}
	// Create a soup to pull from
	var soup = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
		sessionKey = "",
		length = 10;

	// Shuffle the soup
	soup = shuffleString(soup);

	// Loop until you have a sufficiently long string
	while(sessionKey.length < length ) {
		// Create a position
		var pos = Math.round( Math.random() * soup.length ) + 1

		// Append the char
		sessionKey += soup.charAt( pos );
	}

	return sessionKey;
};

exports.addUserToDocument = function (emailAddress, sessionKey, ipAddress, documentId, socket, callback) {
	// Get Users
	getUsers(documentId, function (e, users) {
		if (e) {
			console.log("Get users failed.");
			callback(e, null);
			return;
		}

		// Check if current user is already logged in
		var userSession = null,
			emailLower = null,
			i, s;
		if (emailAddress === undefined) { emailAddress = null; }
		if (emailAddress !== null) {
			emailLower = emailAddress.toLowerCase();
		}
		for (i = 0; i < users.length; i++) {
			if (socket !== null) {
				socket.emit('joined_user', vm.convertSessionToViewModel(users[i]));
			}
			if (emailLower !== null && users[i].emailAddress.toLowerCase() === emailLower) {
				// If so, update timestamp
				console.log("User \"" + emailAddress + "\" already logged in. Updating activity timestamp...");
				userSession = users[i];
				userSession.lastActivity = new Date();
			}
		}

		// Otherwise create new entity
		if (userSession === null && emailAddress !== null) {
			userSession = new db.Models.Session({
				emailAddress: emailAddress,
				ipAddress: ipAddress,
				lastActivity: new Date(),
				userAgent: "chrome",
				sessionKey: "temp",
				documentId: documentId
			});
			console.log("Adding user \"" + emailAddress + "\" to document \"" + documentId + "\".");
			console.log(JSON.stringify(userSession));
			s = vm.convertSessionToViewModel(userSession);
			
			if (socket !== null && s !== null) {
				console.log("SOCKET: ADDING NEW USER");
				socket.emit('user_session', s);
				
				// Broadcast to room and self
				socket.emit('joined_user', s);
				socket.broadcast.to(documentId).emit('joined_user', s);
				console.log("Broadcast new user");
			}
		}
		else if (userSession !== null && socket !== null) {
			// User already logged in, broadcast to self
			console.log("SOCKET: ADDING EXISTING USER");
			s = vm.convertSessionToViewModel(userSession);
			socket.emit('user_session', s);
		}

		// update the entity
		if (userSession !== null) {
			userSession.save(function (err, saved) {
				if (err) { console.log("Save session failed."); }
				console.log("Saved session: " + JSON.stringify(saved));
				callback(err, users);
			});
		}
	});
};

function getUsers(docId, callback) {
	console.log("Calling getUsers: " + docId);
	db.Models.Session.findByDocumentId(docId, function (err, data) {
		if (err) {
			console.log("Error retrieving users: " + JSON.stringify(err));
		}
		else {
			console.log("Retrieved users: " + JSON.stringify(data));
		}
		callback(err, data);
	});
};

function getDocuments(emailAddress, callback) {
	console.log("Calling getDocuments: " + emailAddress);
	db.Models.Session.findByEmailAddress(emailAddress, function (err, data) {
		if (err) {
			console.log("Error retrieving documents: " + JSON.stringify(err));
		}
		else {
			console.log("Retrieved " + data.length + " documents.");
		}
		callback(err, data);
	});
};

exports.getDocumentSessionByIpAddress = function (documentId, ipAddress, callback) {
	console.log("Calling getDocumentSessionByIpAddress: " + documentId + ", " + ipAddress);
	db.Models.Session.findByDocumentIdAndIpAddress(documentId, ipAddress, function (err, data) {
		if (err) {
			console.log("Error retrieving session: " + JSON.stringify(err));
		}
		else {
			console.log("Retrieved session: " + JSON.stringify(data));
		}
		callback(err, data);
	});
};