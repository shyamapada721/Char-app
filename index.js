const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

const users = {};

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    //socket.broadcast.emit('joined chat','New user joined the chat');
    socket.on('disconnect', () => {
        console.log('user disconnected');
        socket.broadcast.emit('user-left', users[socket.id]);
    });
});

io.on('connection', (socket) => {
    socket.on('new-user-joined', name => {
        users[socket.id] = name;
        console.log(name);
        socket.broadcast.emit('user-joined', name);
    });
});
io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        socket.broadcast.emit('chat message', { user: users[socket.id], text: msg });
        socket.broadcast.emit('stopTyping', users[socket.id]);
    });
});

io.on('connection', (socket) => {
    socket.on('typing', () => {
        socket.broadcast.emit('typing', users[socket.id]);
    })
});

io.on('connection', (socket) => {
    socket.on('stopTyping', () => {
        socket.broadcast.emit('stopTyping', users[socket.id]);
    })
});


server.listen(3000, () => {
    console.log('listening on *:3000');
});