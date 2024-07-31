import { createServer } from 'http';
import { Server } from 'socket.io';
import app from './app';

const httpServer = createServer(app);

export const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
    transports: ['websocket'],
    rejectUnauthorized: false,
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
  console.log();

  socket.on('newUser', (username) => {
    addNewUser(username, socket.id);
  });

  socket.on('sendNotification', ({ senderName, receiverName, type }) => {
    console.log('chegou aqui no socket');
    const receiver = getUser(receiverName);
    io.to(receiver.socketId).emit('getNotification', {
      senderName,
      type,
    });
  });

  socket.on('disconnect', () => {
    removeUser(socket.id);
  });
});

httpServer.listen(3333);
