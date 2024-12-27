const utils = require('../utilities/utils');
const userModel = require('../models/user.model');
const config = require('../config/auth.config');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

async function saveNewUser(request) {
  const userData = await userModel
    .findOne({ email: request.body.email })
    .lean();
  if (userData) {
    const errorResponse = utils.errorResponseBuilder(
      request,
      userData,
      {
        status: 400,
        message: 'user already exists',
      }
    );
    return errorResponse;
  } else {
    const userObj = {
      username: request.body.username,
      email: request.body.email,
      role: request.body.role,
      isActive: request.body.isActive,
      password: request.body.password
        ? bcrypt.hashSync(request.body.password, 8)
        : bcrypt.hashSync('Test123', 8),
    };

    let newUserInfo = new userModel(userObj);
    let result = await newUserInfo.save();

    const token = jwt.sign(
      { id: result.id },
      config.secret,
      {
        algorithm: 'HS256',
        allowInsecureKeySizes: true,
        expiresIn: 86400, // 24 hours
      }
    );

    const response = {
      userInfo: result,
      accessToken: token,
    };

    const successResponse = utils.successResposeBuilder(
      request,
      response,
      201,
      'user saved successfully'
    );
    return successResponse;
  }
}

async function login(request) {
  const userData = await userModel
    .findOne({ email: request.body.emailAddress })
    .lean();
  if (userData) {
    var passwordIsValid = bcrypt.compareSync(
      request.body.password,
      userData.password
    );

    if (!passwordIsValid) {
      const errorResponse = utils.errorResponseBuilder(
        request,
        userData,
        {
          status: 401,
          message: 'Invalid Password!',
        }
      );
      return errorResponse;
    }

    const token = jwt.sign(
      { id: userData.id },
      config.secret,
      {
        algorithm: 'HS256',
        allowInsecureKeySizes: true,
        expiresIn: 86400, // 24 hours
      }
    );

    userData.accessToken = token;

    const successResponse = utils.successResposeBuilder(
      request,
      userData,
      200,
      'user login successfull'
    );
    return successResponse;
  } else {
    const errorResponse = utils.errorResponseBuilder(
      request,
      userData,
      {
        status: 404,
        message: 'User Not found.',
      }
    );
    return errorResponse;
  }
}

async function verifyOTP(request) {
  try {
    const userData = await userModel
      .findOne({ email: request.body.email })
      .lean();
    if (userData) {
      if (userData.emailOTP === request.body.OTP) {
        const filter = {
          _id: userData._id,
        };

        const updatedUserInfo =
          await userModel.findOneAndUpdate(
            filter,
            { emailVerified: true },
            {
              new: true,
            }
          );

        const token = jwt.sign(
          { id: userData._id },
          config.secret,
          {
            algorithm: 'HS256',
            allowInsecureKeySizes: true,
            expiresIn: 86400, // 24 hours
          }
        );

        const response = {
          userInfo: updatedUserInfo,
          accessToken: token,
        };

        const successResponse = utils.successResposeBuilder(
          request,
          response,
          200,
          'OTP verified successfully'
        );
        return successResponse;
      } else {
        const errorResponse = utils.errorResponseBuilder(
          request,
          userData,
          {
            status: 401,
            message: 'Invalid OTP',
          }
        );
        return errorResponse;
      }
    } else {
      const errorResponse = utils.errorResponseBuilder(
        request,
        userData,
        {
          status: 404,
          message: 'User not found',
        }
      );
      return errorResponse;
    }
  } catch (error) {}
}

async function getAllUsers(request) {
  try {
    const users = await userModel
      .find()
      .lean()
      .exec();
    const successResponse = utils.successResposeBuilder(
      request,
      users,
      200,
      'Users retrieved successfully'
    );
    return successResponse;
  } catch (error) {
    const errorResponse = utils.errorResponseBuilder(
      request,
      {},
      {
        status: 500,
        message: error,
      }
    );
    return errorResponse;
  }
}

module.exports = {
  saveNewUser: saveNewUser,
  login: login,
  verifyOTP: verifyOTP,
  getAllUsers: getAllUsers,
};
