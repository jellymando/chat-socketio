var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.use('/public', express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
    // 접속한 클라이언트의 정보가 수신되면
  socket.on('login', function(data) {
    console.log('Client logged-in:\n name:' + data.name + '\n userid: ' + data.userid);

    // socket에 클라이언트 정보를 저장한다
    socket.name = data.name;
    socket.userid = data.userid;

    // 접속된 모든 클라이언트에게 메시지를 전송한다
    io.emit('login', data.name);
  });

  socket.on('room', function(data) {
    var room = socket.room = data.room;

    io.emit('room', room);
  });

  // 클라이언트로부터의 메시지가 수신되면
  socket.on('chat', function(data) {
    var chatInfo = {
      userInfo: {
        name: socket.name
      },
      msg: data.msg
    };

    io.emit('chat', chatInfo);
  });

  // force client disconnect from server
  socket.on('forceDisconnect', function() {
    socket.disconnect();
  })

  socket.on('disconnect', function() {
    console.log('user disconnected: ' + socket.name);
  });
});

server.listen(3000, function() {
  console.log('Socket IO server listening on port 3000');
});