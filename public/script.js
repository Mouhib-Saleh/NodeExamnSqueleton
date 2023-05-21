const socket = io();
    
function insertMessage() {
    msg = $('.event-input').val();
    if ($.trim(msg) == '') {
        return false;
      }
    socket.emit('event', msg);
}

$('.submit').click(function() {
  insertMessage();
});

$(window).on('keydown', function(e) {
  if (e.which == 13) {
    insertMessage();
    return false;
  }
})

socket.on('event', (data) => {
    $('<div class="event new">' + data + '</div>').appendTo($('.event-content'));
});
socket.on('userAdded', (data) => {
    alert(data);
});


