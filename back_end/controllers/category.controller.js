const Category = require("../models/category.model");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.addCategory = catchAsync(async (req, res, next) => {
    //console.log(req.body)
    const addCategory = await Category.create({
        categoryName: req.body.categoryName
    });

    res.status(201).json({
        status: 'success',
        statusCode: 201,
        message: "Category successfully created",
    })
})

exports.getCategory = catchAsync(async (req, res, next) => {
    const getCat = await Category.find();

    if (!getCat) {
        return next(new AppError('Record not found', 404))
    }

    res.status(200).json({
        status: 'success',
        statusCode: 200,
        message: "Get all Category",
        data: getCat
    })
})

// exports.searchFilter = catchAsync(async (req, res, next) => {
//     console.log(req.params.data)
//     const filterObj = JSON.parse(req.params.data);
// // console.log(filterObj.categoryName)
//     const pipeline = [];

//     // Match stage to filter records based on the categoryName field
//     if (filterObj.categoryName) {
//         pipeline.push({
//             $match: {
//                 $or: [
//                     { categoryName: { $regex: filterObj.categoryName, $options: 'i' } },
//                     // Add more fields to match here if needed
//                 ],
//             },
//         });
//     }

//     // Count stage to get the total count of matching documents
//     const length = await Category.find({
//         $or: [
//             { categoryName: { $regex: filterObj.categoryName } }
//         ],
//     }).count()

//     // Pagination - Skip stage
//     const skipAmount = (parseInt(filterObj.pageNumber) - 1) * parseInt(filterObj.pageSize);
//     pipeline.push({ $skip: skipAmount });

//     // Limit stage to retrieve only the specified number of records per page
//     pipeline.push({ $limit: parseInt(filterObj.pageSize) });

//     Category.aggregate(pipeline)
//         .then((results) => {

//             res.status(200).json({
//                 status: 'success',
//                 statusCode: 202,
//                 message: 'Get all Category',
//                 data: results,
//                 count:length
//             });
//         })
//         .catch((error) => {
//             console.error(error);
//             // Handle any errors here
//         });
// })

exports.getTotalCategoryData = catchAsync(async (req, res, next) => {
    const getTotal = await Category.find().count();
    //console.log(getTotal)

    res.status(200).json({
        status: 'success',
        statusCode: 200,
        message: "Get Category",
        data: getTotal
    })
});

exports.getCategoryById = catchAsync(async (req, res, next) => {
    const getCatById = await Category.findById(req.params.id);
    //console.log(getCatById)
    if (!getCatById) {
        return next(new AppError('Record not found', 404))
    }

    res.status(200).json({
        status: 'success',
        statusCode: 200,
        message: "Get Category",
        data: getCatById
    })
})

exports.deleteCategory = catchAsync(async (req, res, next) => {
    // //console.log("hii")
    // //console.log(req.params.id)
    const delCategory = await Category.findByIdAndDelete(req.params.id);

    if (!delCategory) {
        return next(new AppError('No document found with that ID', 404))
    }

    res.status(200).json({
        status: 'success',
        statusCode: 200,
        message: "Category deleted successfully",
    })
})

exports.editCategory = catchAsync(async (req, res, next) => {
    // //console.log(req.params.id)
    const catId = await Category.findOne({ _id: req.params.id });
    //console.log(catId)
    if (catId) {
        const editCategory = await Category.findByIdAndUpdate(req.params.id, req.body, {
            new: true, //«Boolean» if true, return the modified document rather than the original
            runValidators: true //«Boolean» if true, runs update validators on this command. Update validators validate the update operation against the model's schema
        });

        if (editCategory) {
            res.status(200).json({
                status: 'success',
                statusCode: 200,
                message: "Category updated successfully",
                data: editCategory
            })
        }

    } else {
        return next(new AppError('No document found with that ID', 404))
    }
})