const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Item = require("../models/item.model");
const cloudinary = require('cloudinary').v2;
const slugify = require('slugify');
const { EmitEvent } = require('../socket');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});
const min = 999;
const max = 100000;
const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

exports.addItem = catchAsync(async (req, res, next) => {
    console.log(req.body)

    const options = {
        // folder: 'restaurant', // replace with your own upload_preset name
        public_id: slugify(req.body.itemName, { lower: true }) + randomNumber // replace with your own public_id value

    };

    const result = await cloudinary.uploader.upload(req.files.itemPicture.tempFilePath, options);
    if (result) {
        const addItem = await Item.create({
            itemName: req.body.itemName,
            itemPrice: req.body.itemPrice,
            itemPicture: result.url,
            subCategoryId: req.body.subCategoryName,
            foodType: req.body.foodType
        });

        // EmitEventForUser("addItem", "New Item Added")

        res.status(201).json({
            status: 'success',
            statusCode: 201,
            message: "Item successfully created"
        })
    }

})

exports.getItem = catchAsync(async (req, res, next) => {
    const getItem = await Item.find().populate('subCategoryId', 'subCategoryName -_id');
    //console.log(getItem)
    if (!getItem) {
        return next(new AppError('Record not found', 404))
    }

    res.status(200).json({
        status: 'success',
        statusCode: 200,
        message: "Get all Item",
        data: getItem
    })
})

exports.getItems = catchAsync(async (req, res, next) => {
    const getItem = await Item.aggregate([
        {
            $lookup: {
                from: "subcategories",
                localField: "subCategoryId",
                foreignField: "_id",
                as: "subCategory",
            },
        },
        {
            $unwind: "$subCategory",
        },
        {
            $lookup: {
                from: "categories",
                localField: "subCategory.categoryId",
                foreignField: "_id",
                as: "category",
            },
        },
        {
            $unwind: "$category",
        },
        {
            $group: {
                _id: {
                    categoryId: "$category._id",
                    subCategoryId: "$subCategory._id",
                },
                categoryName: { $first: "$category.categoryName" },
                subCategoryName: { $first: "$subCategory.subCategoryName" },
                items: {
                    $push: {
                        _id: "$_id",
                        itemName: "$itemName",
                        itemPrice: "$itemPrice",
                        itemPicture: "$itemPicture",
                        foodType: "$foodType",
                    },
                },
            },
        },
        {
            $group: {
                _id: {
                    categoryId: "$_id.categoryId",
                },
                categoryName: { $first: "$categoryName" },
                subCategories: {
                    $push: {
                        subCategoryId: "$_id.subCategoryId",
                        subCategoryName: "$subCategoryName",
                        items: "$items",
                    },
                },
            },
        },
        {
            $group: {
                _id: null,
                categories: {
                    $push: {
                        categoryId: "$_id.categoryId",
                        categoryName: "$categoryName",
                        subCategories: "$subCategories",
                    },
                },
            },
        },
        {
            $project: {
                _id: 0,
                categories: "$categories",
            },
        },
    ]);

    //console.log(getItem)
    if (!getItem) {
        return next(new AppError('Record not found', 404))
    }

    res.status(200).json({
        status: 'success',
        statusCode: 200,
        message: "Get all Item",
        data: getItem
    })
})

exports.getItemById = catchAsync(async (req, res, next) => {
    const getItemById = await Item.findById(req.params.id).populate('subCategoryId', 'subCategoryName');;
    //console.log(getItemById)
    if (!getItemById) {
        return next(new AppError('Record not found', 404))
    }

    res.status(200).json({
        status: 'success',
        statusCode: 200,
        message: "Get Item",
        data: getItemById
    })
})

exports.deleteItem = catchAsync(async (req, res, next) => {
    // //console.log(req.params.id)
    const item = await Item.findById(req.params.id).exec();
    // //console.log(item)
    const publicId = cloudinary.url(item.itemPicture, { secure: true, transformation: [{ quality: "auto" }] })
        .split("/")
        .slice(-1)[0]
        .split(".")[0];

    const result = await cloudinary.uploader.destroy(publicId);
    //console.log(result);
    if (result.result === "ok") {
        const delItem = await Item.findByIdAndDelete(req.params.id);

        if (!delItem) {
            return next(new AppError('No document found with that ID', 404))
        }

        res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: "Item deleted successfully",
        })
    }
})

exports.editItem = catchAsync(async (req, res, next) => {
    // //console.log("id" + req.params.id)
    // //console.log(req)
    const item = await Item.findById(req.params.id).exec();
    // //console.log(item)
    if (item) {
        if (req.files != null) {
            //console.log(req.params.id)
            //console.log("item Picture")
            //console.log(item)
            const publicId = cloudinary.url(item.itemPicture, { secure: true, transformation: [{ quality: "auto" }] })
                .split("/")
                .slice(-1)[0]
                .split(".")[0];
            //console.log(publicId)

            await cloudinary.uploader.destroy(publicId);

            const options = {
                // folder: 'restaurant', // replace with your own upload_preset name
                public_id: slugify(req.body.itemName, { lower: true }) + randomNumber // replace with your own public_id value

            };
            const result = await cloudinary.uploader.upload(req.files.itemPicture.tempFilePath, options);

            if (result) {
                const editItem = await Item.findByIdAndUpdate(req.params.id, {
                    itemName: req.body.itemName,
                    itemPrice: req.body.itemPrice,
                    itemPicture: result.url,
                    subCategoryId: req.body.subCategoryId
                }, {
                    new: true, //«Boolean» if true, return the modified document rather than the original
                    runValidators: true //«Boolean» if true, runs update validators on this command. Update validators validate the update operation against the model's schema
                });

                res.status(200).json({
                    status: 'success',
                    statusCode: 200,
                    message: "item updated successfully"
                })
            }
        } else {
            const editItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
                new: true, //«Boolean» if true, return the modified document rather than the original
                runValidators: true //«Boolean» if true, runs update validators on this command. Update validators validate the update operation against the model's schema
            });

            res.status(200).json({
                status: 'success',
                statusCode: 200,
                message: "item updated successfully"
            })
        }
    } else {
        return next(new AppError('No document found with that ID', 404))
    }
})