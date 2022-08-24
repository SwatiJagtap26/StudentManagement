const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const StudentSchema = new Schema({


// user:{
//   type: Schema.Types.ObjectId,
//      ref: 'users'
// },
name:{
  type: String,
  required: true,
},
 mobile:{
  type: Number,
  required: true,
 },
 email:{
  type: String,
  required: true,
 },
 address:{
  type: String,
  required: true,
 },

   file:{
    type: String,
    
   } ,
  courses:{
    type: String,
    default: 'nodejs'
  },
});

module.exports = mongoose.model('students', StudentSchema);

