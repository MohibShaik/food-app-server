const utils = require('../utilities/utils');
const mailService = require('../services/email.service');
const notificationService = require('../services/notification.service');

exports.sendNewQuery = async function (request, response) {
  try {
    const sendQueryResponse = await mailService.sendMail(
      request.body
    );

    response
      .status(200)
      .send({ message: 'Email sent successfully!' });
  } catch (error) {
    const errorResponse = utils.errorResponseBuilder(
      request,
      response,
      error
    );
    response
      .status(500)
      .send({ message: 'Error sending email.', error });
  }
};

exports.newSubscriber = async function (request, response) {
  try {
    const apiResponse =
      await notificationService.newSubscriber(request);

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

exports.saveNewSchedule = async function (
  request,
  response
) {
  try {
    const apiResponse =
      await notificationService.saveNewSchedule(request);

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

exports.getSchedules = async function (request, response) {
  try {
    const apiResponse =
      await notificationService.getSchedules(request);

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

exports.getCurrentDateSchedule = async function (request, response) {
  try {
    const apiResponse =
      await notificationService.getCurrentDateSchedule(request);

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