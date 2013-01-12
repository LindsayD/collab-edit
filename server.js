// Setup Dependencies
var connect = require('connect'),
	express = require('express'),
	io = require('socket.io'),
	db = require('./dbmodel/collabModels'),
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
	
		var room = data.docId;
		socket.join(room);
		
		console.log('joining user to doc id ' + room);
		addUserToDocument(data.username, room, socket, function (err, users) {
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
	
	socket.on('disconnect', function(){
		console.log('Client Disconnected.');
	});
});

function getSession(username, docId) {
	// TODO - pull the user session from the combo of the doc id and the IP address
	var session = typeof(username) !== 'undefined' && username !== null ? { 
		sessionId: 1,
		docId: docId,
		username: username, 
		gravatar: getGravatar(username)
	} :
	{
		sessionId: null
	};
	
	return session;
};

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
			emailLower = emailAddress.toLowerCase(),
			i, s;
		for (i = 0; i < users.length; i++) {
			socket.emit('joined_user', getSession(users[i].emailAddress, docId));
			if (users[i].emailAddress.toLowerCase() === emailLower) {
				// If so, update timestamp
				console.log("User \"" + emailAddress + "\" already logged in. Updating activity timestamp...");
				userSession = users[i];
				userSession.lastActivity = new Date();
			}
		}
		
		// Otherwise create new entity
		if (userSession === null) {
			userSession = new db.Models.Session({
				emailAddress: emailAddress,
				ipAddress: "1.1.1.1",
				lastActivity: new Date(),
				userAgent: "chrome",
				sessionKey: "abc123",
				documentId: docId
			});
			console.log("Adding user \"" + emailAddress + "\" to document \"" + docId + "\".");
			console.log(JSON.stringify(userSession));
			s = getSession(userSession.emailAddress, docId);
			socket.emit('user_session', s);	
			socket.emit('joined_user', s);
			socket.broadcast.to(docId).emit('joined_user', s);
			console.log("Broadcast new user");
		}
		else {
			// User already logged in
			s = getSession(userSession.emailAddress, docId);
			socket.emit('user_session', s);	
		}
		
		// Broadcast login to room
		
		// update the entity
		userSession.save(function (err, saved) {
			if (err) { console.log("Save session failed."); }
			console.log("Saved session: " + JSON.stringify(saved));
			callback(err, users);
		});
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

//x-domain jsonp profile data: http://en.gravatar.com/profile/9e64baef8549d829306f7e36140b3b2a.json?s=80&callback=jsonp_callback
//img pic: http://www.gravatar.com/avatar/9e64baef8549d829306f7e36140b3b2a?s=80
function getGravatar(username) {
	var crypto = require('crypto');
	var hash = crypto.createHash('md5').update(username).digest("hex"); 
	return { 
		avatar: 'http://www.gravatar.com/avatar/' + hash, 
		profile: ' http://en.gravatar.com/profile/' + hash + '.json'
	};
	console.log(hash);// 9b74c9897bac770ffc029102a200c5de
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
	
	//res.sendfile( 'views/edit-template.html' );
	res.sendfile( 'views/edit.html' );
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
console.log('Listening on http://0.0.0.0:' + port );