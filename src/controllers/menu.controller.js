const utils = require('../utilities/utils');
const menuService = require('../services/menu-service');

exports.saveNewMenuCategory = async function (
  request,
  response
) {
  try {
    const saveMenuCatResponse =
      await menuService.saveNewMenuCategory(request);
    response
      .status(saveMenuCatResponse.statusCode)
      .send(saveMenuCatResponse);
  } catch (error) {
    const errorResponse = utils.errorResponseBuilder(
      request,
      response,
      error
    );
    response
      .status(errorResponse.statusCode)
      .send(errorResponse);
  }
};

exports.saveNewMenuItem = async function (
  request,
  response
) {
  try {
    const saveMenuCatResponse =
      await menuService.saveNewMenuItem(request);
    response
      .status(saveMenuCatResponse.statusCode)
      .send(saveMenuCatResponse);
  } catch (error) {
    const errorResponse = utils.errorResponseBuilder(
      request,
      response,
      error
    );
    response
      .status(errorResponse.statusCode)
      .send(errorResponse);
  }
};

exports.getMenuCategories = async function (
  request,
  response
) {
  try {
    const saveMenuCatResponse =
      await menuService.getMenuCategories(request);
    response
      .status(saveMenuCatResponse.statusCode)
      .send(saveMenuCatResponse);
  } catch (error) {
    const errorResponse = utils.errorResponseBuilder(
      request,
      response,
      error
    );
    response
      .status(errorResponse.statusCode)
      .send(errorResponse);
  }
};

exports.getMenu = async function (request, response) {
  try {
    const saveMenuCatResponse = await menuService.getMenu(
      request
    );
    response
      .status(saveMenuCatResponse.statusCode)
      .send(saveMenuCatResponse);
  } catch (error) {
    const errorResponse = utils.errorResponseBuilder(
      request,
      response,
      error
    );
    response
      .status(errorResponse.statusCode)
      .send(errorResponse);
  }
};

exports.updateMenuItem = async function (
  request,
  response
) {
  try {
    const saveMenuCatResponse =
      await menuService.updateMenuItem(request);
    response
      .status(saveMenuCatResponse.statusCode)
      .send(saveMenuCatResponse);
  } catch (error) {
    const errorResponse = utils.errorResponseBuilder(
      request,
      response,
      error
    );
    response
      .status(errorResponse.statusCode)
      .send(errorResponse);
  }
};

exports.deleteMenuItem = async function (
  request,
  response
) {
  try {
    const saveMenuCatResponse =
      await menuService.deleteMenuItem(request);
    response
      .status(saveMenuCatResponse.statusCode)
      .send(saveMenuCatResponse);
  } catch (error) {
    const errorResponse = utils.errorResponseBuilder(
      request,
      response,
      error
    );
    response
      .status(errorResponse.statusCode)
      .send(errorResponse);
  }
};

exports.deleteCategory = async function (
  request,
  response
) {
  try {
    const saveMenuCatResponse =
      await menuService.deleteCategory(request);
    response
      .status(saveMenuCatResponse.statusCode)
      .send(saveMenuCatResponse);
  } catch (error) {
    const errorResponse = utils.errorResponseBuilder(
      request,
      response,
      error
    );
    response
      .status(errorResponse.statusCode)
      .send(errorResponse);
  }
};

exports.updateCategory = async function (
  request,
  response
) {
  try {
    const saveMenuCatResponse =
      await menuService.updateCategory(request);
    response
      .status(saveMenuCatResponse.statusCode)
      .send(saveMenuCatResponse);
  } catch (error) {
    const errorResponse = utils.errorResponseBuilder(
      request,
      response,
      error
    );
    response
      .status(errorResponse.statusCode)
      .send(errorResponse);
  }
};
