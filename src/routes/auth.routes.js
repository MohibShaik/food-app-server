const authController = require('../controllers/auth.controller');
var express = require('express');
var router = express.Router();
const { verifySignUp } = require('../middleware');

const loginRoute = (router) => {
  router.post(
    '/auth/signup',
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
    ],
    authController.saveNewUser
  );

  router.post(
    '/auth/signin',
    authController.signin
  );

  router.post(
    '/auth/verify-otp',
    authController.verifyOTP
  );

  router.get(
    '/auth/getAllUsers',
    authController.getAllUsers
  );
};

exports.loginRoute = loginRoute;
