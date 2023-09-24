const ErrorHandler = require("../utils/errorHandler");
const User = require('../models/userModel')
const catchAsyncError = require("./catchAsyncError");
const jwt = require('jsonwebtoken');

exports.isAuthenticatedUser = catchAsyncError( async (req, res, next) => {
   const { token  }  = req.cookies;
   
   if( !token ){
        return next(new ErrorHandler('Login first to handle this resource', 401))
   }

   const decoded = jwt.verify(token, process.env.JWT_SECRET)
   req.user = await User.findById(decoded.id)
   next();
})

exports.authorizeRoles = (...roles) => {
    return  (req, res, next) => {
         if(!roles.includes(req.user.role)){
             return next(new ErrorHandler(`Role ${req.user.role} is not allowed`, 401))
         }
         next()
     }
 }     

 exports.isActiveProduct = (...isActive) => {
    return  async(req, res, next) => {
        req.product = await Product.find()
         if(!isActive.includes(req.product.isActive)){
             return next(new ErrorHandler(`Product ${req.product.isActive} is not available`, 401))
         }
         next()
     }
 } 