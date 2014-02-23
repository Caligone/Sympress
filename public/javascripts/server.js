(function ( document, window ) {
  var socket = io.connect('http://localhost');
  var nextEl = document.getElementById('next');
  var prevEl = document.getElementById('prev');

  nextEl.onclick = function() {
    console.log("Next !");
    socket.emit('next');
  };
  prevEl.onclick = function() {
    console.log("Prev !");
    socket.emit('prev');
  };
})(document, window);
