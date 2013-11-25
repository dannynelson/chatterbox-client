// YOUR CODE HERE:
$(document).ready(function() {
  fetch(display);
  setInterval(function(){ fetch(display); }, 5000);
});

var fetch = function(callback) {
  $.get('https://api.parse.com/1/classes/chatterbox', function(data) {
    callback(data.results);
  });
};

var display = function(messages) {
  var message = '<div class="message"></div>';
  var name = '<div class="name"></div>';
  var text = '<div class="text"></div>';
  var timestamp = '<div class="timestamp"></div>';

  _(messages).each(function(msg) {
    var messageToAppend = $(message).append(
      $(name).text(msg.username),
      $(text).text(msg.text),
      $(timestamp).text(msg.createdAt)
    );
    $('.messages').append(messageToAppend);
  });
};