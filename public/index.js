$(()=>{
    var socket = io();
    var userName = "";
    var userID = 0;
    var currentUsers = [{}];

    function changeName(){
        fromSID = userID;
        toName = $('#input-changeName').val();
        $('#input-changeName').val('');
        userName = toName;
        socket.emit('changeName', fromSID, toName);
        $('#changeNameModal').modal('hide');
    }

    function sendMessage() {
        socket.emit('chatMessage', userName, $('#messageInput').val());
        $('#messageInput').val('');
        return false;
    }
    /** jQuery "wire-ups" **/

    // wire up send button -> sendMessage function
    $('#button-send').on('click', sendMessage);

    // wire up Enter press on input field -> sendMessage
    $('#messageInput').keypress((e)=>{
        if (e.which == 13){
            sendMessage();
        }
    });
    
    // wire up modal input field to check new username against current usernames
    // 
    $('#input-changeName').keyup( ()=>{
        var checkName = $('#input-changeName').val();
        $('#submit-changeName').prop("disabled", false).text('Change Name');
        for (var i = 0; i < currentUsers.length; i++){
            if (checkName == currentUsers[i].name) {
                $('#submit-changeName').prop("disabled", true).text('Name Taken');
            }
        }
    });

    //wire up change name modal button -> changeName function
    $('#submit-changeName').on('click', changeName);

    //wire up change name modal enter -> changeName()
    $('#input-changeName').keypress((e)=>{
        if (e.which == 13){
            changeName();
        }
    });


    /** callbacks **/
    // on chatMessage, append message text
    socket.on('chatMessage', (name, messageText)=>{
        $('#messages').append(
            $('<li>').addClass('list-group-item')
                .append($('<strong>').text(name + ': '))
                .append($('<span>').text(messageText))
        );
    });

    // on client connection, server sends back an initUser containing a userName and ID, and current users array
    socket.on('initUser', (name, id, users)=>{
        userName = name;
        userID = id;
        currentUsers = users;
        // append current users receieved from server
        for (var i = 0; i < users.length; i++) {
            $('#currentUsers').append($('<li>').addClass('list-group-item').text(users[i].name).attr('socketid', users[i].id));
        }
        // set input placeholder to current username (inside name change modal)
        $('#input-changeName').attr('placeholder', userName);
    });

    // when another user connects, add their name to current users div
    socket.on('newUser', (socketID, userName)=>{
        $('#currentUsers').append($('<li>').addClass('list-group-item').text(userName).attr('socketid', socketID));
        currentUsers.push({id: socketID, name: userName})
    });

    // when another user disconnects, remove their name from current users div and users array
    socket.on('removeUser', (sid, name)=>{
        $('li:contains("' +name+ '")').remove();
        currentUsers = currentUsers.filter((obj)=>{
            return obj.id !== sid;
        })
    });

    socket.on('changeName', (fromSID, toName)=>{
        for (var i = 0; i < currentUsers.length; i++){
            if (currentUsers[i].id == fromSID){
                currentUsers[i].name = toName;
            }
        }
        $('li[socketid="'+fromSID+'"]').text(toName);
    })

});