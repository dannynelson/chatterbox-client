// YOUR CODE HERE:
$(document).ready(function() {
  fetch(display);

  setInterval(function(){
    fetch(function(data){
      $('.messages').html('');
      display(data);
    });
  }, 5000);


  $('.submit').on('click', function(event) {
    event.preventDefault();
    var message = $('.sendBox').val();
    sendMessage(message);
    $('.sendBox').val('');
  });
});

var server = 'https://api.parse.com/1/classes/chatterbox';

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

  for(var i = 0; i < 100; i++){
    var msg = messages[i];
    var messageToAppend = $(message).append(
      $(name).text(msg.username + ''),
      $(text).text(msg.text),
      $(timestamp).text($.timeago(msg.createdAt))
    );
    $('.messages').append(messageToAppend);
  }
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