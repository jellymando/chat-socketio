$(function(){
    // socket.io 서버에 접속한다
    var socket = io();
    var $userName = $("#userName");
    var $msgForm = $("#msgForm");
    var $roomName = $("#roomName");

    // 서버로 자신의 정보를 전송한다.
    $("#userInfoForm").submit(function(e) {
        e.preventDefault();

        socket.emit("login", {
          name: $userName.val()
        });
        $userName.val("");

        $("#login").hide();
        $("#roomList").show();
    });

    $("#createRoom").click(function(e) {
      $("#createRoomForm").toggle();
    });

    // 서버로 룸 정보를 전송한다.
    $("#createRoomForm").submit(function(e) {
        e.preventDefault();

        socket.emit("room", {
          room: $roomName.val()
        });
        $roomName.val("");

        // $("#roomList").hide();
        $("#createRoomForm").hide();
        // $("#chat").show();
    });

    // 서버로부터의 메시지가 수신되면
    socket.on("login", function(data) {
      $("#chatLogs").append("<div><strong>" + data + "</strong> 님이 입장하였습니다.</div>");
    });

    // 서버로부터의 메시지가 수신되면
    socket.on("room", function(data) {
      console.log("room data : ", data);
      $("#noRoom").hide();
      $("#roomListUl").append("<li>" + data + "</li>");
    });

    // 서버로부터의 메시지가 수신되면
    socket.on("chat", function(data) {
      $("#chatLogs").append("<div><strong>[" + data.userInfo.name + "]</strong> :" + data.msg + "</div>");
    });

    // 서버로 메시지를 전송한다.
    $("#messageForm").submit(function(e) {
      e.preventDefault();

      socket.emit("chat", {
        msg: $msgForm.val()
      });
      $msgForm.val("");
    });

    function makeRandomName(){
      var name = "";
      var possible = "abcdefghijklmnopqrstuvwxyz";
      for( var i = 0; i < 3; i++ ) {
        name += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return name;
    }
  });