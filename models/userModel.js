const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
   firstname:{
      type:String,
      required:[true,'Please enter fname']
    },
    lastname:{
      type:String,
      required:[true,'Please enter lname']
    },
   street:{
    type:String,
    required:[true,'Please enter street']
   },
   city:{
      type:String,
      required:[true,'Please enter city']
     },
   email:{
    type:String,
    required:[true,'Please enter email'],
    unique:true,
    validate: [validator.isEmail, 'Please enter valid email address']

   },
   password:{
    type:String,
    required:[true,'Please enter password'],
    maxlength:[8,'Paassword cannot exceed 8 charector'],
    select:false
   },
 
   avatar:{
    type:String
   
   },
   role :{
    type: String,
    default:'user'
},
phone:{
   type:String,
   required:[true,'Please enter phone-no'],
   unique:true,
  },
   resetPasswordToken:String,

   resetPasswordTokenExpire:Date,
   
   createdAt:{
    type:Date,
    default:Date.now 
   },
})

userSchema.pre('save',async function(next){
     this.password = await bcrypt.hash(this.password, 10) 
})

userSchema.methods.jwtToken = function(){
       return jwt.sign({id: this.id}, process.env.JWT_SECRET, {expiresIn:process.env.JWT_EXPIRES_TIME}
      );

}
userSchema.methods.isValidPassword = async function(enteredPassword){
  return bcrypt.compare(enteredPassword, this.password)
}

userSchema.methods.getResetPassword = function()
{
 const token = crypto.randomBytes(20).toString('hex');
 //Generate Hash and set to resetPasswordToken
   this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
   // set token expire time
   this.resetPasswordToken = Date.now() + 30 * 60 *1000
   return token
}

let model = mongoose.model('User',userSchema)
module.exports = model