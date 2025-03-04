const notificationController = require('../controllers/notification.controller');
var express = require('express');
var router = express.Router();
const { verifySignUp } = require('../middleware');

const notificationRoute = (router) => {
  router.post(
    '/sendQuery',
    notificationController.sendNewQuery
  );

  router.post(
    '/subscribe',
    notificationController.newSubscriber
  );

  router.post(
    '/schedule',
    notificationController.saveNewSchedule
  );

  router.get(
    '/schedule/list',
    notificationController.getSchedules
  );

  router.get(
    '/schedule/today',
    notificationController.getCurrentDateSchedule
  );
};

exports.notificationRoute = notificationRoute;
