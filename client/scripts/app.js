
var app = { 

  server : 'https://api.parse.com/1/classes/chatterbox',
  friends : {},
  roomList : {},

	init : function(){
    app.fetch();
    setInterval(app.fetch, 500);

    //on username click, add as friend
    $('ul').on( 'click', '.username', function(e){
      e.preventDefault();
      app.addFriend($(this));
    });

    // posts a typed message on click
    $("#postMessage").click( function() {
      app.send({
        username: window.location.href.split("=")[1],
        text: $("#input").val(), 
        roomname: $("#roomSelect").val()
      });
      $("#input").val('');
    });

    // posts a typed message on click
    $(document).keypress(function(e) {
      if(e.which == 13) {
        app.send({
          username: window.location.href.split("=")[1],
          text: $("#input").val(), 
          roomname: $("#roomSelect").val()
        });
        $("#input").val('');   
      }
    });
	},

  //fetches all messages from server
  fetch : function(){
  	$.ajax({
  	  // This is the url you should use to communicate with the parse API server.
  	  url: app.server,
  	  type: 'GET',
  	  data: {
        //orders data
  	  	order: '-createdAt',
        limit: 100
  	  },
  	  contentType: 'application/json',
  	  success: function (data) {
        //empty div so no repeated messages
	      app.clearMessages();
        //get all the messages from array
	      for(var i = 0; i < data.results.length; i++){

          //Checks illegal names and defines currentRoom as {name, key, listed}
          data.results[i].roomname = app.checkRoom(data.results[i].roomname);

          //escape illegal messages and append them
	      	app.addMessage(data.results[i]);
	      	$('.friend').css( "font-weight", "800" );
	      }
        //updates room selector
        app.updateRooms(data.results);
        //hides all messages that are not the selected room
	      app.enterRoom(data.results);

  	  },
  	  error: function (data) {
  	    // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
  	    console.error('chatterbox: Failed to send message');
  	  }
  	});  	
  },

  //sends messages to server
  send : function(textObject){
  	var message = {
  	  username: textObject.username,
  	  text: textObject.text,
  	  roomname: $("#newRoom").val() || textObject.roomname
  	};

    $("#newRoom").val('');

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

  // empties chats div when we append new messages (no repeat messages)
  clearMessages : function(){
  	$("#chats").empty();
  },
  //takes in single message and appends to chat
  addMessage : function(message){
    if(message.roomname.key){
      message.roomname.key = message.roomname.key.replace(" ", "");
      if(app.friends[message.username] === true){
        $("#chats").append("<li class='chat all "+message.roomname.key+"'><span class='username friend'>" + app.escapeHtml( message.username ) + "</span>: " + app.escapeHtml( message.text ) + "</li>");
      }else{
        $("#chats").append("<li class='chat all "+message.roomname.key+"'><span class='username'>" + app.escapeHtml( message.username ) + "</span>: " + app.escapeHtml( message.text ) + "</li>");
      }
    }
  },

  //yeee spec runnnerrrr
  addRoom : function(messages){
  },
  //update rooms to selector list
  updateRooms : function(messages){
  	for(var i = 0; i < messages.length; i++){
      var room = messages[i].roomname
      if(app.roomList[room.key] === undefined){
        $("#roomSelect").append("<option value='" + room.key + "'>" + room.name + "</option>");
        app.roomList[room.key] = true;
      }
  	}
  },
  //hide all unselected rooms
  enterRoom : function(messages){
    var selectedRoom = $("#roomSelect").val();
    for(var i = 0; i < messages.length; i++){
      if(selectedRoom !== messages[i].roomname.key){
        $("."+messages[i].roomname.key).css({'display' : 'none'});
      }
      if(selectedRoom === "all"){
        $("."+messages[i].roomname.key).css({'display' : 'block'});
      }
    }
  },


  //adds friends
  addFriend : function(name){
    if(app.friends[name.text()] === true){
    	alert("removed " + name.text() + " from your friends list");
    	app.friends[name.text()] = false;
    }else{
    	alert("added " + name.text() + " to your friends list");
    	app.friends[name.text()] = true;
    }
  },


  checkRoom : function(room){
    if(room === undefined || room === null || app.escapeHtml(room) !== room){
      return {name: "illegalRoom", key: "illegalRoom", listed: false};
    }else{
      return {name: room, key: room.replace(" ", ""), listed: false}
    }
  },
  //escapes illegal syntax
  escapeHtml : function(input){
  	if(input !== undefined && input !== null){
  		return input
		    .replace(/&/g, '&amp;')
		    .replace(/</g, '&lt;')
		    .replace(/>/g, '&gt;')
		    .replace(/"/g, '&quot;')
		    .replace(/'/g, '&#x27;');
    }
    return input
  }
};

// run fetch and keep fetching
$( document ).ready(app.init);

