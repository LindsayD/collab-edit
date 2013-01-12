/* Author: YOUR NAME HERE
*/

function updateEditor() {

}

function updateViews() {

}

function sessionStart(data, docId) {
	if (typeof(data) !== 'undefined' && data !== null && data.sessionId !== null) {
		$('#username').text(data.username);
		$('#gravatar').attr('src', data.gravatar.avatar + '?s=50');
		getUserName($('#username'), data.gravatar.profile);
	}
	else {
		// TODO - handle if user doesn't enter an email address
		var email = window.prompt('Enter your email address to get started', '');
		socket.emit('start_session', { username: email, docId: docId });
	}
}
var socket;
function getDocId() {
	var path = window.location.pathname;
	return path.substring(path.lastIndexOf('/') + 1);
}

function getUserName(elName, profileUrl) {
	$.ajax({
		url: profileUrl + '?s=80',
		success: function(data) {
			elName.text(data.name.givenName);
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
	users.append(
		$('<li/>')
			.append($('<img />').attr('src', data.gravatar.avatar))
			.append($('<br />'))
			.append($('<span />').text(data.username))
	);
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