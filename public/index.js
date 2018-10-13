$(()=>{
    var socket = io();
    var userName = "";
    var userID = 0;
    var currentUsers = [{}];

    function sendMessage() {
        socket.emit('chatMessage', userID + userName + ": " + $('#messageInput').val());
        $('#messageInput').val('');
        return false;
    }
    // wire up sendMessage to send button and input box enter
    $('#button-send').on('click', sendMessage);
    $('#messageInput').keypress((e)=>{
        if (e.which == 13){
            sendMessage();
        }
    });

    // on chatMessage, append message text
    socket.on('chatMessage', (messageText)=>{
        $('#messages').append($('<li>').addClass('list-group-item').text(messageText));
    });

    // on client connection, server sends back an initUser containing a userName and ID, and current users array
    socket.on('initUser', (name, id, users)=>{
        userName = name;
        userID = id;
        for (var i = 0; i < users.length; i++) {
            console.log(users[i]);
            $('#currentUsers').append($('<li>').addClass('list-group-item').text(users[i].name));
        }
    });

    // when another user connects, add their name to current users div
    
    socket.on('newUser', (name)=>{
        $('#currentUsers').append($('<li>').addClass('list-group-item').text(name));
    });

    // when another user disconnects, remove their name from current users div
    // TO-DO: should probably store other users id instead of removing by name string
    socket.on('removeUser', (name)=>{
        $('li:contains("' +name+ '")').remove();
    })

});