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
    let imageUrl = '';

    if (req.file?.path) {
      const uploadResponse =
        await cloudinary.uploader.upload(req.file.path, {
          folder: 'menu',
          transformation: [
            {
              width: 800,
              height: 800,
              crop: 'limit',
              quality: 'auto',
            },
          ],
        });

      imageUrl = uploadResponse.secure_url || '';
    }

    const menuItemReqObj = {
      menuCategoryId: req.body.category,
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      quantity: req.body.quantity,
      images: imageUrl,
    };

    const newMenuItemInfo = new menuItemModel(
      menuItemReqObj
    );
    const result = await newMenuItemInfo.save();

    if (!result) {
      return utils.errorResponseBuilder(
        req,
        {},
        {
          status: 400,
          message:
            'Something went wrong while publishing a menu item, Please try again',
        }
      );
    }

    return utils.successResposeBuilder(
      req,
      result,
      200,
      'New menu item published successfully'
    );
  } catch (error) {
    return utils.errorResponseBuilder(
      req,
      {},
      {
        status: 400,
        message:
          'Something went wrong while publishing a menu item, Please try again',
      }
    );
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
    const {
      category,
      name,
      description,
      price,
      quantity,
      images,
    } = req.body;
    const menuItemId = req.params.menuItemId;

    // Find existing menu item
    let menuItem = await menuItemModel.findById(menuItemId);
    if (!menuItem) {
      return utils.errorResponseBuilder(
        req,
        {},
        { status: 404, message: 'Menu item not found' }
      );
    }

    // Delete old image from Cloudinary if it exists
    if (menuItem.images) {
      const oldImagePublicId = menuItem.images
        .split('/')
        .pop()
        .split('.')[0]; // Extract public_id
      const deleteResult =
        await cloudinary.uploader.destroy(oldImagePublicId);
      console.log(deleteResult);
    }

    // Upload new image to Cloudinary (if provided)
    let imageUrl = menuItem.images; // Keep old image if no new one is uploaded
    if (req.file?.path) {
      const uploadResponse =
        await cloudinary.uploader.upload(req.file.path, {
          folder: 'menu', // Optional: organize images in a folder
        });
      imageUrl = uploadResponse.secure_url;
    }

    // Update menu item in the database
    const updatedMenuItem =
      await menuItemModel.findByIdAndUpdate(
        menuItemId,
        {
          $set: {
            menuCategoryId: category,
            name,
            description,
            price,
            quantity,
            images: imageUrl,
          },
        },
        { new: true }
      );

    return utils.successResposeBuilder(
      req,
      updatedMenuItem,
      200,
      'Menu item updated successfully'
    );
  } catch (error) {
    const errorResponse = utils.errorResponseBuilder(
      req,
      {},
      {
        status: 500,
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

async function deleteCategory(req) {
  try {
    let result = await menuCategoryModel.findByIdAndDelete(
      req.params.categoryId
    );

    if (result) {
      const successResponse = utils.successResposeBuilder(
        req,
        result,
        200,
        'Category deleted successfully'
      );
      return successResponse;
    } else {
      const errorResponse = utils.errorResponseBuilder(
        req,
        {},
        {
          status: 400,
          message:
            'Something went wrong while deleting a category, Please try again',
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
          'Something went wrong while deleting a category, Please try again',
      }
    );
    return errorResponse;
  }
}

async function updateCategory(req) {
  try {
    var categoryObj = {
      _id: req.body._id,
      name: req.body.name,
    };

    let result = await menuCategoryModel.findOneAndUpdate(
      {
        _id: req.params.categoryId,
      },
      {
        $set: categoryObj,
      },
      { upsert: true, new: true }
    );

    if (result) {
      const successResponse = utils.successResposeBuilder(
        req,
        result,
        200,
        'Category updated successfully'
      );
      return successResponse;
    } else {
      const errorResponse = utils.errorResponseBuilder(
        req,
        {},
        {
          status: 400,
          message:
            'Something went wrong while updating a category, Please try again',
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
          'Something went wrong while updating a category, Please try again',
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
  deleteCategory: deleteCategory,
  updateCategory: updateCategory,
};
