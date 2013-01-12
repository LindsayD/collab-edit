var sessionMgr = require('./sessionManager'),
	changeMgr = require('./changeManager'),
	db = require("./../dbmodel/collabModels"),
	async = require('async');

exports.registerRoutes = function (server) {

	/////// ADD ALL YOUR ROUTES HERE  ////////

	server.get('/', function(req,res){
		// Load the HTML view
		res.sendfile( 'views/index.html' );
	});
	
	// LOGIN
	server.get('/currentUser', function (req, res) {
		sessionMgr.getSessionData(req, true, function (currentUser){
			var currentUserJson = JSON.stringify(currentUser);
			console.log("CURRENT USER DATA: " + currentUserJson);
			
			if (currentUser === null || currentUser.sessionKey === undefined || currentUser.sessionKey === null) {
				throw new NotFound;
			}
			else {
				res.json(currentUser);
			}
		});
	});
	
	server.post('/login', function (req, res) {
		var loginData = JSON.stringify(req.body);
		console.log("LOGIN DATA: " + loginData);
		sessionMgr.setSessionData(req, req.body.emailAddress);		
		sessionMgr.getSessionData(req, true, function (currentUser){
			console.log("LOGGED IN USER " + JSON.stringify(currentUser));
			res.json(currentUser);
		});
	});

	// STRICTLY EDIT
	server.get( '/edit/:id', function( req, res ) {
		var documentId = req.params.id;
		
		async.waterfall([
			function (callback) {
				// get current user session
				sessionMgr.getSessionData(req, true, function (currentUser){
					console.log("Attempting to load document " + documentId + " as user " + req.ip + ", " + JSON.stringify(currentUser));
					if (currentUser === null || currentUser.emailAddress === null) {
						// No user available -- user needs to log in
						callback(null, null);
					}
					var docKeys = {
						documentId: documentId,
						emailAddress: currentUser.emailAddress,
						sessionKey: currentUser.sessionKey
					};
					callback(null, docKeys);
				});
			},
			function (docKeys, callback) {
				if (docKeys !== null) {
					// create document session or join one
					sessionMgr.addUserToDocument(docKeys.emailAddress, docKeys.sessionKey, req.connection.remoteAddress, docKeys.documentId, null, callback);
				}
				callback(null, docKeys);	
			}],
			function (err, data) {
				if (err !== null) {
					console.log("ERROR loading document: " + JSON.stringify(err));
					throw err;
				}
				else {
					res.sendfile( 'views/edit-template.html' );
					//res.sendfile( 'views/edit.html' );
				}
			});
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
			console.error(err);
			console.log(err.stack);
			res.render('500.jade', { locals: { 
								title : 'The Server Encountered an Error'
							 ,description: ''
							 ,author: ''
							 ,analyticssiteid: 'XXXXXXX'
							 ,error: err 
							},status: 500 });
		}
	});

};

function NotFound(msg){
	this.name = 'NotFound';
	Error.call(this, msg);
	Error.captureStackTrace(this, arguments.callee);
};