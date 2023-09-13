const express = require('express');
const { getProducts, newProduct, getSingleProduct,updateProduct,deleteProduct, createReview, getReviews, deleteReview, getAdminProducts,readAllProduct } = require('../controllers/ProductController');
const  {isAuthenticatedUser, authorizeRoles } = require('../middlewares/authenticate')
const router = express.Router();
const multer = require('multer')
const path = require('path');



const upload = multer({storage: multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join( __dirname,'..' , 'uploads/product' ))
    },
    filename: function(req, file, cb ) {
        cb(null, file.originalname)
    }
}) })

router.route('/products').get(readAllProduct);
router.route('/product/:id').get(getSingleProduct);
router.route('/review').put(isAuthenticatedUser, createReview);
router.route('/review').delete(isAuthenticatedUser, deleteReview);
router.route('/reviews').get(isAuthenticatedUser, getReviews);

//Admin routes
router.route('/admin/product/new').post(upload.array('images','hoverimages'), newProduct);
router.route('/admin/products').get(getAdminProducts);
router.route('/admin/product/:id').put(upload.array('images','hoverimages'), updateProduct);
router.route('/admin/product/:id').delete(deleteProduct);
 

module.exports = router;