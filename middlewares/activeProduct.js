const Product = require('../models/productModel')
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncError");

exports.isActiveProduct = (...isActive) => {
    return  async(req, res, next) => {
        req.product = await Product.find({})
         if(!isActive.includes(req.product.isActive)){
             return next(new ErrorHandler(`Product ${req.product.isActive} is not available`, 401))
         }
         next()
     }
 } 