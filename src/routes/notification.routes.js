const notificationController = require('../controllers/notification.controller');
var express = require('express');
var router = express.Router();
const { verifySignUp } = require('../middleware');

const notificationRoute = (router) => {
  router.post(
    '/sendQuery',
    notificationController.sendNewQuery
  );
};

exports.notificationRoute = notificationRoute;
