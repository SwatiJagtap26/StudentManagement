const express = require('express')
const router = express.Router()
const Student = require('../../models/Student')
const { isEmpty, uploadDir } = require("../../helpers/upload-helpers");
const fs = require('fs')
const {userAuthenticated} = require('../../helpers/authentication')



router.all('/*',userAuthenticated, (req, res , next)=>{
    req.app.locals.layout = 'admin';
    next()
})

router.get('/' ,(req, res) =>{
    res.render('admin/index')
})

router.get('/dashboard', (req, res)=>{
    res.render('admin/dashboard')
})

// getting all details from student
// all details


router.get('/allDetails', (req, res) =>{
    Student.find({}).lean().then(students =>{
        res.render('admin/alldetails' ,{students: students})
    })
    
})
router.get('/edit/:id', (req, res) =>{
//   res.send(req.params.id)
Student.findOne({_id:  req.params.id}).lean().then(student =>{
    res.render('admin/edit' ,{student: student})
})
    
})

// for updating data using put method
router.put('/edit/:id', (req, res) =>{
    Student.findOne({_id:  req.params.id})
    .then((student) =>{
        
        student.name = req.body.name;
        student.mobile = req.body.mobile;
        student.email = req.body.email;
        student.address = req.body.address;
        student.courses = req.body.courses;
    
       // to update images

    let file = req.files.file;
    let filename = Date.now()+'-' +file.name;

  if (!isEmpty(req.files)) {
    student.file =filename
    file.mv("./public/uploads/" + filename, (err) => {
      if (err) throw err;
    });
    console.log('is not empty')
   }
  else{
    console.log('is  empty')
  }


        student.save().then((upadatedStudent) =>{
            res.redirect('/admin/alldetails')
            console.log(upadatedStudent)
        })
        
        
    })
    
})
router.post('/edit' , (req, res) =>{
    // res.render('/allDetails')
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
    console.log(savedStudent)  
    res.redirect('/admin/allDetails')
   }).catch(error =>{
    console.log('could not save student')
   })


})


// deleting records
router.delete("/edit/:id", (req, res) =>{
    Student.findOne({_id: req.params.id})
    .then(student =>{
        fs.unlink(uploadDir + student.file , (err)=>{
        student.remove();
        res.redirect("/admin/allDetails")
        }) 
       
    })
})


// admin creating records of student
router.get('/create', (req, res) =>{
    res.render('admin/create')
})
router.post('/create' , (req, res)=>{
  // form validation 
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
    res.render('admin/create',{
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
    res.redirect('/admin/allDetails')
   }).catch(error =>{
    console.log(error,'could not save student')
   })
  }
    // console.log(req.body);
});

router.get('/profile/:id' ,(req, res) =>{
  Student.find({_id: req.params.id}).lean().then(students =>{
       res.render('admin/profile' ,{students: students})
      // console.log(students)
  })
 
})

module.exports = router;