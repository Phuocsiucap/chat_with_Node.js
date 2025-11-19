import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import connectDB from './config/db.js';
import initializeSocket from './socket/index.js';
import config from './config/index.js';


//ket noi db
connectDB();

const server = http.createServer(app);

//khoi tao socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

//gui 'io; vao ham quan ly socket
initializeSocket(io);

const PORT = config.PORT;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
