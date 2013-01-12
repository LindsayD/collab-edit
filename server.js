// Setup Dependencies
var connect = require('connect'),
	express = require('express'),
	io = require('socket.io'),
	db = require('./dbmodel/collabModels'),
	vm = require('./models/socketModels'),
	changeMgr = require('./models/changeManager'),
	port = (process.env.PORT || 80);

// Setup Express
var server = express.createServer();
server.configure( function(){
		server.set( 'views', __dirname + '/views' );
		server.set( 'view options', { layout : false } );
		server.use( connect.bodyParser() );
		server.use( express.cookieParser() );
		server.use( express.session( { secret: "shhhhhhhhh!"}) );
		server.use( connect.static( __dirname + '/static' ) );
		server.use( server.router );
});

// Setup the errors
server.error(function(err, req, res, next){
		if (err instanceof NotFound) {
				res.render('404.jade', { locals: { 
									title : '404 - Not Found'
								 ,description: ''
								 ,author: ''
								 ,analyticssiteid: 'XXXXXXX' 
								},status: 404 });
		} else {
				res.render('500.jade', { locals: { 
									title : 'The Server Encountered an Error'
								 ,description: ''
								 ,author: ''
								 ,analyticssiteid: 'XXXXXXX'
								 ,error: err 
								},status: 500 });
		}
});
server.listen( port );

var docs = {};

//Setup Socket.IO
var io = io.listen(server);
io.sockets.on('connection', function(socket){
	console.log('Client Connected');

	socket.on('start_session', function(data) {
		db.connect();
	
		var room = data.documentId;
		socket.join(room);
		
		console.log('joining user to doc id ' + room);
		addUserToDocument(data.emailAddress, room, socket, function (err, users) {
			db.disconnect();
			if (err) {
				console.log("ERROR: " + JSON.stringify(err));
				// TODO - Handle Error
			}
			else {
				console.log("Login successful...");
			}
		});		
		
	});
	
	socket.on('edit', function(data) {
		changeMgr.recordDocumentChange(data, socket);
	});
	
	socket.on('disconnect', function(){
		console.log('Client Disconnected.');
	});
});

function addUserToDocument(emailAddress, docId, socket, callback) {
	// Get Users
	getUsers(docId, function (e, users) {
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
			socket.emit('joined_user', vm.convertSessionToViewModel(users[i]));
			if (emailLower !== null && users[i].emailAddress.toLowerCase() === emailLower) {
				// If so, update timestamp
				console.log("User \"" + emailAddress + "\" already logged in. Updating activity timestamp...");
				userSession = users[i];
				userSession.lastActivity = new Date();
			}
		}
		
		// Otherwise create new entity
		if (userSession === null) {
			if (emailAddress !== null) {
				userSession = new db.Models.Session({
					emailAddress: emailAddress,
					ipAddress: "1.1.1.1", // TODO: Get this stuff from the request
					lastActivity: new Date(),
					userAgent: "chrome",
					sessionKey: "abc123",
					documentId: docId
				});
				console.log("Adding user \"" + emailAddress + "\" to document \"" + docId + "\".");
				console.log(JSON.stringify(userSession));
				s = vm.convertSessionToViewModel(userSession);
			}
			socket.emit('user_session', s);	
			if (emailAddress !== null) {
				// Broadcast to room and self
				socket.emit('joined_user', s);
				socket.broadcast.to(docId).emit('joined_user', s);
				console.log("Broadcast new user");
			}
		}
		else {
			// User already logged in, broadcast to self
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
}

///////////////////////////////////////////
//              Routes                   //
///////////////////////////////////////////

/////// ADD ALL YOUR ROUTES HERE  /////////

server.get('/', function(req,res){
	// Load the HTML view
	res.sendfile( 'views/index.html' );
});

// STRICTLY EDIT
server.get( '/edit/:id', function( req, res ) {
	// create session or join one
	//initSession(req.params.id);
	// Load the HTML view
	
	res.sendfile( 'views/edit-template.html' );
	//res.sendfile( 'views/edit.html' );
});

// STRICTLY VIEW
server.get( '/view/:id', function( req, res ) {
	// Load the HTML view
	res.sendfile( 'views/view.html' );
});


// A Route for Creating a 500 Error (Useful to keep around)
server.get('/500', function(req, res){
		throw new Error('This is a 500 Error');
});

// FAVICON
server.get( '/favicon.ico', function( req, res ) {
	// Load the HTML view
	res.sendfile( 'static/images/favicon.ico' );
});

// The 404 Route (ALWAYS Keep this as the last route)
server.get('/*', function(req, res){
		throw new NotFound;
});

//
//
function NotFound(msg){
		this.name = 'NotFound';
		Error.call(this, msg);
		Error.captureStackTrace(this, arguments.callee);
}

//
//
console.log('Listening on http://localhost:' + port );