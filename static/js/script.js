
// data = { emailAddress:String, text:String, revisionNum:Number }
// emailAddress = the address of the person who initiated the change
// revisionNum = the count of revisions (bind this to the slider!)
// text = the entire document text

var _updatingFromServer = false;
function updateEditor(data) {
	// Get the editor
	var editor = ace.edit( "editor" );

	// Set the text
	_updatingFromServer = true;
	editor.setValue( data.text );
	_updatingFromServer = false;
}

function updateDocument(data) {
	if (_updatingFromServer === true) { return; }
	socket.emit('edit', {
		documentId: getDocId(),
		text: data,
		emailAddress: me
	});
};

// [ {emailAddress:String, lineNumber:1-based number, charIndex:0-based number}, ... ]
var userPositions = []; 
function updateCursors(data) {
	var i, j;
	for (i = 0; i < data.length; i++) {
		for (j = 0; j < userPositions.length; j++) {
			if (data[i].emailAddress === userPositions[j].emailAddress) {
				userPositions[j].lineNumber = data[i].lineNumber;
				userPositions[j].charIndex = data[i].charIndex;
				break;
			}
		}
		// not found, add the user position
		userPositions[userPositions.length] = {
			emailAddress: data[i].emailAddress,
			lineNumber: data[i].lineNumber,
			charIndex: data[i].charIndex
		};
	}
}

function sessionStart(data, docId) {
	if (typeof(data) !== 'undefined' && data !== null && data.sessionKey !== null) {
		me = data.emailAddress;
		$('#username').text(data.emailAddress);
		$('#gravatar').attr('src', data.gravatar.avatar + '?s=35');
		getUserName($('#username'), data.gravatar.profile); 
	}
	else {
		var emailAddress = window.prompt("Welcome! Enter your email address to get started", "");
		if (emailAddress != "") {
			login(docId, emailAddress, function() {
				socket.emit('start_session', { documentId: docId, emailAddress: emailAddress, sessionKey: sessionKey });
			});
		}
		else {
			window.location = window.location.origin;
		}
	}
}
var socket;
var me = null;

function getDocId() {
	var path = window.location.pathname;
	return path.substring(path.lastIndexOf('/') + 1);
}

function getUserName(elName, profileUrl) {
	$.ajax({
		url: profileUrl,
		type: 'GET',
		dataType: 'jsonp',
		crossDomain: 'true',
		success: function(data) {
			//alert(data.entry[0].name.givenName);
			console.dir(data);
			var name = "";
			if (data && data.entry && data.entry[0] && data.entry[0].name)
				name = data.entry[0].name.givenName;
			if (typeof(name) !== 'undefined' && name != "") elName.text(name);
		}
	}); 
}

$(document).ready(function() {   
  socket = io.connect();
  

  $('#sender').bind('click', function() {
   socket.emit('message', 'message sent on ' + new date());     
  });

  sessionStart(null, getDocId());
  
  socket.on('user_session', function(data){
	sessionStart(data, getDocId());
  });
  
  socket.on('joined_user', function(data) {
	//alert('added ' + data.username);
	var users = $('#userlist');
	var elUser = $('<li />')
		.append($('<img />').attr('src', data.gravatar.avatar))
		.append($('<br />'))
		.append($('<span />').text(data.username));
	
	users.append(elUser);
	getUserName(elUser.children('span'), data.gravatar.profile);
	
	var txtUser = elUser.html();
	if (data.username !== me) {
		$('#dropusers')
			.attr('data-content', '<div><img style="float: left; margin: 0 5px 5px 5px;" src="' + data.gravatar.avatar + '?s=50" /> ' + data.username + ' joined.</div>')
			.attr('title', '')
			.popover({ html: true, placement: 'left', trigger: 'manual' }).popover('show');
		
		setTimeout(function() { $('#dropusers').popover('hide'); }, 3500);
	}
	
	$('#usercount').text(users.children().length);
  });
  
  socket.on('edit', function(data){
	updateEditor(data);
	// updateViews(data);
  });
  
  socket.on('change_cursor', function(data){
	updateCursors(data);
  });
  	
   $('#playbackSlider').change(function(){
		var currentValue = $('#currentValue');
        currentValue.html(this.value);
    });
});