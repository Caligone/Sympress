(function ( document, window ) {
  var api = impress();
  var socket = io.connect('http://localhost');
  socket.emit('connection');

  // Next slide packet
  socket.on('next', function (data) {
    api.next();
  });

  // Previous slide packet
  socket.on('prev', function (data) {
    api.prev();
  });
})(document, window);
