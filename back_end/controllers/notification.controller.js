const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Notification = require("../models/notification.model");
const { EmitEvent } = require('../socket');

exports.delNotification = catchAsync(async (req, res, next) => {
    console.log(req.params.id)
    const delNotification = await Notification.findByIdAndDelete(req.params.id);

    if (!delNotification) {
        return next(new AppError('Notification not found', 400))
    }
    EmitEvent("deleteNotifications", "delete notification")
    res.status(200).json({
        status: 'success',
        statusCode: 200,
        message: "Delete Notification",
    })
});

exports.getNotification = catchAsync(async (req, res, next) => {
    const notificationCount = await Notification.aggregate([
        {
            $lookup: {
                from: 'tables', // Replace with the actual name of the table collection
                localField: 'tableId',
                foreignField: '_id',
                as: 'table'
            }
        },
        {
            $group: {
                _id: {
                    otpUserId: '$otpUserId',
                    tableNo: '$otpUserId.tableNo',
                    tableName: { $first: '$table.tableName' }
                },
                count: { $sum: 1 },
            }
        }
    ]);


    // console.log(notificationCount)

    res.status(200).json({
        status: 'success',
        statusCode: 200,
        message: "Get all Notification",
        data: notificationCount
    })
});

exports.getNotificationWithDetails = catchAsync(async (req, res, next) => {
    let notificationDetails = await Notification.aggregate([
        {
            $lookup: {
                from: 'tables',
                localField: 'tableId',
                foreignField: '_id',
                as: 'table'
            }
        },
        {
            $lookup: {
                from: 'items',
                localField: 'itemId',
                foreignField: '_id',
                as: 'item'
            }
        },
        {
            $lookup: {
                from: 'orders',
                localField: 'itemId',
                foreignField: 'itemId',
                as: 'orders'
            }
        },
        {
            $group: {
                _id: '$table.tableName',
                notifications: {
                    $push: {
                        description: '$description',
                        status: '$status',
                        otpUserId: '$otpUserId',
                        item: '$item',
                        quantity: '$orders.quantity', // Include quantity
                        notificationId: '$_id'
                    }
                }
            }
        }
    ]);



    console.log(notificationDetails)

    res.status(200).json({
        status: 'success',
        statusCode: 200,
        message: "Get all Notification",
        data: notificationDetails
    })
});