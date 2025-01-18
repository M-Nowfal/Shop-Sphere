let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let db = require('./config/connection');
let { engine } = require('express-handlebars');
let fileUp = require('express-fileupload');
let session = require('express-session');

let indexRouter = require('./routes/index');
let sellersRouter = require('./routes/sellers');
let usersRouter = require('./routes/users');
let adminRouter = require('./routes/admin');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views/partials'));
app.set('view engine', 'hbs');
app.engine('hbs', engine({
	extname: 'hbs',
	defaultLayout: 'layout',
	layoutsDir: __dirname + '/views/layout/',
	partialsDir: __dirname + '/views/partials',
	helpers:{
		add:(x,y)=>x+y
	}
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUp());
app.use(session({
	secret: 'sHop*sPheRe',
	resave: false,
	saveUninitialized: false,
	cookie: {
		maxAge: 60 * 60 * 1000,
		secure: false
	}
}));

db.connect((err)=>{
	if(err){
		console.log("Data Base Connection Error!", err);
	}else{
		console.log("Data Base Connected Successfully");
	}
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/sellers', sellersRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
