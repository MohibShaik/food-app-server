const utils = require('../utilities/utils');
const mailService = require('../services/email.service');

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
