var express = require('express');
var app = express();

var http = require('http');
var httpServer = http.createServer(app);

var socket = require('socket.io');
var io = socket(httpServer);

var portNumber = 4200;
var userCount = 0;
var userConnectCount = 0;
var users = [];

app.use(express.static('public'));

app.get('/', (request, response)=> {
    response.sendFile(__dirname + '/index.html');
})

io.on('connection', (socket)=>{
    userCount++;
    userConnectCount++;

    // assemble user info to emit 
    var userID = socket.id;
    var userName = "User" + userConnectCount;

    // add new user to users array
    users.push({id: userID, name: userName});

    console.log(userCount + ' users connected');
    
    // emit new user info, current users array
    socket.emit('initUser', userName, userID, users);

    // emit new user to all current users
    socket.broadcast.emit('newUser', userName);

    // wire-ups
    // on chatMessage, re-emit
    socket.on('chatMessage', (messageText)=>{
        io.emit('chatMessage', messageText);
    });

    // on disconnect
    //    - remove user from users array
    socket.on('disconnect', ()=> {
        userCount--;
        users = users.filter((obj)=>{
            return obj.id !== socket.id;
        })
        console.log( userName + ' disconnected - ' + userCount + ' users remain');
        // broadcast removeUser containing userName for clients to remove from current users div
        socket.broadcast.emit('removeUser', userName)
    });
});

httpServer.listen(portNumber, ()=> {
    console.log('listening on ' + portNumber);
});