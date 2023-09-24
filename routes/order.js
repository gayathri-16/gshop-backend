const express = require('express');
const{newOrder, getSingleOrder, myOrders, orders, updateOrder, deleteOrder} = require('../controllers/orderController')
const router = express.Router();
const {isAuthenticatedUser, authorizeRoles} = require('../middlewares/authenticate')

router.route('/order/new').post(newOrder);
router.route('/order/:id').get(isAuthenticatedUser,getSingleOrder);
router.route('/myorders').get(isAuthenticatedUser, myOrders);

//Admin routes

router.route('/admin/orders').get(orders);
router.route('/admin/order/:id').put(updateOrder);
router.route('/admin/order/:id').delete(deleteOrder);
module.exports = router