const products = require('../data/g-shop-products.json');
const Product = require('../models/productModel');
const dotenv = require('dotenv');
const path = require('path')
const connectDatabase = require('../config/database.js');


dotenv.config({path:path.join(__dirname,"../config/config.env")})
connectDatabase();

const seedProducts = async()=>{
    try{
        await Product.deleteMany();
       console.log('All product deleted');
       await Product.insertMany(products);
       console.log('All product added');
  }
catch(error){
  console.log(error.message);
}
process.exit();
}
seedProducts();