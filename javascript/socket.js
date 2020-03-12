// 创建socket对象，负责进行socket通信，以及监听socket事件
let WS = function (opts) {
  var params = {
      sessionid: opts.user.sessionId,
      platform: 1,
      terminal: 0
  };

  if (window.location.protocol === "https:") {
      params.secure = true;
  }

  var host = opts.chat.host;
  var spareHost = opts.chat.spareHost;
  var socket = io.connect(SocketUtils.getConnectURI(host, opts.roomId), {
      query: params
  });

  // 重连失败，更换为备用线路
  new SocketSentinel(socket, SocketUtils.getConnectURI(spareHost, opts.roomId));

  // 验证成功
  socket.on("connect", function () {
      try {
          
      } catch (e) {
          
      }
  });

  socket.on("authorized", function () {
      try {
          socket.emit("room_user_count");
      } catch (e) {
      }
  });


  // 直播间信息
  socket.on("room_context", function (data) {
      data = JSON.parse(data);
      if(data){
        opts.render(data);
      }
  });

  // 循环调用room_user_count事件，定时（15s）返回当前在线人数；
  // 循环调用room_context事件，定时（15s）返回当前直播间信息；
  // 1.5秒后返回当前在线人数
  // 1.5秒后返回当前直播间信息
  setTimeout(function () {
      try {
          socket.emit("room_user_count");
      } catch (e) {
          // TODO 错误处理
      }
      try {
          socket.emit("room_context");
      } catch (e) {
          // TODO 错误处理
      }

  }, 1500);
  setInterval(function () {
      try {
          socket.emit("room_user_count");
      } catch (e) {
          // TODO 错误处理
      }
      try {
          socket.emit("room_context");
      } catch (e) {
          // TODO 错误处理
      }
  }, 15000);

};