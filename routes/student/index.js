const express = require('express');
const router = express.Router();

const Student = require('../../models/Student')
const { isEmpty } = require("../../helpers/upload-helpers");

// const {userAuthenticated} = require('../../helpers/authentication')


// sidebar
router.all("/*", (req, res, next) => {
    req.app.locals.layout = "student";
    next();
  });

// students
router.get('/' ,(req, res) =>{
    Student.find({}).lean().then(students =>{
        res.render('student/index' ,{students: students})
    })
    
});
// creating students
router.get('/create' ,(req, res) =>{
    res.render('student/create')
});


router.post('/create' , (req, res)=>{

    let errors = []
    if(!req.body.name){
      errors.push({message:'Please add a name '})
    }
    if(!req.body.mobile){
      errors.push({message:'Please add a mobile number '})
    }
    if(!req.body.email){
      errors.push({message:'Please add a email address'})
    }
    if(!req.body.address){
      errors.push({message:'Please add an address '})
    }
   
    if(!req.body.courses){
      errors.push({message:'Please select a course '})
    }



  if(errors.length > 0){
    res.render('student/create',{
      errors: errors

      
    })
    console.log(errors)
  }else{
    let file = req.files.file;
    let filename = Date.now()+'-' +file.name;

  if (!isEmpty(req.files)) {


    //to save image in upload folder
    file.mv("./public/uploads/" + filename, (err) => {
      if (err) throw err;
    });
    console.log('is not empty')
   }
  else{
    console.log('is  empty')
  }


   const newStudent = new Student({
        name: req.body.name,
        mobile: req.body.mobile,
        email: req.body.email,
        address: req.body.address,
        courses: req.body.courses,
         file: filename

    })
   newStudent.save().then(savedStudent =>{
    req.flash('success_message', `Student data ${savedStudent.name} was created Successfully `)
    console.log(savedStudent)  
    res.redirect('/student')
   }).catch(error =>{
    console.log('could not save student')
   })

    // console.log(req.body);
}
});

// profile

// router.get('/profile' ,(req, res) =>{
//     res.render('home/student/profile')
// })

// router.get('/profile/:id' ,(req, res) =>{
//     Student.find({_id: req.params.id}).lean().then(students =>{
//          res.render('student/profile' ,{students: students})
//         // console.log(students)
//     })
   
// })


module.exports = router;


