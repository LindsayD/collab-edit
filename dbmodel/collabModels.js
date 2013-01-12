exports.Schema = {};
exports.Models = {};

var mongoose = require("mongoose");

// DB CONNECTIVITY
exports.connect = function () {
	var connection = mongoose.connect("mongodb://50.62.76.170:13838/collabbit");
};

exports.disconnect = function () {
	mongoose.disconnect();
};

// DOCUMENT
exports.Schema.document = new mongoose.Schema({
	_id:			String,		// becomes part of the url for the document (base-64 string)
	boilerplate:	String,		// initial text for the document
	text:			String		// the current representation of the document
});
exports.Schema.document.statics.findById = function (id, callback) {
	this.find({ _id: id }, callback);
};
exports.Models.Document = mongoose.model("Document", exports.Schema.document);

// CHANGE
exports.Schema.change = new mongoose.Schema({
	documentId:		String,		// Parent doc for the change
	lineNumber:		Number,		// Line Number affected
	charIndex:		Number,		// Char index of the changed character
	from:			String,		// The previous value (or null if an add)
	to:				String,		// The new value (or null if a delete)
	userEmail:		String,		// The e-mail address of the user who made the change
	timeStamp:		{ type: Date, default: Date.now }	// The timestamp when the change was made
});
exports.Models.Change = mongoose.model("Change", exports.Schema.change);

// SESSION
exports.Schema.session = new mongoose.Schema({
	emailAddress:	String,		// The e-mail address for the user
	ipAddress:		String,		// The ip address of the user
	lastActivity:	Date,		// The last time an action was recorded by the user
	userAgent:		String,		// The last captured user-agent string
	sessionKey:		String,		// The generated unique session key
	documentId:		String		// The document currently opened by the user, if any
});
exports.Schema.session.statics.findByDocumentId = function (documentId, callback) {
	this.find({ documentId: documentId })
		.sort("emailAddress")
		.exec(callback);
};
exports.Schema.session.statics.findByEmailAddress = function (emailAddress, callback) {
	this.find({ emailAddress: emailAddress })
		.limit(5)
		.sort("-lastActivity")
		.exec(callback);
};
exports.Schema.session.statics.findByDocumentIdAndIpAddress = function (documentId, ipAddress,callback) {
	this.find({ documentId: documentId, ipAddress: ipAddress })
		.sort("emailAddress")
		.exec(callback);
};
exports.Models.Session = mongoose.model("Session", exports.Schema.session);