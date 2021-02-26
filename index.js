const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
// (http, {
//     cors: {
//         origin:'http://localhost:3000',
//         methods: ["GET", "POST"]
//     }
// });

//define router handler
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });  

const users = {};

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('new-user', username => {
      const user = {
        name: username,
        id: socket.id
      }
        users[socket.id] = user;
        io.emit("connected", user);
        io.emit("users", Object.values(users));
        // socket.broadcast.emit('user-connected', name)
      });
    //print out chat message event
    socket.on('chat message', (msg) => {
        //socket.broadcast.emit() will send message to everyone except a certain socket
        //this will send the message to all the sockets
        io.emit('chat message', {
          text: msg,
          user: users[socket.id]
        });
        console.log('message: ' + msg);
      });

    //disconnect event
    // socket.on('disconnect', () => {
    //     console.log('user disconnected');
    // });
});

//sets port to 3000
http.listen(3001, () => {
  console.log('listening on *:3001');
});