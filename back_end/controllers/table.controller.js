const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Table = require("../models/table.model");
const TableReservation = require("../models/tableReservation.model");
const Notification = require("../models/notification.model");
const OtpUser = require("../models/otpUser.model");
const { EmitEvent } = require('../socket');

exports.addTable = catchAsync(async (req, res, next) => {
    //console.log("hiii")
    //console.log(req.body)
    const addTable = await Table.create({
        tableName: req.body.tableName,
        tableNo: req.body.tableNo,
        status: req.body.status
    });

    res.status(201).json({
        status: 'success',
        statusCode: 201,
        message: "Table successfully created",
    })
})

exports.getTable = catchAsync(async (req, res, next) => {
    const getTab = await Table.find();

    if (!getTab) {
        return next(new AppError('Record not found', 404))
    }

    res.status(200).json({
        status: 'success',
        statusCode: 200,
        message: "Get all Table",
        data: getTab
    })
})

exports.getTableById = catchAsync(async (req, res, next) => {
    const getTabById = await Table.findById(req.params.id);
    //console.log(getTabById)
    if (!getTabById) {
        return next(new AppError('Record not found', 404))
    }

    res.status(200).json({
        status: 'success',
        statusCode: 200,
        message: "Get Table",
        data: getTabById
    })
})

exports.deleteTable = catchAsync(async (req, res, next) => {
    const delTab = await Table.findByIdAndDelete(req.params.id);

    if (!delTab) {
        return next(new AppError('No document found with that ID', 404))
    }

    res.status(201).json({
        status: 'success',
        statusCode: 200,
        message: "Table deleted successfully",
    })
})

exports.editTable = catchAsync(async (req, res, next) => {
    const tabId = await Table.findOne({ _id: req.params.id });
    if (tabId) {
        const editTab = await Table.findByIdAndUpdate(req.params.id, req.body, {
            new: true, //«Boolean» if true, return the modified document rather than the original
            runValidators: true //«Boolean» if true, runs update validators on this command. Update validators validate the update operation against the model's schema
        });

        res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: "Table updated successfully",
            data: editTab
        })
    } else {
        return next(new AppError('No document found with that ID', 404))
    }
})

exports.editTableStatus = catchAsync(async (req, res, next) => {
    // //console.log("hii")
    //console.log(req.params.id)
    let tableStatus = await Table.find({ _id: req.params.id });

    let status = tableStatus[0].activeStatus;
    //console.log(tableStatus.activeStatus)
    if (tableStatus[0].activeStatus == 'active') {
        status = 'inactive';
    }
    if (tableStatus[0].activeStatus == 'inactive') {
        status = 'active';
    }

    if (tableStatus[0].activeStatus == 'active') {
        // await OtpUser.findOneAndDelete({ tableNo: req.params.id })
        const findUser = await OtpUser.find({ tableNo: req.params.id })

        if (findUser.length > 0) {
            await OtpUser.updateMany({ tableNo: req.params.id }, { $set: { status: 'inactive' } })
            await Notification.deleteMany({ tableId: req.params.id })
            EmitEvent("deleteNotification", "delete Notification")
            EmitEvent("userStatus", "inactive")
        }
    }

    if (tableStatus.length > 0) {
        await Table.findByIdAndUpdate(req.params.id, {
            activeStatus: status
        });

        res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: "Updated successfully"
        })
    }

});

exports.getTableId = catchAsync(async (req, res, next) => {
    //console.log(req.params.id)
    const id = req.params.id;
    const tableId = await Table.find({ tableNo: id }).select('id');

    if (tableId) {
        res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: "Get tableId successfully",
            data: tableId
        })
    } else {
        return next(new AppError('Somthing wrong!please scan again', 404))
    }
})