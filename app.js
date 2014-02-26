
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var admin = require('./routes/admin');
var http = require('http');
var path = require('path');
var passport = require('passport');
var DigestStrategy = require('passport-http').DigestStrategy;

var users = [
    { username: 'admin', password: 'admin' }
];

function checkUser(username, fn) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.username === username) {
      return fn(null, user);
    }
  }
  return fn(null, null);
}

passport.use(new DigestStrategy({ qop: 'auth' },
  function(username, done) {
    findByUsername(username, function(err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      return done(null, user, user.password);
    })
  },
  function(params, done) {
    process.nextTick(function () {
      return done(null, true);
    });
  }
));
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(passport.initialize());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/admin', passport.authenticate('digest', { session: false }), admin.index);

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
var io = require('socket.io').listen(server);


io.sockets.on('connection', function (socket) {
  console.log("New connection");

  socket.on('next', function (data)
  {
    console.log("Received a NEXT");
    socket.emit('next'); // Send message to sender
    socket.broadcast.emit('next'); // Send message to everyone BUT sender
  });

  socket.on('prev', function (data) {
    console.log("Received a PREV");
    socket.emit('prev'); // Send message to sender
    socket.broadcast.emit('prev'); // Send message to everyone BUT sender
  });
});
