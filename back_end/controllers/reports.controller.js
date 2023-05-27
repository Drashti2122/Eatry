const Order = require("../models/order.model");
const Item = require("../models/item.model");
const SubCategory = require("../models/subCategory.model");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.dailyReports = catchAsync(async (req, res, next) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set the time to the start of the day

    const result = await Order.aggregate([
        {
            $lookup: {
                from: "items",
                localField: "itemId",
                foreignField: "_id",
                as: "items"
            }
        },
        {
            $match: {
                createdAt: { $gte: today } // Filter orders created today
            }
        },
        {
            $unwind: "$items" // Unwind the "items" array
        },
        {
            $group: {
                _id: "$items._id",
                itemName: { $first: "$items.itemName" },
                count: { $sum: "$quantity" }
            }
        },
        {
            $sort: {
                totalQuantity: -1 // Sort by total quantity in descending order
            }
        },
        {
            $limit: parseInt(req.params.topMost) // Limit the result to top 5 items
        }
    ]);

    res.status(200).json({
        status: 'success',
        statusCode: 200,
        message: "daily Reports",
        data: result
    })
});

exports.topMostReport = catchAsync(async (req, res, next) => {
    console.log(req.params.topMost)

    // const likeExists = await Order.find()
    const topMostOrderedItems = await Order.aggregate([
        {
            $group: {
                _id: "$itemId",
                count: { $sum: 1 }
            }
        },
        {
            $sort: { count: -1 }
        },
        {
            $limit: parseInt(req.params.topMost)
        },
        {
            $lookup: {
                from: "items",
                localField: "_id",
                foreignField: "_id",
                as: "item"
            }
        },
        {
            $project: {
                _id: 0,
                itemName: { $arrayElemAt: ["$item.itemName", 0] },
                count: 1
            }
        }
    ]);

    console.log(topMostOrderedItems);

    res.status(200).json({
        status: 'success',
        statusCode: 200,
        message: "daily Reports",
        data: topMostOrderedItems
    })
});

exports.bestSellingItemList = catchAsync(async (req, res, next) => {
    const itemCount = await Order.aggregate([
        {
            $group: {
                _id: "$itemId",
                count: { $sum: 1 },
            },
        },
        { $sort: { count: -1 } },
        { $limit: 5 },
    ]);

    const itemIds = itemCount.map((item) => item._id);

    const items = await Item.find({ _id: { $in: itemIds } });

    const subCategoryCount = await Item.aggregate([
        {
            $group: {
                _id: "$subCategoryId",
                count: { $sum: 1 },
            },
        },
        { $sort: { count: -1 } },
        { $limit: 5 },
    ]);

    const subCategoryIds = subCategoryCount.map((subCategory) => subCategory._id);

    const subCategories = await SubCategory.find({ _id: { $in: subCategoryIds } });

    const topSubcategoriesWithTopItems = await Promise.all(
        subCategories.map(async (subCategory) => {
            const topItems = await Item.find({ subCategoryId: subCategory._id }).sort({ soldCount: -1 }).limit(6);
            return {
                subCategoryId: subCategory._id,
                subCategoryName: subCategory.subCategoryName,
                topItems: topItems,
            };
        })
    );

    console.log(topSubcategoriesWithTopItems)
    res.status(200).json({
        status: 'success',
        statusCode: 200,
        message: "Best sellings Reports",
        data: topSubcategoriesWithTopItems
    })
});