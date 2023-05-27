const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Bill = require("../models/bill.model");
const Order = require("../models/order.model");
const { EmitEvent } = require('../socket');

exports.addBill = catchAsync(async (req, res, next) => {
    console.log(req.body.total)
    let findBill = await Bill.find({ otpUserId: req.otpUser[0]._id })
    console.log(findBill)
    if (findBill.length > 0) {
        if (findBill[0].status == 'pending') {
            let updateBill = await Bill.updateOne({ otpUserId: req.otpUser[0]._id }, { $set: { status: 'complete' } })
            let updateProduct = await Order.updateMany({ tableNo: req.otpUser[0].tableNo, status: 'completed' }, { $set: { payment_status: "completed" } })
        }
        if (findBill[0].status == 'complete') {
            let oldTotal = await Bill.findById({ _id: findBill[0]._id })
            let updateBill = await Bill.updateOne({ otpUserId: req.otpUser[0]._id, status: 'complete' }, { $set: { total: req.body.total } })
            let updateProduct = await Order.updateMany({ tableNo: req.otpUser[0].tableNo, status: 'completed' }, { $set: { payment_status: "completed" } })
            if (updateProduct.modifiedCount > 0) {
                res.status(200).json({
                    status: 'success',
                    statusCode: 200,
                    message: "Payment successfully",
                })
            }
            // }
        }
    }
})

exports.getBill = catchAsync(async (req, res, next) => {
    let getBill = await Bill.find().populate("otpUserId", "groupName").populate("tableId", "tableNo");
    console.log("getBill" + getBill)
    if (getBill) {
        res.status(202).json({
            status: 'success',
            statusCode: 200,
            message: "Get current bill",
            data: getBill
        })
    }
});

exports.getStatus = catchAsync(async (req, res, next) => {
    let getStus = await Bill.find({ otpUserId: req.otpUser[0]._id }).where({ status: 'complete' });
    if (getStus.length > 0) {
        res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: "Get current otpuser bill status",
            data: getStus
        })
    }
});

exports.upDateBillStatus = catchAsync(async (req, res, next) => {
    // console.log(req)
    const updateBill = await Bill.findByIdAndUpdate({ _id: req.body.id }, { status: 'complete' })
    console.log(Bill.otpUserId)
    const updateOrder = await Order.updateMany({ otpUserId: updateBill.otpUserId }, { $set: { payment_status: 'completed' } })

    EmitEvent("billUpdates", "Bill Updated")

    res.status(200).json({
        status: 'success',
        statusCode: 200,
        message: "bill update successfully",
    })
});

exports.searchFilter = catchAsync(async (req, res, next) => {
    const filterObj = JSON.parse(req.params.data);
    const pipeline = [];
    console.log(JSON.parse(req.params.data))

    // Match stage to filter records based on the groupName field of the referenced OtpUser
    pipeline.push({
        $lookup: {
            from: 'otpusers',
            localField: 'otpUserId',
            foreignField: '_id',
            as: 'otpdata',
        },
    });

    // Additional lookup stage to get the tableName based on the tableNo field
    pipeline.push({
        $lookup: {
            from: 'tables',
            localField: 'tableId',
            foreignField: '_id',
            as: 'table',
        },
    });

    if (filterObj.searchName) {
        pipeline.push({
            $match: {
                $or: [
                    { 'otpdata.groupName': { $regex: filterObj.searchName, $options: 'i' } },
                    { 'table.tableName': { $regex: filterObj.searchName, $options: 'i' } }
                ]
            },
        });
    }

    // Projection stage to include the desired fields
    pipeline.push({
        $project: {
            groupName: { $arrayElemAt: ['$otpdata.groupName', 0] },
            tableName: { $arrayElemAt: ['$table.tableName', 0] },
            total: 1,
            status: 1
            // $$ROOT: 1,
            // Include other fields as needed
        },
    });

    // Count stage to get the total count of matching documents
    const length = await Bill.aggregate([
        ...pipeline,
        { $count: 'count' },
    ]);
    // console.log(length[0].count)
    // Pagination - Skip stage
    const skipAmount = (parseInt(filterObj.pageNumber) - 1) * parseInt(filterObj.pageSize);
    pipeline.push({ $skip: skipAmount });

    // Limit stage to retrieve only the specified number of records per page
    pipeline.push({ $limit: parseInt(filterObj.pageSize) });

    Bill.aggregate(pipeline)
        .then((results) => {
            res.status(200).json({
                status: 'success',
                statusCode: 200,
                message: 'Get all Bill',
                data: results,
                count: length.length > 0 ? length[0].count : 0,
            });
        })
        .catch((error) => {
            console.error(error);
            // Handle any errors here
        });
})