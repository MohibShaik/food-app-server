const email = require('./email.service');
const subscriberModel = require('../models/subscriber.model');
const scheduleModel = require('../models/schedule.model');
const forgotPasswordTemplate = require('../templates/forgotPassword');
const utils = require('../utilities/utils');
const dotenv = require('dotenv');
const moment = require('moment-timezone');

dotenv.config();

async function prepareNotification(req, data) {
  try {
    let template;
    let tempMails;

    if (data?.mailType === 'forgotPassword') {
      template =
        await forgotPasswordTemplate.forgotPasswordTemplate(
          req
        );
      tempMails = req.userEmailAddress;
    }

    const sendEmail = await email.sendMailNotification(
      { mailList: tempMails, data: req },
      template,
      data.mailType
    );

    return 'notification mail sent';
  } catch (error) {
    console.log(error);
  }
}

async function notifyAdmin(payload, notificationType) {
  try {
    const notify = await prepareNotification(payload, {
      mailType: notificationType,
    });

    if (notify == 'notification mail sent') {
      const successResponse = utils.successResposeBuilder(
        payload,
        'Your order has been confirmed',
        200,
        'Your order has been confirmed'
      );
      return successResponse;
    }
  } catch (error) {
    throw error;
  }
}

async function saveNewSubscriber(request) {
  try {
    const subscriberData = await subscriberModel
      .findOne({ email: request.body.email })
      .lean();

    if (subscriberData) {
      const errorResponse = utils.errorResponseBuilder(
        request,
        subscriberData,
        {
          status: 400,
          message: 'Email already subscribed',
        }
      );
      return errorResponse;
    } else {
      let newSubscriber = new subscriberModel(request.body);
      let result = await newSubscriber.save();

      if (result) {
        const successResponse = utils.successResposeBuilder(
          request,
          result,
          201,
          'Subscribed successfully!'
        );
        return successResponse;
      }
    }
  } catch (error) {
    const errorResponse = utils.errorResponseBuilder(
      request,
      {},
      {
        status: 400,
        message: 'Server error',
      }
    );
    return errorResponse;
  }
}

async function saveNewSchedule(req) {
  try {
    let { startTime, endTime, place, specials } = req.body;

    // Convert times to UTC before saving to MongoDB
    startTime = moment
      .tz(startTime, 'YYYY-MM-DDTHH:mm', req.body.timezone)
      .utc();
    endTime = moment
      .tz(endTime, 'YYYY-MM-DDTHH:mm', req.body.timezone)
      .utc();

    // Extract the date (YYYY-MM-DD) for validation
    const scheduleDate = startTime.format('YYYY-MM-DD');

    // Check if a schedule already exists for this date
    const existingSchedule = await scheduleModel.findOne({
      startTime: {
        $gte: moment.utc(scheduleDate).startOf('day'),
        $lt: moment.utc(scheduleDate).endOf('day'),
      },
    });

    if (existingSchedule) {
      const errorResponse = utils.errorResponseBuilder(
        req,
        {},
        {
          status: 400,
          message:
            'A schedule already exists for this date.',
        }
      );
      return errorResponse;
    }

    const newSchedule = new scheduleModel({
      startTime,
      endTime,
      place,
      specials,
    });
    let result = await newSchedule.save();

    const successResponse = utils.successResposeBuilder(
      req,
      result,
      201,
      'Schedule saved successfully'
    );
    return successResponse;
  } catch (error) {
    const errorResponse = utils.errorResponseBuilder(
      req,
      {},
      {
        status: 500,
        message: 'Failed to save schedule',
      }
    );
    return errorResponse;
  }
}

async function getSchedules(req) {
  try {
    const result = await scheduleModel
      .find()
      .sort({ startTime: 1 })
      .lean();
    if (result) {
      const successResponse = utils.successResposeBuilder(
        req,
        result,
        200,
        'Schedules retrived successfully'
      );
      return successResponse;
    }
  } catch (error) {
    const errorResponse = utils.errorResponseBuilder(
      req,
      {},
      {
        status: 500,
        message: 'Failed to fetch schedules',
      }
    );
    return errorResponse;
  }
}

async function getCurrentDateSchedule(req) {
  try {
    // Get today's date in UTC
    const todayStart = moment.utc().startOf('day'); // 00:00 UTC
    const todayEnd = moment.utc().endOf('day'); // 23:59 UTC

    // Find schedules within today's date range
    const todaySchedules = await scheduleModel.find({
      startTime: { $gte: todayStart, $lt: todayEnd },
    });

    if (todaySchedules) {
      const successResponse = utils.successResposeBuilder(
        req,
        todaySchedules,
        200,
        'Today Schedules retrived successfully'
      );
      return successResponse;
    }
  } catch (error) {
    const errorResponse = utils.errorResponseBuilder(
      req,
      {},
      {
        status: 500,
        message: "Failed to fetch today's schedules",
      }
    );
    return errorResponse;
  }
}

module.exports = {
  prepareNotification: prepareNotification,
  notifyAdmin: notifyAdmin,
  newSubscriber: saveNewSubscriber,
  saveNewSchedule: saveNewSchedule,
  getSchedules: getSchedules,
  getCurrentDateSchedule: getCurrentDateSchedule,
};
