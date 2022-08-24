
const express = require('express');
const router = express.Router();
const User = require('../../models/users');
const bcrypt = require("bcryptjs");
const passport = require('passport');


const localStrategy = require('passport-local').Strategy;



// sidebar
router.all("/*", (req, res, next) => {
    req.app.locals.layout = "home";
    next();
  });

//   router.get('/dashboard', (req, res)=>{
//     res.render('home/student/dashboard')
// })


router.get('/',(req, res) =>{

    res.render("home/index")
})
router.get('/register', (req, res)=>{
    res.render('home/register')
})
router.post('/register' , (req, res)=>{



  let errors = []
    if(!req.body.firstName){
      errors.push({message:'Please add a  first name '})
    }
    if(!req.body.lastName){
      errors.push({message:'Please add a last name '})
    }
    if(!req.body.email){
      errors.push({message:'Please add a email address'})
    }
    if(!req.body.password){
      errors.push({message:'this field cannot be empty'})
    }
   
   


  if(errors.length > 0){
    res.render('home/register',{
      errors: errors,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
 });
    console.log(errors)
  }else{
    User.findOne({ email: req.body.email }).then((user) => {
      if (!user) {
      const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: (req.body.password) 
      });


      bcrypt.genSalt(10, (err,salt)=>{
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          newUser.password = hash;
          newUser.save().then(savedUser =>{ 
            req.flash(
              "success_message",
              "You are now registered, please login"
            );
            res.redirect('/login')
          });
        }) 
      })
      }else{
        req.flash('error_message','that email exist please login')
        res.redirect('/login')
      }
    })
  }
})
// App Login
router.get('/login' , (req, res, )=>{
    res.render('home/login')
})


 passport.use(new localStrategy({usernameField: 'email'}, (email, password, done)=>{
    console.log(email);
    User.findOne({email : email}).then(user =>{
       if(!user) return done(null, false, {message: 'No user Found'});
        //user.testMethod();
        bcrypt.compare(password, user.password, (err, matched) =>{
          if(err) return err;
          if(matched){
            return done(null, user)
          }
          else{
            return done(null, false , {message: 'Incorrect password.'})
          }
        })
    
    })
  }));
  passport.serializeUser(function(user, done){
    done(null, user.id);
  });
  passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
      done(err, user)
    })
  })


router.post('/login' , (req, res, next)=>{
    passport.authenticate('local',{
      
        successRedirect: '/admin',
       failureRedirect: '/login',
        failureFlash: true
        

    })(req, res, next)
    // res.render('home/student/index')
    
})
// logout

router.get("/logout" , (req, res)=>{
    req.logout(function(err) {
        if (err) { 
          return next(err); 
          }
        res.redirect('/login');
      });
    
})




module.exports = router;


