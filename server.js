var express = require('express');
var session = require('express-session');
const config = require('./server/config/config.js');
const cors = require('cors');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();
app.use(cors());

app.use(session({ cookie: { maxAge: 60000 },
                  secret: 'woot',
                  resave: false,
                  saveUninitialized: false}));



app.use(bodyParser.json({limit: '5mb', extended: true}));
app.use(bodyParser.urlencoded({extended: true, limit: '5mb'}));

app.use(express.static(path.join(__dirname, './static')));
app.use(express.static( __dirname + '/public/dist/public' ));
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });

require('./server/config/sockets.js');
require('./server/config/routes.js')(app);



app.listen(config.config.app.port, function(){
    console.log('Currently connected to port: ' + config.config.app.port);
});
