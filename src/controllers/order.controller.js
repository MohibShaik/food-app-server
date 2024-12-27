const utils = require('../utilities/utils');
const orderService = require('../services/order-service');

exports.saveNewOrder = async function (request, response) {
  try {
    const saveNewOrderResponse =
      await orderService.saveNewOrder(request);
    response
      .status(saveNewOrderResponse.statusCode)
      .send(saveNewOrderResponse);
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

exports.getOrderById = async function (request, response) {
  try {
    const apiResponse =
      await orderService.getOrderById(request);
    response
      .status(apiResponse.statusCode)
      .send(apiResponse);
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

exports.updateOrderStatus = async function (request, response) {
  try {
    const apiResponse =
      await orderService.updateOrderStatus(request);
    response
      .status(apiResponse.statusCode)
      .send(apiResponse);
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

exports.getOrderByUserId = async function (request, response) {
  try {
    const apiResponse =
      await orderService.getOrderByUserId(request);
    response
      .status(apiResponse.statusCode)
      .send(apiResponse);
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

exports.getAllOrders = async function (request, response) {
  try {
    const apiResponse =
      await orderService.getAllOrders(request);
    response
      .status(apiResponse.statusCode)
      .send(apiResponse);
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