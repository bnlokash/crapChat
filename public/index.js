$(()=>{
    var socket = io();
    function sendMessage(){
        socket.emit('chatMessage', $('#messageInput').val());
        $('#messageInput').val('');
        return false;
    }
    $('#button-send').on('click', sendMessage);
    $('#messageInput').keypress((e)=>{
        if (e.which == 13){
            sendMessage();
        }
    })
    socket.on('chatMessage', (messageText)=>{
        $('#messages').append($('<li>').addClass('list-group-item').text(messageText));
    })
});