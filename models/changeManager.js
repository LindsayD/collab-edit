var db = require("./../dbmodel/collabModels");

exports.recordDocumentChange = function (documentChange, socket) {
	var changingUser = documentChange.emailAddress,
		documentId = documentChange.documentId,
		newText = documentChange.text;
		
	// TODO: Implement
};
