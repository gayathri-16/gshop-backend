const express = require('express');
const router = express.Router();

const {getNewArrivals, searchByQueryType} = require('../controllers/filterController')

router.route('/filter').get(getNewArrivals);
router.route('/search').post(searchByQueryType);


module.exports = router;