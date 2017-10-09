'use strict';

// libraries and imports
const AWS = require('aws-sdk');
AWS.config.update({
  region: 'us-east-1'
});

const uuidv4 = require('uuid/v4');
const path = require('path');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const bodyParser = require('body-parser');
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

// application-specific variables
const state = {};
const sockets = {};

// helper function for initializing state
const initState = function() {
  return {
    name: '',
    messages: [],
    conversationId: uuidv4() // auto-assign conversationId
  };
};

// wraps a string as a text message
// ready to be sent through socket.io
const textMessage = function(text) {
  if (typeof text !== 'string') {
    throw new Error('text parameter needs to be a string');
  }

  return JSON.stringify({
    text: text
  });
};

io.on('connection', function(socket) {

  console.log(`socket ${socket.id} connected ${new Date().toISOString()}`);

  sockets[socket.id] = socket;

  let socketRef = socket;

  socket.on('handshake', function(userObj) {
    console.log(`received handshake for user`, userObj);

    try {
      let user = JSON.parse(userObj);
      let userId = user.userId;

      // if a state object does not exist
      // for this user, create a new one
      if (!state[userId]) {
        state[userId] = initState();
        state[userId].name = user.name;
      }

      // event handler for messages from this particular user
      socketRef.on(userId, function(message) {
        console.log(`received message for ${userId}`, message);

        let currentState = state[userId];

        // track the message
        currentState.messages.push(message);

        // TODO: below, you need to handle the incoming message
        // and use Lex to disambiguate the user utterances
        io.emit(userId, textMessage(`Hi there. I'm under development, but should be functional soon :)`));
      });
    } catch (handshakeError) {
      console.log('user handshake error', handshakeError);
    }
  });

  socket.on('agentHandshake', function(agentObj) {
    console.log(`received handshake for agent`, agentObj);

    // TODO
  });

  socket.on('disconnect', function() {
    console.log(`socket ${socket.id} disconnected at ${new Date().toISOString()}`);
    if (sockets[socket.id]) delete sockets[socket.id];
  });

});

// middleware
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use('/assets', express.static(path.join(__dirname, 'assets')));

http.listen(port, function() {
  console.log('listening on *:' + port);
});

// serve up agent dashboard
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});
