import { createServer } from 'node:http';
import { Server } from 'socket.io';

import app from './app';

const server = createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {},
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

let onlineUsers = [];

const addNewUser = (userName, socketId) => {
  !onlineUsers.some((user) => user.name === userName) &&
    onlineUsers.push({ userName, socketId });
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (userName) => {
  return onlineUsers.find((user) => user.name === userName);
};
io.on('connection', (socket) => {
  socket.on('newUser', (username) => {
    addNewUser(username, socket.id);
  });

  socket.on('disconnect', () => {
    removeUser(socket.id);
  });

  socket.on('sendNotification', ({ senderName, receiverName, type }) => {
    console.log(receiverName);
    const receiver = getUser(receiverName);
    console.log(receiver);
    io.to(receiver.socketId).emit('getNotification', {
      senderName,
      type,
    });
  });

  io.emit('firstEvent', 'Hello this is test!');

  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
  });
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

server.listen(3333, () => {
  console.log(`server running at http://localhost:${3333}`);
});
