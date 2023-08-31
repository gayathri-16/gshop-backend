const Product = require('../models/productModel')
const Category = require('../models/categoryModel')
const ErrorHandler = require('../utils/errorHandler')

const catchAsyncError = require('../middlewares/catchAsyncError')
const APIFeatures = require('../utils/apiFeatures')

exports.readByCount =catchAsyncError(async (req, res) => {
	try {
		const products = await Product.find({})
			.populate('category', 'category')
			.limit(6);

		res.json({ products });
	} catch (err) {
		console.log(err, 'productController.readAll error');
		res.status(500).json({
			errorMessage: 'Please try again later',
		});
	}
});


exports.readAllProduct = catchAsyncError (async (req, res) => {

      //all categories ids
      let ids = [];
      const categ = await Category.find({}, { _id: 1 });
      categ.forEach(cat=>{
        ids.push(cat.id)
      })

      //filter

      let cat = req.query.cat;
      let query = cat !== '' ? req.query.cat: ids
  
      
   
	try {

		// const products = await Product.find({category:query}).populate(
		// 	'category',
		// 	'category'
		// );
    const products = await Product.find({}).populate('category','category')
    // const filterproducts = await Product.find({category:query})


    console.log(products);
    // console.log(filterproducts);

    // console.log('filtered Product',filterProducts);
		res.status(200).json({ 
      products,Category ,    
    });
    // console.log(products, Category);
	} catch (err) {
		console.log(err, 'productController.readAll error');
		res.status(500).json({
			errorMessage: 'Please try again later',
		});
	}
});


//Get Products - {{base_url}}/api/v1/products
// exports.getProducts= catchAsyncError(async (req,res,next)=>{
//   const resPerPage = 8;
//   const apiFeatures = new APIFeatures(Product.find(), req.query).search().filter().paginate(resPerPage);
//   const products  = await  apiFeatures.query;
   
//   await new Promise(resolve => setTimeout(resolve,1000));

//   //all categories Ids

//   let ids = []

//   const categ = await Category.find({},{_id:1})
//   categ.forEach(cat=>{
//     ids.push(cat._id)
//   })

//   // filter 
//   let cat = req.query.cat;
//   let query = cat !== ''? cat : ids


//    try{
//        const productsCategory = await Product.find({category:query}).populate('category', 'name')
   
//   res.status(200).json({
//         success:true,
//         count:products.length,
//         products,
//         productsCategory,
//         query

//     })
//   }
//   catch(error){
//     console.log(error);
//   next(error);
//   }
// })

//Create Product - {{base_url}}/api/v1/product/new
exports.newProduct = catchAsyncError(async(req,res,next)=>{

let images = []
if(req.files?.length > 0) {
req.files.forEach( file => {
    let url = `${process.env.BACKEND_URL}/uploads/product/${file.originalname}`;
    images.push({ image: url })
})
}


   const {
    name,
    price,
    description,
    mrpPrice,
    productcode,
    deliveryCharge,
    productCategory
   } = req.body

   try{
    let product = new Product();
    product.name = name;
    product.price = price;
    product.description = description;
    product.productCategory = productCategory;
    product.mrpPrice = mrpPrice;
    product.productcode = productcode;    
    product.deliveryCharge = deliveryCharge;
    product.images = images

 await product.save();

 res.status(201).json({
  sucess:true,
  product
})
   }
   catch (err) {
		console.log(err, 'productController.create error');
		res.status(500).json({
			errorMessage: 'Please try again later',
		});
	}
 
    
  // req.body.user= req.user.id;


});


//Get single product {{base_url}}/api/v1/product/:id
exports.getSingleProduct = async (req,res,next)=>{
 const product = await Product.findById(req.params.id);
  if(!product){
   return next(new ErrorHandler('Product not found test',400))
  }
  await new Promise(resolve => setTimeout(resolve,1000));
  res.status(201).json({
    sucess:true,
    product
  })

}
//Update Product {{base_url}}/api/v1/product/:id
exports.updateProduct = async (req,res,next)=>{
  let product = await Product.findByIdAndUpdate(req.params.id);
 // uploading images
 let images = []
  // if images not cleared we keep exisiting images
  if(req.body.imagesCleared === 'false'){
    images = product.images
  }


 if(req.files?.length > 0) {
  req.files.forEach( file => {
      let url = `${process.env.BACKEND_URL}/uploads/product/${file.originalname}`;
      images.push({ image: url })
  })
}

req.body.images = images;

  if(!product){
    return res.status(404).json({
     success:false,
     message:"Product not found"
   })
 }

 product = await Product.findByIdAndUpdate(req.params.id,req.body,{
  new:true,
  runValidators:true
 })

 res.status(201).json({
  sucess:true,
  product
})
}

//deleteProduct -
exports.deleteProduct = async (req,res,next)=>{
    
  const product = await Product.findById(req.params.id);
  if(!product){
     return res.status(404).json({
      success:false,
      message:"Product not found"
    })
  }
   
  await product.deleteOne();


  res.status(201).json({
    sucess:true,
    message:"Product Deleted"
  })
}

// Create Review - api/v1/review

exports.createReview = catchAsyncError(async(req,res,next)=>{
   const {productId, rating, comment} = req.body
   const review ={
    user : req.user.id,
    rating,
    comment
   }

   const product = await Product.findById(productId);
   // finding user already review
   const isreviewed = product.reviews.find(review=>{
   return review.user.toString() ==  req.user.id.toString()
     })
     
     if(isreviewed){
      //updating the review
       product.reviews.forEach(review =>{
        if(review.user.toString()== req.user.id.toString()){
          review.comment = comment
          review.rating = rating
        }
       })

     } else{
      //creating the review
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
     }
// find the avarage of the products reviews
     product.ratings = product.reviews.reduce((acc, review) =>{
      return review.rating + acc;
     },0) / product.reviews.length; 
     product.ratings = isNaN(product.ratings)? 0 : product.ratings
    await product.save({validateBeforeSave:false})
    res.status(200).json({
      sucess:true,

    })
    })
// Get Reviews - api/v1/reviews?id={productId}
exports.getReviews = catchAsyncError(async(req,res,next)=>{
  const product = await Product.findById(req.query.id)

  res.status(200).json({
    success:true,
    reviews:product.reviews
  })
})
//Delete Review - api/v1/review

exports.deleteReview = catchAsyncError(async(req,res,next)=>{
  const product = await Product.findById(req.query.productId);
  // filtering the reviews dose not match review id
  const reviews = product.reviews.filter(review=>{
   return review._id.toString() !== req.query.id.toString()
  })
  
  const numOfReviews = reviews.length;
  //finding the average with the filtered reviews
  let ratings = reviews.reduce((acc, review) =>{
    return review.rating + acc;
   },0) / reviews.length; 
   ratings = isNaN(ratings)? 0 :ratings
   //update product review after delete
   await Product.findByIdAndUpdate(req.query.productId, {
    reviews,
    numOfReviews,
    ratings
   })

  res.status(200).json({
    success:true,
   
  })
})

//get admin products - api/v1/admin/products
exports.getAdminProducts = catchAsyncError(async(req,res,next)=>{
      const products = await Product.find()
      res.status(200).send({
        success:true,
        products
      })

  })
  