const Order = require("../models/order.model");
const AppError = require("../utils/appError");
const { EmitEvent } = require('../socket');
const OtpUser = require("../models/otpUser.model");
const Bill = require("../models/bill.model");
const Notification = require("../models/notification.model");
const catchAsync = require("../utils/catchAsync");

exports.addOrder = catchAsync(async (req, res, next) => {
    let tableId = await OtpUser.findOne({ otp: req.otpUser[0].otp })
    if (tableId) {
        let newOrders = await Order.create({
            itemId: req.body.itemId,
            quantity: req.body.quantity,
            totalPrice: req.body.totalPrice,
            dishStatus: req.body.dishStatus,
            status: 'pending',
            tableNo: tableId.tableNo,
            payment_status: 'pending',
            otpUserId: req.otpUser[0]._id
        });
        if (newOrders) {
            await Notification.create({
                description: "newOrder Placed",
                status: 'unread',
                otpUserId: req.otpUser[0]._id,
                tableId: tableId.tableNo,
                itemId: req.body.itemId
            })
            EmitEvent("newNotification", "New Notification Placed")

        }
        EmitEvent("newOrders", "New Order Placed")
        res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: "order placed successfully",
        })
    }
});

exports.getOrder = catchAsync(async (req, res, next) => {
    if (req.params.status == 'completedOrders') {
        const getOrders = await Order.find({ status: 'completed' })
            .populate({
                path: 'otpUserId',
                match: { status: 'active' },
            })
            .populate('customerId', 'userName')
            .populate('tableNo', 'tableName')
            .populate('itemId', 'itemName itemPrice itemPicture')

        //console.log(getOrders)
        if (!getOrders) {
            return next(new AppError('Record not found', 404))
        }

        const filteredOrders = getOrders.filter((order) => {
            console.log(order.otpUserId)
            return order.otpUserId
        });

        res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: "Get all Orders",
            data: filteredOrders
        })
    } else if (req.params.status == 'pendingOrders') {
        const getOrders = await Order.find({ status: 'pending' })
            .populate({
                path: 'otpUserId',
                match: { status: 'active' },
            })
            .populate('customerId', 'userName')
            .populate('tableNo', 'tableName')
            .populate('itemId', 'itemName itemPrice itemPicture');

        //console.log(getOrders)
        if (!getOrders) {
            return next(new AppError('Record not found', 404))
        }

        const filteredOrders = getOrders.filter((order) => {
            console.log(order.otpUserId)
            return order.otpUserId
        });

        res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: "Get all Orders",
            data: filteredOrders
        })
    } else {
        const getOrders = await Order.find()
            .populate({
                path: 'otpUserId',
                match: { status: 'active' },
            })
            .populate('customerId', 'userName')
            .populate('tableNo', 'tableName')
            .populate('itemId', 'itemName itemPrice itemPicture');

        //console.log(getOrders)
        if (!getOrders) {
            return next(new AppError('Record not found', 404))
        }

        const filteredOrders = getOrders.filter((order) => {
            console.log(order.otpUserId)
            return order.otpUserId
        });

        res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: "Get all Orders",
            data: filteredOrders
        })
    }

})

exports.getOrderUser = catchAsync(async (req, res, next) => {
    const getOrders = await Order.find({ tableNo: req.otpUser[0].tableNo, status: 'completed', otpUserId: req.otpUser[0]._id }).populate('tableNo', 'tableName').populate('itemId', 'itemName itemPrice itemPicture').sort({ payment_status: -1 });;
    if (!getOrders) {
        return next(new AppError('Record not found', 404))
    }
    EmitEvent("paidUpdate", "Update status of order")
    res.status(200).json({
        status: 'success',
        statusCode: 200,
        message: "Get all users orders",
        data: getOrders
    })
})

