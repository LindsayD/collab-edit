// Setup Dependencies
var connect = require('connect'),
	express = require('express'),
	db = require('./dbmodel/collabModels'),
	socketMgr = require('./models/socketManager'),
	routeMgr = require('./models/routeManager'),
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

// Setup Socket.IO
socketMgr.initializeSocketServer(server);

// Setup Routes
routeMgr.registerRoutes(server);

//
//
console.log('Listening on http://localhost:' + port );