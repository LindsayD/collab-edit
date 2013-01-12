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
			
			sessionMgr.getDocumentSessionByIpAddress(room, ipAddress, function (err, session) {
				console.log('joining user to doc id ' + room + ", user " + JSON.stringify(session));
				sessionMgr.addUserToDocument(session.emailAddress, session.sessionKey, ipAddress, room, socket, function (err, users) {
					changeMgr.getOrCreateDocument(room, function (err, doc) {
						if (err !== null || doc === null) {
							console.log("ERROR LOADING DOCUMENT: " + JSON.stringify(err));
							throw new Error("ERROR loading document");
						}
						else {						
							var docModel = vm.convertToDocumentChangeViewModel(doc, session.emailAddress);						
							console.log("OUTPUTTING DOCUMENT: " + JSON.stringify(docModel));
							
							// Load document
							socket.emit('edit', docModel);	

							// Load cursor positions (and initialize for current user)
							var positions = changeMgr.storeCursorPosition(room, session.emailAddress, 1, 0); // initialize to first position in the document
							socket.emit('change_cursor', positions);						
							socket.broadcast.to(room).emit('change_cursor', positions);
							
							console.log("Login successful...");
						}
					});
				});
			});		
		});
		
		socket.on('edit', function (data) {
			changeMgr.recordDocumentChange(data, socket);
		});
		
		
		socket.on('change_cursor', function (data) {
			changeMgr.recordCursorChange(data, socket);
		});
		
		
		socket.on('disconnect', function (){
			console.log('Client Disconnected.');
		});
	});
}