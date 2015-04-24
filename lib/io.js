module.exports = function(server){
  var io = require('socket.io')(server);

  // catch errors
  io.on('error', function(err){
    throw err;
  })

  // use the socket
  io.on('connection', function (socket) {

  // DO THINGS

  });

  return io;
}
