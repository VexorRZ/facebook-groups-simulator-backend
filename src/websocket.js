import { Server } from 'socket.io';
import { username } from './config/database';

const io = new Server({
  cors: {
    origin: 'http://localhost:3000',
  },
});

let onlineUsers = [];

const addNewUser = (username, socketId) => {
  !onlineUsers.some((user) => user.username === username) &&
    onlineUsers.push({ username, socketId });
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (username) => {
  return onlineUsers.find((user) => user.username === username);
};

io.on('connection', (socket) => {
  socket.on('newUser', (username) => {
    addNewUser(username, socket.id);
  });

  io.emit('firstevent', 'hello this is test');

  socket.on('disconnect', () => {
    removeUser(socket.id);
  });
});

io.listen(5000);
