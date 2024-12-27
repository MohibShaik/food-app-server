const utils = require('../utilities/utils');
const menuItemModel = require('../models/menu-item.model');
const menuCategoryModel = require('../models/menu-category.model');
const dotenv = require('dotenv');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const path = require('path');

dotenv.config();

async function saveNewMenuCategory(request) {
  try {
    let newMenuCatInfo = new menuCategoryModel(
      request.body
    );
    let result = await newMenuCatInfo.save();

    if (result) {
      const successResponse = utils.successResposeBuilder(
        request,
        result,
        200,
        'New menu category published successfully'
      );
      return successResponse;
    } else {
      const errorResponse = utils.errorResponseBuilder(
        request,
        {},
        {
          status: 400,
          message:
            'Something went wrong while publishing a menu category, Please try again',
        }
      );
      return errorResponse;
    }
  } catch (error) {
    const errorResponse = utils.errorResponseBuilder(
      request,
      {},
      {
        status: 400,
        message:
          'Something went wrong while publishing a menu category, Please try again',
      }
    );
    return errorResponse;
  }
}

async function saveNewMenuItem(req) {
  try {
    if (req.file.path) {
      var uploadResponse = await cloudinary.uploader.upload(
        req.file.path,
        {
          folder: 'menu',
        }
      );
    }

    // const result = await cloudinary.uploader.upload(req.file.path);

    if (uploadResponse.url) {
      var menuItemReqObj = {
        menuCategoryId: req.body.category,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        quantity: req.body.quantity,
        images: uploadResponse.secure_url,
      };
    } else {
      var menuItemReqObj = {
        menuCategoryId: req.body.category,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        quantity: req.body.quantity,
        images: '',
      };
    }

    let newMenuItemInfo = new menuItemModel(menuItemReqObj);
    let result = await newMenuItemInfo.save();

    if (result) {
      const successResponse = utils.successResposeBuilder(
        req,
        result,
        200,
        'New menu item published successfully'
      );
      return successResponse;
    } else {
      const errorResponse = utils.errorResponseBuilder(
        req,
        {},
        {
          status: 400,
          message:
            'Something went wrong while publishing a menu item, Please try again',
        }
      );
      return errorResponse;
    }
  } catch (error) {
    const errorResponse = utils.errorResponseBuilder(
      req,
      {},
      {
        status: 400,
        message:
          'Something went wrong while publishing a menu item, Please try again',
      }
    );
    return errorResponse;
  }
}

async function getMenuCategories(req) {
  try {
    const result = await menuCategoryModel.find().lean();
    if (result) {
      const successResponse = utils.successResposeBuilder(
        req,
        result,
        200,
        'Menu categories retrived successfully'
      );
      return successResponse;
    }
  } catch (error) {
    const errorResponse = utils.errorResponseBuilder(
      req,
      {},
      {
        status: 400,
        message:
          'Something went wrong while retriving menu categories, Please try again',
      }
    );
    return errorResponse;
  }
}

async function getMenu(req) {
  try {
    const result = await menuItemModel
      .find()
      .populate('menuCategoryId')
      .lean();
    if (result) {
      const successResponse = utils.successResposeBuilder(
        req,
        result,
        200,
        'Menu retrived successfully'
      );
      return successResponse;
    }
  } catch (error) {
    const errorResponse = utils.errorResponseBuilder(
      req,
      {},
      {
        status: 400,
        message:
          'Something went wrong while retriving menu, Please try again',
      }
    );
    return errorResponse;
  }
}

async function updateMenuItem(req) {
  try {
    var menuItemReqObj = {
      menuCategoryId: req.body.category,
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      quantity: req.body.quantity,
    };

    let result = await menuItemModel.findOneAndUpdate(
      {
        _id: req.params.menuItemId,
      },
      {
        $set: menuItemReqObj,
      },
      { upsert: true, new: true }
    );

    if (result) {
      const successResponse = utils.successResposeBuilder(
        req,
        result,
        200,
        'Menu item updated successfully'
      );
      return successResponse;
    } else {
      const errorResponse = utils.errorResponseBuilder(
        req,
        {},
        {
          status: 400,
          message:
            'Something went wrong while updating a menu item, Please try again',
        }
      );
      return errorResponse;
    }
  } catch (error) {
    const errorResponse = utils.errorResponseBuilder(
      req,
      {},
      {
        status: 400,
        message:
          'Something went wrong while updating a menu item, Please try again',
      }
    );
    return errorResponse;
  }
}

async function deleteMenuItem(req) {
  try {
    let result = await menuItemModel.findByIdAndDelete(
      req.params.menuItemId
    );

    if (result) {
      const successResponse = utils.successResposeBuilder(
        req,
        result,
        200,
        'Menu item deleted successfully'
      );
      return successResponse;
    } else {
      const errorResponse = utils.errorResponseBuilder(
        req,
        {},
        {
          status: 400,
          message:
            'Something went wrong while deleting a menu item, Please try again',
        }
      );
      return errorResponse;
    }
  } catch (error) {
    const errorResponse = utils.errorResponseBuilder(
      req,
      {},
      {
        status: 400,
        message:
          'Something went wrong while deleting a menu item, Please try again',
      }
    );
    return errorResponse;
  }
}

module.exports = {
  saveNewMenuCategory: saveNewMenuCategory,
  saveNewMenuItem: saveNewMenuItem,
  getMenuCategories: getMenuCategories,
  getMenu: getMenu,
  updateMenuItem: updateMenuItem,
  deleteMenuItem: deleteMenuItem,
};
