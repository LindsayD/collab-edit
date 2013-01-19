var	io = require('socket.io'),
	changeMgr = require('./changeManager'),
	sessionMgr = require('./sessionManager'),
	vm = require('./socketModels');

exports.initializeSocketServer = function (server) {
	io = io.listen(server);
	io.sockets.on('connection', function (socket){
		console.log('Client Connected');

		socket.on('start_session', function (data) {	
			var room = data.documentId,
				ipAddress = socket.handshake.address.address;
			
			console.dir("SOCKET IP " + ipAddress);
				
			socket.join(room);
			
			console.log('SOCKET: joining user to doc id ' + room + ", user " + data.emailAddress);
				changeMgr.getOrCreateDocument(room, function (err, doc) {
					if (err !== null || doc === null) {
						console.log("ERROR LOADING DOCUMENT: " + JSON.stringify(err));
						throw new Error("ERROR loading document");
					}
					sessionMgr.addUserToDocument(data.emailAddress, data.sessionKey, ipAddress, room, socket, function (err, users) {
						//else {
							var docModel = vm.convertToDocumentChangeViewModel(doc, data.emailAddress);						
							console.log("OUTPUTTING DOCUMENT: \"" + doc._id + "\"");
							
							// Load document
							socket.emit('edit', docModel);	

							// Load cursor positions (and initialize for current user)
							var positions = changeMgr.storeCursorPosition(room, data.emailAddress, 1, 0); // initialize to first position in the document
							socket.emit('change_cursor', positions);						
							socket.broadcast.to(room).emit('change_cursor', positions);
							
							console.log("Login successful...");
						//}
					});
				});
		});
		
		socket.on('edit', function (data) {
			changeMgr.recordDocumentChange(data, socket);
		});
		
		
		socket.on('timeline_request', function (data) {
			changeMgr.getDocumentRevision(data.documentId, data.revisionNum, function(err, data) {
			});
		});
		
		socket.on('change_cursor', function (data) {
			changeMgr.recordCursorChange(data, socket);
		});
		
		
		socket.on('disconnect', function (){
			console.log('Client Disconnected.');
		});
	});
}