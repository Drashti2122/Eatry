const catchAsync = require("../utils/catchAsync");
const Category = require("../models/category.model");
const SubCategory = require("../models/subCategory.model");
const Table = require("../models/table.model");
const Order = require("../models/order.model")
const User = require("../models/user.model")
const OtpUser = require("../models/otpUser.model")
const Item = require("../models/item.model");
const TableReservation = require("../models/tableReservation.model")
const AppError = require("../utils/appError");
const Like = require("../models/like.model");

exports.getTotal = catchAsync(async (req, res, next) => {
    console.log(JSON.parse(req.params.data))
    let queryParams = JSON.parse(req.params.data);
    let modelName = queryParams.modelName;

    const models = {
        Category: {
            model: Category,
        },
        SubCategory: {
            model: SubCategory,
        },
        Item: {
            model: Item,
        },
        Order: {
            model: Order,
        },
        Table: {
            model: Table
        },
        OtpUser: {
            model: OtpUser
        },
        User: {
            model: User
        },
        TableReservation: {
            model: TableReservation
        },
        Like: {
            model: Like
        }
    }

    if (models[modelName]) {
        const Model = models[modelName].model;
        const totalCount = await Model.countDocuments();
        // console.log("Total Count:" + totalCount)

        res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Get total',
            data: totalCount,
        });
    } else {
        return next(new AppError('Invalid model name', 404))
    }
});