const utils = require('../utilities/utils');
const menuItemModel = require('../models/menu-item.model');
const menuCategoryModel = require('../models/menu-category.model');
const orderModel = require('../models/orders.model');
const pagedResult = require('../utilities/pagination/paged-result');
const dotenv = require('dotenv');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const path = require('path');

const http = require('http');
const socketIO = require('socket.io');
const express = require('express');
const { status } = require('emsi-skills-api');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

dotenv.config();

async function saveNewOrder(request) {
  try {
    let cancellationTime = new Date(
      new Date().getTime() + 0.5 * 60000
    );

    request.body.cancellationTime = cancellationTime;
    request.body.deliveryTime === 'ASAP'
      ? (request.body.deliveryTime = new Date())
      : (request.body.deliveryTime =
          new Date().getTime() + 5 * 60000);

    let newOrder = new orderModel(request.body);
    let result = await newOrder.save();

    // Provide a 5-minute buffer
    setTimeout(async () => {
      const currentOrder = await orderModel.findById(
        result._id
      );
      if (currentOrder.status === 'Pending') {
        currentOrder.status = 'Confirmed';
        await currentOrder.save();
        // io.emit('newOrder', {
        //   message: `New order placed by user`,
        //   currentOrder,
        // });
        // Send confirmation email
        // sendEmail(
        //   currentOrder.user.email,
        //   'Order Confirmation',
        //   `Hello ${currentOrder.user.name}, your order has been confirmed.`
        // );
      }
    }, 0.5 * 60 * 1000); // 5 minutes in milliseconds

    const successResponse = utils.successResposeBuilder(
      request,
      result,
      201,
      'Order placed successfully'
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

async function getOrderById(request) {
  try {
    const ordersDetails = await orderModel
      .findById(request.query.orderId)
      .populate('requester')
      .populate('requestedItems.menuCategoryId')
      .lean()
      .exec();
    const successResponse = utils.successResposeBuilder(
      request,
      ordersDetails,
      200,
      'Order details retrieved successfully'
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

async function updateOrderStatus(request) {
  try {
    const filter = {
      _id: request.body.orderId,
    };
    const update = {
      status: request.body.status,
    };

    const updatedOrderInfo = await orderModel
      .findOneAndUpdate(filter, update, {
        new: true,
      })
      .populate('requester');

    const successResponse = utils.successResposeBuilder(
      request,
      updatedOrderInfo,
      200,
      'Order status updated successfully'
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

async function getOrderByUserId(request) {
  try {
    const ordersDetails = await orderModel
      .find({ requester: request.query.userId })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    const successResponse = utils.successResposeBuilder(
      request,
      ordersDetails,
      200,
      'User Order details retrieved successfully'
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

async function getAllOrders(request) {
  try {
    let query = [
      {
        $match: {
          $and: [
            request.body.status.length
              ? {
                  status: request.body.status,
                }
              : {},
            {
              createdAt: {
                $gte: new Date(request.body.startDate),
                $lte: new Date(request.body.endDate),
              },
            },
          ],
        },
      },
      {
        $skip:
          Number(request.query.pageIndex) *
          Number(request.query.pageSize),
      },
      { $limit: Number(request.query.pageSize) },
      {
        $sort: {
          createdAt: 1,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'requester',
          foreignField: '_id',
          as: 'requester',
        },
      },
    ];

    let tquery = [
      {
        $match: {
          $and: [
            request.body.status.length
              ? {
                  status: request.body.status,
                }
              : {},
            {
              createdAt: {
                $gte: new Date(request.body.startDate),
                $lte: new Date(request.body.endDate),
              },
            },
          ],
        },
      },
      {
        $count: 'rowCount',
      },
    ];

    const ordersData = await orderModel.aggregate(query);
    const totalRows = await orderModel.aggregate(tquery);

    const successResponse = utils.successResposeBuilder(
      request,
      pagedResult(
        ordersData,
        totalRows.length ? totalRows[0].rowCount : 0
      ),
      200,
      'Orders data retrieved successfully'
    );
    return successResponse;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  saveNewOrder: saveNewOrder,
  getOrderById: getOrderById,
  updateOrderStatus: updateOrderStatus,
  getOrderByUserId: getOrderByUserId,
  getAllOrders: getAllOrders,
};
