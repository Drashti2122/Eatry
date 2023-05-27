const Like = require("../models/like.model");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.addLikes = catchAsync(async (req, res, next) => {
    const likeExists = await Like.find({ itemId: req.body.itemId })
    console.log("count:" + likeExists.length)
    if (likeExists.length == 0) {
        await Like.create({
            itemId: req.body.itemId,
            count: 1
        });
    } else {
        await Like.updateOne({ itemId: req.body.itemId }, { $set: { count: likeExists[0].count + 1 } })
    }
    res.status(201).json({
        status: 'success',
        statusCode: 201,
        message: "Like successfully created",
    })
});


exports.searchFilter = catchAsync(async (req, res, next) => {
    // console.log("hii")
    console.log(JSON.parse(req.params.data))
    const filterObj = JSON.parse(req.params.data);
    const pipeline = [];

    pipeline.push({
        $lookup: {
            from: 'items',
            localField: 'itemId',
            foreignField: '_id',
            as: 'item',
        },
    });


    if (filterObj.searchName) {
        pipeline.push({
            $match: {
                $or: [
                    { 'item.itemName': { $regex: filterObj.searchName, $options: 'i' } },
                ]
            },
        });
    }


    // Projection stage to include the desired fields
    pipeline.push({
        $project: {
            itemName: { $arrayElemAt: ['$item.itemName', 0] },
            count: 1
            // $$ROOT: 1,
            // Include other fields as needed
        },
    });

    // Count stage to get the total count of matching documents
    const length = await Like.aggregate([
        ...pipeline,
        { $count: 'count' },
    ]);

    // Pagination - Skip stage
    const skipAmount = (parseInt(filterObj.pageNumber) - 1) * parseInt(filterObj.pageSize);
    pipeline.push({ $skip: skipAmount });

    // Limit stage to retrieve only the specified number of records per page
    pipeline.push({ $limit: parseInt(filterObj.pageSize) });

    Like.aggregate(pipeline)
        .then((results) => {
            res.status(200).json({
                status: 'success',
                statusCode: 200,
                message: 'Get all Like',
                data: results,
                count: length.length > 0 ? length[0].count : 0,
            });
        })
        .catch((error) => {
            console.error(error);
            // Handle any errors here
        });
})
