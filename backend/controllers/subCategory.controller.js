const SubCategory = require("../models/subCategory.model");
const Category = require("../models/category.model");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.addSubCategory = catchAsync(async (req, res, next) => {
    //console.log(req.body)
    // const category = await Category.find();
    // //console.log(category);

    const addCategory = await SubCategory.create({
        subCategoryName: req.body.subCategoryName,
        categoryId: req.body.categoryId
    });

    res.status(201).json({
        status: 'success',
        statusCode: 201,
        message: "SubCategory successfully created"
    })
})

exports.getSubCategory = catchAsync(async (req, res, next) => {
    // //console.log("hii")
    const getSCategory = await SubCategory.find().populate('categoryId', 'categoryName -_id');
    //console.log(getSCategory)

    if (!getSCategory) {
        return next(new AppError('Record not found', 404))
    }

    res.status(200).json({
        status: 'success',
        statusCode: 200,
        message: "Get all SubCategory",
        data: getSCategory
    })
})

exports.getSubCategoryById = catchAsync(async (req, res, next) => {
    const getSubCatById = await SubCategory.findById(req.params.id);
    //console.log(getSubCatById)
    if (!getSubCatById) {
        return next(new AppError('Record not found', 404))
    }

    res.status(200).json({
        status: 'success',
        statusCode: 200,
        message: "Get SubCategory",
        data: getSubCatById
    })
})

exports.deleteSubCategory = catchAsync(async (req, res, next) => {
    // //console.log("hii")
    // //console.log(req.params.id)
    const delSubCategory = await SubCategory.findByIdAndDelete(req.params.id);

    if (!delSubCategory) {
        return next(new AppError('No document found with that ID', 404))
    }

    res.status(201).json({
        status: 'success',
        statusCode: 200,
        message: "SubCategory deleted successfully",
        data: delSubCategory
    })
})

exports.editSubCategory = catchAsync(async (req, res, next) => {

    const subId = await SubCategory.findOne({ _id: req.params.id });

    if (subId) {
        const editSCategory = await SubCategory.findByIdAndUpdate(req.params.id, req.body, {
            new: true, //«Boolean» if true, return the modified document rather than the original
            runValidators: true //«Boolean» if true, runs update validators on this command. Update validators validate the update operation against the model's schema
        });

        res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: "subCategory updated successfully",
            data: editSCategory
        })
    } else {
        return next(new AppError('No document found with that ID', 404))
    }
})