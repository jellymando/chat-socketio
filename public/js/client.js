$(function(){
    // socket.io 서버에 접속한다
    var socket = io();
    var $userName = $("#userName");
    var $msgForm = $("#msgForm");
    var $roomId = 0;
    var $roomName = $("#roomName");

    // 서버로 자신의 정보를 전송한다.
    $("#userInfoForm").submit(function(e) {
        e.preventDefault();

        socket.emit("login", {
          name: $userName.val()
        });
        // $userName.val("");

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
          roomId: $roomId++,
          roomName: $roomName.val()
        });
        $roomName.val("");

        $("#createRoomForm").hide();
    });

    $(document).on("click", ".room", function(e) {
      e.preventDefault();
      var roomId = $(this).attr("data-id");
      socket.emit("join", {
        room: roomId,
        userName: $userName.val()
      });
    });

    socket.on("login", function(data) {
    });

    socket.on("room", function(data) {
      console.log("room data : ", data);
      $("#noRoom").hide();
      $("#roomListUl").append("<li class='room' data-id=" + data.roomId + ">" + data.roomName + "</li>");
    });

    socket.on("join", function(data) {
        $("#roomList").hide();
        $("#chat").show();
        $("#chatLogs").append("<div><strong>" + data + "</strong> 님이 입장하였습니다.</div>");
    });

    socket.on("chat", function(data) {
      $("#chatLogs").append("<div><strong>[" + data.userInfo.name + "]</strong> :" + data.msg + "</div>");
    });

    $("#messageForm").submit(function(e) {
      e.preventDefault();

      socket.emit("chat", {
        msg: $msgForm.val()
      });
      $msgForm.val("");
    });
  });