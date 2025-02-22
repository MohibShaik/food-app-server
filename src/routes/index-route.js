const express = require('express');
const loginRoute = require('./auth.routes');
const menuRoute = require('./menu.routes');
const orderRoute = require('./order.routes');
const notificationRoute = require('./notification.routes');

const routes = (router) => {
  loginRoute.loginRoute(router);
  menuRoute.menuRoute(router);
  orderRoute.orderRoute(router);
  notificationRoute.notificationRoute(router);
  return router;
};

exports.routes = routes;
