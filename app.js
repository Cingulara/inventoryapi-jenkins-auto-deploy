var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Constants for the web server
const PORT = 8080;
const HOST = '0.0.0.0';

var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');

// App
var app = express();

//app.get('/', (req, res) => {
//  res.send('Hello world\n');
//});

var swaggerUi = require('swagger-ui-express'), swaggerDocument = require('./swagger.json');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
//app.use('/users', usersRouter);
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/v1', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// development error handler
// will print stacktrace
//if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status( err.code || 500 )
    .json({
      status: 'error',
      message: err
    });
  });
//}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500)
  .json({
    status: 'error',
    message: err.message
  });
});

// make the application listen on the port/host
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

module.exports = app;
