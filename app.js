const path = require('path');

const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const nunjucks = require('nunjucks');

const indexRouter = require('./routes');


const app = express();
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'html');

nunjucks.configure('views', {
  express: app,
  watch: true,
})

// middlewares
app.use(morgan('dev')); // For logging

app.use(express.json()); // to get request body
app.use(express.urlencoded({ extended: false })); // to get request body

app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'dev',  // usually set it with dotenv for security
  cookie: {
    httpOnly: true,
    secure: false  // true only works with https
  },
  name: 'session-cookie' // default: connect.sid
}))

// routes
app.use('/', indexRouter);

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중...');
});