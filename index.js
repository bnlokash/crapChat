var express = require('express');
var app = express();

var http = require('http');
var httpServer = http.createServer(app);

var portNumber = 4200;

app.get('/', (request, response)=> {
    response.send('<h1>Hello World!</h1>');
})

httpServer.listen(portNumber, ()=> {
    console.log('listening on ' + portNumber);
})