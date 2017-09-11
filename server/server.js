const path = require('path');
const express = require('express');

const api = require('./api');
const bodyParser = require('body-parser');
const port = 3001;

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(bodyParser.json());
app.use('/api', api)

app.listen(port, 'localhost', function (err) {
    if (err) {
        console.log(err);
        return;
    }

    console.log('Listening at http://localhost:' + port);
});

io.on('connection', function(socket) {
    console.log('a user connected')
    socket.on('ballTouched', function(coords) {
        socket.broadcast.emit('updateBallCoordinates', coords);
    })
})


server.listen(3002, function() {
    console.log("listening sockets on *:3002");
})