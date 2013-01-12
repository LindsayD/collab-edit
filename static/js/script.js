/* Author: YOUR NAME HERE
*/

function updateEditor() {

}

function updateViews() {

}

function sessionStart(data, docId) {
	if (typeof(data) !== 'undefined' && data !== null && data.sessionKey !== null) {
		$('#username').text(data.emailAddress);
		$('#gravatar').attr('src', data.gravatar.avatar + '?s=50');
		getUserName($('#username'), data.gravatar.profile); 
	}
	else {
		// TODO - handle if user doesn't enter an email address
		var email = window.prompt('Enter your email address to get started', '');
		socket.emit('start_session', { emailAddress: email, documentId: docId });
	}
}
var socket;
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
			var name = "";
			if (data && data.entry && data.entry[0] && data.entry[0].name)
				name = data.entry[0].name.givenName;
			if (name != "") elName.text(name);
		}
	}); 
}

$(document).ready(function() {   
  socket = io.connect();
  

  $('#sender').bind('click', function() {
   socket.emit('message', 'Message Sent on ' + new Date());     
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
	
	$('#usercount').text(users.children().length);
  });
  
  socket.on('edit', function(data){
	updateEditor(data);
	updateViews(data);
  });
  	
   $('#playbackSlider').change(function(){
		var currentValue = $('#currentValue');
        currentValue.html(this.value);
    });
});