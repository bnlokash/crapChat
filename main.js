var express = require('express');
var app = express();

var http = require('http');
var httpServer = http.createServer(app);

var socket = require('socket.io');
var io = socket(httpServer);

var portNumber = 4200;
let userCount = 0;

app.use(express.static('public'));

app.get('/', (request, response)=> {
    response.sendFile(__dirname + '/index.html');
})

io.on('connection', (socket)=>{
    userCount++;
    console.log(userCount + ' users connected');

    socket.on('chatMessage', (messageText)=>{
        console.log('New Message: ' + messageText);
        io.emit('chatMessage', messageText);
    })

    socket.on('disconnect', ()=> {
        userCount--;
        console.log('user disconnected - ' + userCount + ' users remain');
    });
})

httpServer.listen(portNumber, ()=> {
    console.log('listening on ' + portNumber);
})