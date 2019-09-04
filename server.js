var express = require('express');
var session = require('express-session');
const config = require('./server/config/config.js');
const cors = require('cors');

var app = express();
app.use(cors());

app.use(session({ cookie: { maxAge: 60000 },
                  secret: 'woot',
                  resave: false,
                  saveUninitialized: false}));

var bodyParser = require('body-parser');

app.use(bodyParser.json());

var path = require('path');
app.use(express.static(path.join(__dirname, './static')));
app.use(express.static( __dirname + '/public/dist/public' ));


require('./server/config/sockets.js');
require('./server/config/routes.js')(app);


app.listen(config.config.app.port, function(){
    console.log('Currently connected to port: ' + config.config.app.port);
});