exports.updateStatus = catchAsync(async (req, res, next) => {
    console.log(req.otpUser)
    if (req.params.id) {
        const upStatus = await Order.findByIdAndUpdate({
            _id: req.params.id,
            'otpUserId.status': 'active'
        },
            { status: 'completed' },
            { new: true })
        EmitEvent("updateOrders", "Order serve")

        if (!upStatus) {
            return next(new AppError('Record not found', 404))
        }

        let getOrder = await Order.find({ otpUserId: upStatus.otpUserId, status: 'completed' })

        let allOverCompleteTotal = getOrder.reduce((total, order) => {
            if (order.payment_status === 'pending') {
                return total + order.totalPrice;
            }
            return total;
        }, 0);

        let roundGst = (allOverCompleteTotal * 0.1)
        let findOtpUserBill = await Bill.find({ otpUserId: upStatus.otpUserId })
        if (findOtpUserBill.length > 0) {
            const billUpdate = await Bill.updateOne({
                otpUserId: upStatus.otpUserId
            }, { total: allOverCompleteTotal + parseFloat(roundGst.toFixed(2)) })
            // EmitEvent("BillPdf", "Update bill pdf")
        } else {
            const billCreate = await Bill.create({
                tableId: upStatus.tableNo,
                otpUserId: upStatus.otpUserId,
                total: allOverCompleteTotal,
                status: 'pending'
            })
            EmitEvent("BillPlaced", "New Bill Placed")
        }

        res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: "order completed"
        })
    } else {
        return next(new AppError('Somthing wrong!!Please try again!', 404))
    }

})


exports.orderExists = catchAsync(async (req, res, next) => {
    // console.log("hello")
    let findOrderExists = await Order.find({ otpUserId: req.otpUser[0].id }).count();
    res.status(200).json({
        status: 'success',
        statusCode: 200,
        message: "order exists",
        data: findOrderExists
    })
})

exports.searchFilter = catchAsync(async (req, res, next) => {
    console.log(JSON.parse(req.params.data))
    const filterObj = JSON.parse(req.params.data);
    const pipeline = [];
    // Match stage to filter records based on the groupName field of the referenced OtpUser
    pipeline.push({
        $lookup: {
            from: 'items',
            localField: 'itemId',
            foreignField: '_id',
            as: 'item',
        },
    });

    pipeline.push({
        $lookup: {
            from: 'otpusers',
            localField: 'otpUserId',
            foreignField: '_id',
            as: 'otpUser',
        },
    });

    // Additional lookup stage to get the tableName based on the tableNo field
    pipeline.push({
        $lookup: {
            from: 'tables',
            localField: 'tableNo',
            foreignField: '_id',
            as: 'table',
        },
    });



    if (filterObj.searchName) {
        pipeline.push({
            $match: {
                $or: [
                    { 'item.itemName': { $regex: filterObj.searchName, $options: 'i' } },
                    { 'table.tableName': { $regex: filterObj.searchName, $options: 'i' } },
                    { 'otpUser.groupName': { $regex: filterObj.searchName, $options: 'i' } }
                ]
            },
        });
    }

    if (filterObj.url == "order") {
        pipeline.push({
            $match: {
                'otpUser.status': 'active',
            },
        });
    }

    if (filterObj.url == "pendingOrders") {
        pipeline.push({
            $match: {
                'otpUser.status': 'active',
                'status': 'pending'
            },
        });
    }

    if (filterObj.url == "completedOrders") {
        pipeline.push({
            $match: {
                'otpUser.status': 'active',
                'status': 'completed',
            },
        });
    }

    pipeline.push({
        $project: {
            groupName: { $arrayElemAt: ['$otpUser.groupName', 0] },
            itemName: { $arrayElemAt: ['$item.itemName', 0] },
            tableName: { $arrayElemAt: ['$table.tableName', 0] },
            quantity: 1,
            totalPrice: 1,
            status: 1
            // $$ROOT: 1,
        },
    });

    // Count stage to get the total count of matching documents
    const length = await Order.aggregate([
        ...pipeline,
        { $count: 'count' },
    ]);

    // Pagination - Skip stage
    const skipAmount = (parseInt(filterObj.pageNumber) - 1) * parseInt(filterObj.pageSize);
    pipeline.push({ $skip: skipAmount });

    // Limit stage to retrieve only the specified number of records per page
    pipeline.push({ $limit: parseInt(filterObj.pageSize) });
    pipeline.push({ $sort: { createdAt  : -1 } });
    Order.aggregate(pipeline)
        .then((results) => {
            res.status(200).json({
                status: 'success',
                statusCode: 200,
                message: 'Get all order',
                data: results,
                count: length.length > 0 ? length[0].count : 0,
            });
        })
        .catch((error) => {
            console.error(error);
            // Handle any errors here
        });
})

exports.checkOrderExists = catchAsync(async (req, res, next) => {
    //     let chkOrderExists = await Order.find({ otpUserId: req.otpUser[0].id })

    //     if (chkOrderExists.length > 0) {
    //         res.status(200).json({
    //             status: 'success',
    //             statusCode: 202,
    //             message: 'Order Exists',
    //         });
    //     }
});