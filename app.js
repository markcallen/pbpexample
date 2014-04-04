var config = require('./config');
var express = require("express");
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(express);
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var BasicStrategy = require('passport-http').BasicStrategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var crypto = require('crypto');
var uuid = require('node-uuid');
var nodemailer = require("nodemailer");

// Connect to database
mongoose.connect(config.mongodb);

// Setup Express

var app = express();
var server = require('http').createServer(app);
app.configure(function() {
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.methodOverride()); // must come after bodyParser
  app.use(express.session({
    secret:'pbpexample',
    maxAge: new Date(Date.now() + 3600000),
    store: new MongoStore(
        {db: mongoose.connection.db.databaseName, host: mongoose.connection.db.serverConfig.host},
        function(collection){
          if (collection.db.databaseName) {
            console.log('connect-mongodb setup ok. Connected to: ' + collection.db.databaseName);
          } else {
            console.log(collection);
          }
        })
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
});

app.get('/img/*', function (req, res) {
  res.sendfile(__dirname +  '/public' +req.url);
});


server.listen(config.port);
