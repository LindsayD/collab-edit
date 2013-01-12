var conn = new Mongo()

db.change.drop();
db.session.drop();
db.document.drop();

db.document.insert ({
	_id: "abc123",// becomes part of the url for the document (base-64 string)
	boilerplate: "<html></html>", // initial text for the document
	text: "<html>A</html>" // the current representation of the document
});

db.change.insert({
	documentId: "abc123",
	lineNumber: 1,
	charIndex: 6,
	from: null,
	to: "A",
	emailAddress: "scommisso@godaddy.com",
	timeStamp: null
});
db.change.ensureIndex({ documentId: 1 });
db.change.ensureIndex({ emailAddress: 1 });

db.session.insert({
	emailAddress: "scommisso@godaddy.com",
	ipAddress: "10.5.1.139",
	lastActivity: null, // dateTime of last "change" insert
	userAgent: "Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.15 (KHTML, like Gecko) Chrome/24.0.1295.0 Safari/537.15",
	sessionKey: "abc123", //base-64 string
	documentId: "abc123", //the document currently opened by the user, if any
});
db.session.ensureIndex({ documentId: 1 });
db.session.ensureIndex({ emailAddress: 1 });


// test relations
db.session.find({ parent: "abc123" });
db.change.find({ parent: "abc123" });