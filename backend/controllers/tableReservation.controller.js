const Table = require("../models/table.model");
const TableReservation = require("../models/tableReservation.model");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const cron = require('node-cron');
const { EmitEvent } = require('../socket');
const Email = require("../utils/tableReserve");

cron.schedule('1 0 * * *', async () => {
    const currentDate = new Date().toISOString().split('T')[0]; // Get the current date
    const data = await TableReservation.deleteMany({ bookingDate: { $lt: currentDate } });
});

exports.addTableReservation = catchAsync(async (req, res, next) => {
    var date_time = new Date();
    bookingStart = '10:00'; // start time in 24-hour clock format
    bookingEnd = '21:00'; // end time in 24-hour clock format
    bookingInTime = req.body.bookingInTime
    bookingOutTime = req.body.bookingOutTime

    // get current date
    // adjust 0 before single digit date
    let date = ("0" + date_time.getDate()).slice(-2);

    // get current month
    let month = ("0" + (date_time.getMonth() + 1)).slice(-2);

    // get current year
    let year = date_time.getFullYear();

    // get current hours
    let hours = date_time.getHours();

    // get current minutes
    let minutes = date_time.getMinutes();

    // get current seconds
    let seconds = date_time.getSeconds();

    // prints date in YYYY-MM-DD format
    //console.log(year + "-" + month + "-" + date);
    const bookingDate = year + "-" + month + "-" + date;
    // prints date & time in YYYY-MM-DD HH:MM:SS format
    //console.log(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);

    let currentTime = year + "-" + month + "-" + date + " " + hours + ":" + minutes;

    const table = await Table.findOne({ status: 'available' });
    if (table) {
        const addTabReservation = await TableReservation.create({
            tableId: table._id,
            customerId: req.user._id,
            bookingDate: req.body.bookingDate,
            bookingInTime: req.body.bookingInTime,
            bookingOutTime: req.body.bookingOutTime,
            contactNo: req.body.contactNo,
            payment_status: "pending"
        });
        if (addTabReservation) {
            const updateTable = await Table.findByIdAndUpdate(table._id, {
                status: 'reserved'
            })
        }
        EmitEvent("tableReservation", "New Table Reserved")

        await new Email(addTabReservation, req.user.userEmail).sendTableReserve().then(() => {
            res.status(201).json({
                status: 'success',
                statusCode: 201,
                message: "Table reserved successfully!",
                data: addTabReservation
            })
        });
    } else {

        const bookedTables = await TableReservation.find({
            bookingDate: req.body.bookingDate,
            $and: [
                { $and: [{ bookingInTime: { $lte: req.body.bookingInTime } }, { bookingOutTime: { $gt: req.body.bookingInTime } }] },
                { $and: [{ bookingInTime: { $lt: req.body.bookingOutTime } }, { bookingOutTime: { $gte: req.body.bookingOutTime } }] },
                { $and: [{ payment_status: 'complete' }] }
            ]
        }).distinct('tableId');
        const availableTables = await Table.find({
            _id: { $nin: bookedTables }
        }).limit(1);
        if (availableTables.length > 0) {
            const tableId = availableTables[0]._id;
            const addTabReservation = await TableReservation.create({
                tableId: tableId,
                customerId: req.user._id,
                bookingDate: req.body.bookingDate,
                bookingInTime: req.body.bookingInTime,
                bookingOutTime: req.body.bookingOutTime,
                contactNo: req.body.contactNo,
                payment_status: "pending"
            });

            await new Email(addTabReservation, req.user.userEmail).sendTableReserve().then(() => {
                res.status(201).json({
                    status: 'success',
                    statusCode: 201,
                    message: "Table reserved successfully!",
                    data: addTabReservation
                })
            });

        } else {
            res.status(200).json({
                status: 'success',
                statusCode: 200,
                message: "Sorry!Booking slot is not available"
            })
        }

    }
});

exports.getTableReservation = catchAsync(async (req, res, next) => {
    const getTabReservation = await TableReservation.find().populate('customerId', 'userName').populate('tableId', 'tableName tableNo').where('payment_status', 'complete');

    if (!getTabReservation) {
        return next(new AppError('Record not found', 404))
    }

    res.status(200).json({
        status: 'success',
        statusCode: 200,
        message: "Get all reserved table",
        data: getTabReservation
    })
})

exports.getTableByUser = catchAsync(async (req, res, next) => {
    const getTabByUser = await TableReservation.find({ customerId: req.user._id }).populate('customerId', 'userName').populate('tableId', 'tableName tableNo').where('payment_status', 'complete');

    if (!getTabByUser) {
        return next(new AppError('Record not found', 404))
    }
    res.status(200).json({
        status: 'success',
        statusCode: 200,
        message: "Get reserved table",
        data: getTabByUser
    })
});

exports.searchTableReservation = catchAsync(async (req, res, next) => {
    const filterObj = JSON.parse(req.params.data);
    const pipeline = [];

    pipeline.push({
        $lookup: {
            from: 'users',
            localField: 'customerId',
            foreignField: '_id',
            as: 'user',
        },
    });

    pipeline.push({
        $lookup: {
            from: 'tables',
            localField: 'tableId',
            foreignField: '_id',
            as: 'table',
        },
    });

    let matchObj = {};

    if (filterObj.searchTName || filterObj.searchDate) {
        matchObj.$or = [];

        if (filterObj.searchTName) {
            matchObj.$or.push({
                'user.userName': { $regex: filterObj.searchTName, $options: 'i' },
            });
            matchObj.$or.push({
                'table.tableName': { $regex: filterObj.searchTName, $options: 'i' },
            });
        }

        if (filterObj.searchDate) {
            matchObj.$or.push({ bookingDate: filterObj.searchDate });
        }

        pipeline.push({
            $match: matchObj,
        });
    }

    pipeline.push({
        $match: {
            $and: [
                matchObj,
                { payment_status: 'complete' }
            ]
        }
    });

    pipeline.push({
        $project: {
            customerId: { $arrayElemAt: ['$user.userName', 0] },
            tableId: { $arrayElemAt: ['$table.tableNo', 0] },
            tableName: { $arrayElemAt: ['$table.tableName', 0] },
            bookingDate: 1,
            bookingInTime: 1,
            bookingOutTime: 1,
            total: 1,
            status: 1,
        },
    });

    const length = await TableReservation.aggregate([
        ...pipeline,
        { $count: 'count' },
    ]);

    const skipAmount = (parseInt(filterObj.pageNumber) - 1) * parseInt(filterObj.pageSize);
    pipeline.push({ $skip: skipAmount });

    pipeline.push({ $limit: parseInt(filterObj.pageSize) });

    TableReservation.aggregate(pipeline)
        .then((results) => {
            res.status(200).json({
                status: 'success',
                statusCode: 200,
                message: 'Get all Reserved Table',
                data: results,
                count: length.length > 0 ? length[0].count : 0,
            });
        })
        .catch((error) => {
            console.error(error);
        });

});


