/**
 * Performs the login process
 */
function login(email) {
	postLoginData(email, function (data) {
		currentUser = data.emailAddress;
		sessionKey = data.sessionKey;
		
		// TODO Show current user on UI
		// for now just create a doc...
		createNewDocument();
	});
};

var currentUser = null,
	sessionKey = null;
function setCurrentUser() {
	getCurrentUserData(function (data) {
		// TODO Welcome user
		currentUser = data.emailAddress;
		sessionKey = data.sessionKey;

		getUserName(data.gravatar.profile, function(name) {
			if (typeof(name) === 'undefined' || name === "") name = data.emailAddress;
			$('#currentUser').html('<div>Welcome back,<br/><img src="' + data.gravatar.avatar + '?s=30" /> ' + name + '</div>');
		});
	});
};

function getUserName(profileUrl, callback) {
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
			if ($.isFunction(callback)) callback(name);
		}
	}); 
}

function getCurrentUserData (successCallback) {
	$.ajax({
		url: "/currentUser",
		type: "GET",
		contentType: "application/json",
		cache: false,
		success: function(data) {
		  if (successCallback) { successCallback(data); }
		},
		error: function(xhr, status, err) {
		  if (xhr.status === 404) { return; }
		  alert("ERROR retrieving current user data: " + status);
		}
	});
};

function postLoginData (emailAddress, successCallback) {
	$.ajax({
		url: "/login",
		type: "POST",
		dataType: "json",
		data: JSON.stringify({emailAddress: emailAddress}),
		contentType: "application/json",
		success: function(data) {
		  if (successCallback) { successCallback(data); }
		},
		error: function(xhr, status, err) {
		  alert("ERROR performing login")
		}
	});
};