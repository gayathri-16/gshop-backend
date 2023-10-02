const Category = require('../models/categoryModel')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncError = require('../middlewares/catchAsyncError')
const APIFeatures = require('../utils/apiFeatures')
//Get Categories - {{shop_url}}/api/v1/categories
exports.getCategories= catchAsyncError(async (req,res,next)=>{
  const resPerPage = 8;
  const {category} = req.body
  const apiFeatures = new APIFeatures(Category.findOne({category}), req.query).search().filter().paginate(resPerPage);
  const categories  = await  apiFeatures.query;
   
  await new Promise(resolve => setTimeout(resolve,1000));

    if(categories){
      return res.status(400).json({
        errorMessage:`${category}alredy exists`
      })
    }
  res.status(200).json({
        success:true,
        count:categories.length,
        categories
    })
})

// Create Category - {{shop_url}}/api/v1/category/new
exports.newCategory = catchAsyncError(async(req,res,next)=>{
   let images = []
   let BASE_URL = process.env.BACKEND_URL;
   if(process.env.NODE_ENV === "production"){
       BASE_URL = `${req.protocol}://${req.get('host')}`
   }
   if(req.files.length > 0) {
    req.files.forEach( file => {
        let url = `${BASE_URL}/uploads/images/${file.originalname}`;
        images.push({ image: url })
    })
}

req.body.images = images;
    
//   req.body.user= req.user.id;
 const {category} = req.body;
try{
  const categoryExist = await Category.findOne({category});
  if(categoryExist){
    return res.status(400).json({
      errorMessange:`${category} alredy exists`
    });

  }
  let newCategory = new Category();
  newCategory.category = category;
  newCategory = await newCategory.save();

  res.status(201).json({
    sucess:`${newCategory.category} was created!`,
    category:newCategory,

  })
}
catch(err){
  console.log('Category create error:',err)
  res.status(500).json({
    errorMessange:'Please try again later'
  })
}

});
exports.readAll = async (req, res) => {
	try {
		const categories = await Category.find({});

		res.status(200).json({
			categories,
		});
	} catch (err) {
		console.log('category readAll error: ', err);
		res.status(500).json({
			errorMessage: 'Please try again later',
		});
	}
};
exports.getActiveCategory = async (req, res) => {
	try {
		const categories = await Category.find({isActive:true});

		res.status(200).json({
			categories,
		});
	} catch (err) {
		console.log('category readAll error: ', err);
		res.status(500).json({
			errorMessage: 'Please try again later',
		});
	}
};

//Get single category {{base_url}}/api/v1/product/:id
exports.getSingleCategory = async (req,res,next)=>{
 const category = await Category.findById(req.params.id);
  if(!category){
   return next(new ErrorHandler('Product not found test',400))
  }
  await new Promise(resolve => setTimeout(resolve,1000));
  res.status(201).json({
    sucess:true,
    category
  })

}
//Update Category {{base_url}}/api/v1/product/:id
exports.updateCategory = async (req,res,next)=>{
  let category = await Category.findByIdAndUpdate(req.params.id);
 // uploading images
 let images = []
  // if images not cleared we keep exisiting images
  if(req.body.imagesCleared === 'false'){
    images = category.images
  }
  let BASE_URL = process.env.BACKEND_URL;
  if(process.env.NODE_ENV === "production"){
      BASE_URL = `${req.protocol}://${req.get('host')}`
  }

  if(req.files?.length > 0) {
    req.files.forEach( file => {
        let url = `${BASE_URL}/uploads/images/${file.originalname}`;
        images.push({ image: url })
    })
}

req.body.images = images;

  if(!category){
    return res.status(404).json({
     success:false,
     message:"Product not found"
   })
 }

 category = await Category.findByIdAndUpdate(req.params.id,req.body,{
  new:true,
  runValidators:true
 })

 res.status(201).json({
  sucess:true,
  category
})
}

//deleteCategory -
exports.deleteCategory = async (req,res,next)=>{
    
  const category = await Category.findById(req.params.id);
  if(!category){
     return res.status(404).json({
      success:false,
      message:"Product not found"
    })
  }
   
  await category.deleteOne();


  res.status(201).json({
    sucess:true,
    message:"Product Deleted"
  })
}


//get admin Categories - api/v1/admin/products
exports.getAdminCategories = catchAsyncError(async(req,res,next)=>{
      const categories = await Category.find()
      res.status(200).send({
        success:true,
        categories
      })

  })
  