const express = require('express');

const  {isAuthenticatedUser, authorizeRoles } = require('../middlewares/authenticate')
const router = express.Router();
const multer = require('multer')
const path = require('path');
const { getCategories, getSingleCategory, newCategory, updateCategory, deleteCategory, getAdminCategories, getActiveCategory } = require('../controllers/categoryController');


const upload = multer({storage: multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join( __dirname,'..' , 'uploads/images' ))
    },
    filename: function(req, file, cb ) {
        cb(null, file.originalname)
    }
}) })

router.route('/category').get(getCategories);
router.route('/category/:id').get(getSingleCategory);
router.route('/category/active').get(getActiveCategory);

//Admin routes
router.route('/admin/category/new').post( upload.array('images'), newCategory);
router.route('/admin/categories').get(getAdminCategories);
router.route('/admin/category/:id').put(upload.array('images'), updateCategory);
router.route('/admin/category/:id').delete(deleteCategory);
 

module.exports = router;