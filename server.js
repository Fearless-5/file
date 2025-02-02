const express = require('express');
const {
  Server
} = require('socket.io');
const cors = require('cors');

let filesArray = [];

const app = express();
app.use(cors());

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('data', (data) => {
    console.log('data: ' + data);
    filesArray.push(data);
    io.emit('data', filesArray);
  });
  socket.on("data-rd", (data) => {
    io.emit('data-rd', data);
  })
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

app.get("/get-files", (req, res) => {
  res.json(filesArray);
});