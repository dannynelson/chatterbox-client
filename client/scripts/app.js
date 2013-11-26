// YOUR CODE HERE:
$(document).ready(function() {
  chatRoom.update();

  setInterval(function(){
    chatRoom.update();
  }, 3000);

  // click handlers
  $('.submit').on('click', function(event) {
    event.preventDefault();
    var message = $('.sendBox').val();
    chatRoom.sendMessage(message);
    $('.sendBox').val('');
  });

  $('.allrooms').on('click', function(){
    chatRoom.currentRoom = undefined;
    chatRoom.update();
  });

  $('.rooms').on('click', '.room', function() {
    $('.active').removeClass('active');
    chatRoom.currentRoom = $(this).text();
    $(this).addClass('active');
    chatRoom.update();
  });

  $('.messages').on('click', '.addfriend', function(event) {
    var friends = chatRoom.friends;
    event.preventDefault();
    var friend = $(this).parent().find('.name').text();
    if (!friends[friend]) {
      friends[friend] = true;
    } else {
      delete friends[friend];
    }
    chatRoom.update();
  });
});

var chatRoom = {};
chatRoom.friends = {};
chatRoom.server = 'https://api.parse.com/1/classes/chatterbox';

chatRoom.sendMessage = function(message) {
  var data = {
    roomname: chatRoom.currentRoom || "console.log",
    text: message,
    username: getQueryVariable("username")
  };
  $.ajax({
    type: 'POST',
    url: chatRoom.server,
    data: JSON.stringify(data),
    contentType: "application/json"
  });
};

chatRoom.update = function(callback) {
  $.get(chatRoom.server, { order: "-createdAt" }, function(data) {
    $('.messages').html('');
    chatRoom.display(data.results);
  });
};

chatRoom.renderMsg = function(msg){
  if(msg.roomname === chatRoom.currentRoom || chatRoom.currentRoom === undefined){
    var $message = $('<div class="message"></div>');

    if(chatRoom.friends[msg.username]) $message.addClass('friend');

    $message.append(
      $('<a href="#" class="addfriend" title="Add friend">+</a>'),
      $('<div class="name"></div>').text(msg.username),
      $('<div class="text"></div>').text(msg.text),
      $('<div class="timestamp"></div>').text($.timeago(msg.createdAt))
    );

    $('.messages').append($message);
  }
};

chatRoom.renderRooms = function(rooms) {
  $('.roomlist').html('');
  _(rooms).each(function(value, roomName){
    var $room = $('<a href="#" class="room"></a>');
    var $node = $room.text(roomName);
    if(chatRoom.currentRoom == roomName){
      $node.addClass('active');
    }
    $('.roomlist').append($node);
  });
};



chatRoom.display = function(messages) {
  var rooms = {};
  for(var i = 0; i < 100; i++){
    // populate each individual chat
    var msg = messages[i];
    if (msg.roomname) {
      msg.roomname = msg.roomname.length > 15 ? msg.roomname.slice(0, 15) + "..." : msg.roomname;
    }
    if( msg.text && msg.username && msg.text.length < 200 && msg.username.length < 50){
      chatRoom.renderMsg(msg);
    }
    // chatRoom.update rooms
    if (/\w/.test(msg.roomname)) {
      rooms[msg.roomname] = true;
    }
  }
  chatRoom.renderRooms(rooms);
};

var getQueryVariable = function(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if(pair[0] == variable){return pair[1];}
  }
  return(false);
}