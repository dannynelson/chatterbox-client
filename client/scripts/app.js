// YOUR CODE HERE:
$(document).ready(function() {
  fetch(display);

  setInterval(function(){
    fetch(function(data){
      $('.messages').html('');
      display(data);
    });
  }, 3000);

  // click handlers
  $('.submit').on('click', function(event) {
    event.preventDefault();
    var message = $('.sendBox').val();
    sendMessage(message);
    $('.sendBox').val('');
  });

  $('.allrooms').on('click', function(){
    currentRoom = undefined;
    fetch(function(data){
      $('.messages').html('');
      display(data);
    });
  });

  $('.rooms').on('click', '.room', function() {
    $('.active').removeClass('active');
    currentRoom = $(this).text();
    $(this).addClass('active');
    fetch(function(data){
      $('.messages').html('');
      display(data);
    });
  });

  $('.messages').on('click', '.addfriend', function(event) {
    event.preventDefault();
    var friend = $(this).parent().find('.name').text();
    if (!friends[friend]) {
      friends[friend] = true;
    } else {
      delete friends[friend];
    }
    fetch(function(data){
      $('.messages').html('');
      display(data);
    });
  });

});

var server = 'https://api.parse.com/1/classes/chatterbox';
var rooms = {};
var currentRoom;
var friends = {};

var sendMessage = function(message) {
  var data = {
    roomname: currentRoom || "console.log",
    text: message,
    username: getQueryVariable("username")
  };
  $.ajax({
    type: 'POST',
    url: server,
    data: JSON.stringify(data),
    contentType: "application/json"
  });
};

var fetch = function(callback) {
  $.get(server, { order: "-createdAt" }, function(data) {
    callback(data.results);
  });
};

var display = function(messages) {
  messages.sort(function(a, b){
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
  var message = '<div class="message"></div>';
  var name = '<div class="name"><</div>';
  var text = '<div class="text"></div>';
  var timestamp = '<div class="timestamp"></div>';
  var room = '<a href= "#" class="room"></a>';
  var friendButton = '<a href="#" class="addfriend" title="Add friend">+</a>';

  for(var i = 0; i < 100; i++){
    // populate each individual chat
    var msg = messages[i];
    var messageToAppend;
    if (msg.roomname) {
      msg.roomname = msg.roomname.length > 15 ? msg.roomname.slice(0, 15) + "..." : msg.roomname;
    }
    if( msg.text && msg.username && msg.text.length < 200 && msg.username.length < 50){
      if (currentRoom === undefined) {
        $messageToAppend = $(message).append(
          $(friendButton),
          $(name).text(msg.username),
          $(text).text(msg.text),
          $(timestamp).text($.timeago(msg.createdAt))
        );
        if(friends[msg.username]){
          $messageToAppend.addClass('friend');
          $messageToAppend.find('.addfriend').text('-');
        } else {
          $messageToAppend.removeClass('friend');
        }
        $('.messages').append($messageToAppend);
      } else if (msg.roomname && msg.roomname.toLowerCase() === currentRoom) {
        $messageToAppend = $(message).append(
          $(friendButton),
          $(name).text(msg.username),
          $(text).text(msg.text),
          $(timestamp).text($.timeago(msg.createdAt))
        );
        if(friends[msg.username]){
          $messageToAppend.addClass('friend');
          $messageToAppend.find('.addfriend').text('-');
        } else {
          $messageToAppend.removeClass('friend');
        }
        $('.messages').append($messageToAppend);
      }
    }
    // populate rooms
    if (/\w/.test(msg.roomname)) {
      rooms[msg.roomname] = true;
    }
  }

  $('.roomlist').html('');
  _(rooms).each(function(value, roomName){
    var $node = $(room).text(roomName);
    if(currentRoom == roomName){
      $node.addClass('active');
    }
    $('.roomlist').append($node);
  });
};

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if(pair[0] == variable){return pair[1];}
  }
  return(false);
}