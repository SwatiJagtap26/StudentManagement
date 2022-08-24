const express = require('express');
const app = express();
const path = require('path')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const {mongoDbUrl} = require("./config/database")
const bodyParser = require('body-parser')
const upload = require('express-fileupload')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
// const swaggerJSDoc = require('swagger-jsdoc')
// const swaggerUI = require('swagger-ui-express')
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');


// to connect mongodbUrl
mongoose.Promise = global.Promise;

mongoose
  .connect(mongoDbUrl)
  .then((db) => {
    console.log("Mongo connected");
  })
  .catch((error) => console.log(error));



//joining css using public
app.use(express.static(path.join(__dirname, 'public')));


// swagger



app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));











//registering function from handlebars

const {select} = require('./helpers/handlebar-helpers')

//middlewares 
app.engine('handlebars', exphbs.engine({defaultLayout: 'home', helpers:{select: select}} ))
app.set('view engine' ,'handlebars')
// to used req. body we need this middleware
app.use(express.urlencoded({ extended: true }));

// upload middleware for images
app.use(upload());

// body parser
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


// method Override
app.use(methodOverride('_method'))


// session 
app.use(
  session({
    secret: "swatijagtapIloveCoding",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

//passport
app.use(passport.initialize());
app.use(passport.session());


//local variables using Middleware
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.success_message = req.flash("success_message");
  res.locals.error_message = req.flash("error_message");
  res.locals.form_errors = req.flash("form_errors");
  res.locals.error = req.flash("error");
  next();
});



// load routes
const home = require("./routes/home/index")
const admin = require('./routes/admin/index')
const student = require('./routes/student/index')
 

// use routes
app.use('/', home)
app.use('/admin', admin)
app.use('/student',student)





app.listen(4500 ,()=>{
   console.log('listening on port 4500')
})