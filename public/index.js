$(()=>{
    var socket = io();
    $('form').submit(()=>{
        socket.emit('chatMessage', $('#messageInput').val());
        $('#messageInput').val('');
        return false;
    });
    socket.on('chatMessage', (messageText)=>{
        $('#messages').append($('<li>').text(messageText));
    })
});