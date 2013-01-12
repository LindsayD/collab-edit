// Setup Dependencies
var connect = require('connect'),
	express = require('express'),
	db = require('./dbmodel/collabModels'),
	io = require('socket.io'),
	changeMgr = require('./models/changeManager'),
	sessionMgr = require('./models/sessionManager'),
	routeMgr = require('./models/routeManager'),
	db = require("./dbmodel/collabModels"),
	port = (process.env.PORT || 80);

// Setup Express
var server = express.createServer();
server.configure( function(){
		server.set( 'views', __dirname + '/views' );
		server.set( 'view options', { layout : false } );
		server.use( connect.bodyParser() );
		server.use( express.cookieParser("bringOutTheHolyHandGrenadeOfAntioch"));
		server.use( express.session({ secret: "pieIesuDomineDonaEisRequiem" }));
		server.use( connect.static( __dirname + '/static' ) );
		server.use( server.router );
});
server.listen( port );

// Initialize DB connection
db.connect();

//Setup Socket.IO
var io = io.listen(server);
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
				if (err) {
					console.log("ERROR: " + JSON.stringify(err));
					// TODO - Handle Error
				}
				else {
					console.log("Login successful...");
				}
			});
		});		
	});
	
	socket.on('edit', function (data) {
		changeMgr.recordDocumentChange(data, socket);
	});
	
	
	socket.on('change-cursor', function (data) {
		changeMgr.recordDocumentChange(data, socket);
	});
	
	
	socket.on('disconnect', function (){
		console.log('Client Disconnected.');
	});
});

///////////////////////////////////////////
//              Routes                   //
///////////////////////////////////////////

routeMgr.registerRoutes(server);

//
//
console.log('Listening on http://localhost:' + port );