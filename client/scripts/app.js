// YOUR CODE HERE:
$(document).ready(function() {
  fetch(display);

  setInterval(function(){
    fetch(function(data){
      $('.messages').html('');
      display(data, currentRoom);
    });
  }, 5000);


  $('.submit').on('click', function(event) {
    event.preventDefault();
    var message = $('.sendBox').val();
    sendMessage(message);
    $('.sendBox').val('');
  });

  $('.rooms').on('click', '.room', function() {
    $('.active').removeClass('active');
    debugger;
    currentRoom = $(this).text();
    $(this).addClass('.active');
  });

});

var server = 'https://api.parse.com/1/classes/chatterbox';
var rooms = {};
rooms.all = true;
var currentRoom = "all";

var sendMessage = function(message) {
  var data = {
    roomname: "test",
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

  for(var i = 0; i < 100; i++){
    // populate each individual chat
    var msg = messages[i];
    var messageToAppend;
    if (currentRoom === "all") {
      messageToAppend = $(message).append(
        $(name).text(msg.username),
        $(text).text(msg.text),
        $(timestamp).text($.timeago(msg.createdAt))
      );
      $('.messages').append(messageToAppend);
    } else if (msg.roomname && msg.roomname.toLowerCase() === currentRoom) {
      messageToAppend = $(message).append(
        $(name).text(msg.username),
        $(text).text(msg.text),
        $(timestamp).text($.timeago(msg.createdAt))
      );
      $('.messages').append(messageToAppend);
    }
    // populate rooms
    rooms[msg.roomname] = true;
  }
  // debugger;
  $('.roomlist').html('');
  _(rooms).each(function(value, roomName){
    $('.roomlist').append($(room).text(roomName));
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