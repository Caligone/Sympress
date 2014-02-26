(function ( document, window ) {
  var socket = io.connect('http://localhost');
  var nextEl = document.getElementById('next');
  var prevEl = document.getElementById('prev');

  nextEl.onclick = function() {
    socket.emit('next');
  };
  prevEl.onclick = function() {
    socket.emit('prev');
  };
})(document, window);
