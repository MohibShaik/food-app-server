const orderController = require('../controllers/order.controller');
var express = require('express');
var router = express.Router();
// const middleware = require('../middleware/middleware');

const orderRoute = (router) => {
  router.post('/order', orderController.saveNewOrder);
  router.get('/order-info', orderController.getOrderById);
  router.post(
    '/order/updateOrderStatus',
    orderController.updateOrderStatus
  );
  router.get('/orders', orderController.getOrderByUserId);
  router.post('/orders', orderController.getAllOrders);

  //   router.post('/auth/signin', orderController.signin);

  //   router.post('/auth/verify-otp', orderController.verifyOTP);
};

exports.orderRoute = orderRoute;
