const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const socketio = require('socket.io');
const clientRouter = require('./routes/client');

require('dotenv').config();

const app = express();
app.use(cors());

// Connect to MongoDB
mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to database');
  })
  .catch((error) => {
    console.error('Error connecting to database:', error.message);
  });



// Initialize socket.io
const server = require('http').createServer(app);

const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Listen for new connections
io.on('connection', (socket) => {
  console.log('New client connected');

  // Listen for new messages
  socket.on('event', (data) => {
    console.log('event triggered:', data);
  io.emit('event', data);
  
  
  });

  // Listen for disconnections
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});


// Routes
app.use("/clients",clientRouter(app,io));
app.use(express.static(__dirname+'/public')); 
app.get("/",(req,res,next)=>{
    res.sendFile(__dirname + "/index.html");
});

module.exports = {server,io};