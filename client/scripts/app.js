var friends = {};
var rooms = {};
var listedRooms = {};
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
        limit: 100
  	  },
  	  contentType: 'application/json',
  	  success: function (data) {
	      $("#chats").empty();
	      for(var i = 0; i < data.results.length; i++){
	      	app.addMessage(data.results[i]);
	      	$('.friend').css( "font-weight", "800" );
	      	rooms[data.results[i].roomname] = true;
	      }
	      app.enterRoom();
	      app.addRoom(rooms);
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
  	    app.fetch();
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
  	if(friends[chat.username] === true){
  		$("#chats").append("<li class='chat'><span class='username friend "+app.escapeHtml( chat.roomname )+"'>" + app.escapeHtml( chat.username ) + "</span>: " + app.escapeHtml( chat.text ) + "</li>");
  	}else{
  		$("#chats").append("<li class='chat'><span class='username "+app.escapeHtml( chat.roomname )+"'>" + app.escapeHtml( chat.username ) + "</span>: " + app.escapeHtml( chat.text ) + "</li>");
  	}
  },
  addRoom : function(rooms){
  	for (room in rooms){
  		if(listedRooms[room] !== true){
  			$("#roomSelect").append("<option value='"+app.escapeHtml( room) +"'>" + app.escapeHtml( room )  + "</option>");
  			listedRooms[room] = true;
  		}
  	}
  },
  addFriend : function(name){
  	
    if(friends[name.text()] === true){
    	alert("removed " + name.text() + " from your friends list");
    	friends[name.text()] = false;
    }else{
    	alert("added " + name.text() + " to your friends list");
    	friends[name.text()] = true;
    }
  },
  escapeHtml : function(input){
  	if(input !== undefined){
  		return input
		    .replace(/&/g, '&amp;')
		    .replace(/</g, '&lt;')
		    .replace(/>/g, '&gt;')
		    .replace(/"/g, '&quot;')
		    .replace(/'/g, '&#x27;');
    }
  },
  enterRoom : function(){
	  var selectedRoom = $("#roomSelect").val();
		  for(room in listedRooms){
		  	if(selectedRoom !== room){
		  		$("."+room).css({'display' : 'none'})
		  	}
		  }
	}
};


$( document ).ready(function(){
	app.fetch();
	//setInterval(app.fetch, 1000);

	$('ul').on( 'click', '.username', function(e){
		e.preventDefault();
		app.addFriend($(this));
	});

  $("#postMessage").click( function() {
    app.send({
    	username: window.location.href.split("=")[1],
    	text: $("#input").val(), 
    	roomname: $("#roomSelect").val()
    });
    $("#input").val('');
  });


});

