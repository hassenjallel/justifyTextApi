var createError = require('http-errors');
var express = require('express');
var path = require('path');
const bodyParser = require('body-parser')

var cookieParser = require('cookie-parser');
var logger = require('morgan');
//var dotenv =require ('dotenv');
var dotenv =require ('dotenv');
var User = require("./routes/users")
dotenv.config();

const mongoose = require('mongoose');

var app = express();

mongoose.connect( "mongodb://localhost:27017/tictacTest-db", {
  useUnifiedTopology: true
});

mongoose.connection.once('open',function(){
  console.log('connection has been  made ');
}).on('error',function(error){
  console.log('error is : ',error);
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'twig');

app.enable('trust proxy')

app.use(logger('dev'));
app.use(express.json({limit: '700mb'}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.text());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', User);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
//Port-config
const port =  5000;
app.get("/", (req, res) => res.send(" rad is ready ...."));
app.listen(port, () => console.log(`serve at http://localhost:${port}`));

module.exports = app;
