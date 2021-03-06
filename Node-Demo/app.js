
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs  = require('express-handlebars');

// var routes = require('./routes/index');
// var users = require('./routes/user');

var request = require('request-json');
var helmet = require('helmet');

require('dotenv').config();

//get the base dir
global.base_dir = __dirname;
//loading config
require('./cfg/default');

var app = express();

//security
app.use(helmet());



var env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';

// view engine setup

// app.engine('handlebars', exphbs({
//   defaultLayout: 'main',
//   partialsDir: ['views/partials/']
// }));
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'handlebars');

app.engine('.html', exphbs({
  extname: '.html',
  defaultLayout:'template'
}));
app.set('view engine', '.html');


// app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//loading filter
var filter = require(cerberus.requestFilter);

// app.use(filter());

app.get('/', function(req, res){
  res.send("<script>location.href='/CERBERUS'</script>")
})
app.use('/CERBERUS', require(cerberus.rootRouter));

// app.use('/', routes);
// app.use('/users', users);


/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            title: 'error'
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
    });
});

app.set('port', process.env.PORT || 5080);

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});


// module.exports = app;
