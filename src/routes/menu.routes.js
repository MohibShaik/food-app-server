const menuController = require('../controllers/menu.controller');
var express = require('express');
var router = express.Router();
const { verifySignUp } = require('../middleware');

const { storage } = require('../../storage/storage');
const multer = require('multer');
const upload = multer({ storage });
require('dotenv').config();

const menuRoute = (router) => {
  router.post(
    '/menuCategory',
    menuController.saveNewMenuCategory
  );
  router.post(
    '/menuItem',
    upload.single('file'),
    menuController.saveNewMenuItem
  );
  router.get(
    '/menuCategories',
    menuController.getMenuCategories
  );
  router.get('/menu', menuController.getMenu);
  router.post(
    '/:menuItemId/update',
    menuController.updateMenuItem
  );
  router.delete(
    '/:menuItemId/delete',
    menuController.deleteMenuItem
  );
};

exports.menuRoute = menuRoute;
