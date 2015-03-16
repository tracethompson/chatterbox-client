	var app = { 

		init : function(){
		},

		server : 'https://api.parse.com/1/classes/chatterbox',

	  fetch : function(){
	  	$.ajax({
	  	  // This is the url you should use to communicate with the parse API server.
	  	  url: app.server,
	  	  type: 'GET',
	  	  data: {
	  	  	order: '-createdAt',
	        limit: 10
	  	  },
	  	  contentType: 'application/json',
	  	  success: function (data) {
	  	  	console.log(data);
  	      $("#chats").empty();
  	      for(var i = 0; i < data.results.length; i++){
  	      	app.addMessage(data.results[i]);
  	      }
	  	  },
	  	  error: function (data) {
	  	    // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
	  	    console.error('chatterbox: Failed to send message');
	  	  }
	  	});  	
	  },

	  send : function(textObject){
	  	var message = {
	  	  username: textObject.username,
	  	  text: textObject.text,
	  	  roomname: textObject.roomname
	  	};

	  	$.ajax({
	  	  // This is the url you should use to communicate with the parse API server.
	  	  url: app.server,
	  	  type: 'POST',
	  	  data: JSON.stringify(message),
	  	  contentType: 'application/json',
	  	  success: function (data) {
	  	    console.log('chatterbox: Message sent');
	  	  },
	  	  error: function (data) {
	  	    // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
	  	    console.error('chatterbox: Failed to send message');
	  	  }
	  	});
	  },
	  clearMessages : function(){
	  	$("#chats").empty();
	  },
	  addMessage : function(chat){
	  	$("#chats").append("<li><span class='username'>" + chat.username + "</span>: " + chat.text + "</li>");
	  },
	  addRoom : function(room){
      $("#roomSelect").append("<li>" + room + "</li>");
	  },
	  addFriend : function(username){
	  	alert("hi");
	  	return true;
	  }
	};


$( document ).ready(function(){



	app.fetch();
	//setInterval(app.fetch, 1000);

	$('span').on( 'click', '.username', function(){
		console.log("hi");
		app.addFriend(this);
	});

  $("#postMessage").click( function() {
    app.send({
    	username: window.location.href.split("=")[1],
    	text: $("#input").val(), 
    	roomname: "lobby"
    });
    $("#input").val('');
  });

});

