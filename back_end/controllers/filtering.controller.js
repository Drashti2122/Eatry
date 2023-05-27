const catchAsync = require("../utils/catchAsync");
const mongoose = require("mongoose");

const Category = require("../models/category.model");
const SubCategory = require("../models/subCategory.model");
const Table = require("../models/table.model");
const Order = require("../models/order.model")
const User = require("../models/user.model")
const Bill = require("../models/bill.model")
const OtpUser = require("../models/otpUser.model")
const Item = require("../models/item.model")
const Like = require("../models/like.model")

exports.searchFilter = catchAsync(async (req, res, next) => {
  console.log(req.params.data);
  const filterObj = JSON.parse(req.params.data);
  console.log(filterObj)
  const modelName = filterObj.model;

  // Define your models and their associated fields here
  const models = {
    Category: {
      model: Category,
      searchFields: ["categoryName"],
    },
    SubCategory: {
      model: SubCategory,
      searchFields: ["subCategoryName"],
      populateFields: [
        {
          field: "categoryId",
          matchField: "categoryName",
        },
      ]
    },
    Table: {
      model: Table,
      searchFields: ["tableName"],
    },
    Like: {
      model: Like,
      searchFields: [""],
      populateFields: [
        {
          field: "itemId",
          matchField: "itemName",
        },
      ]
    },
    Order: {
      model: Order,
      searchFields: [""],
      populateFields: [
        {
          field: "tableNo",
          matchField: "tableName",
        },
        {
          field: "itemId",
          matchField: "itemName",
        },
      ]
    },
    User: {
      model: User,
      searchFields: ["userName", "userEmail", "userContactNo"]
    },
    OtpUser: {
      model: OtpUser,
      searchFields: ["groupName"]
    },
    Item: {
      model: Item,
      searchFields: ["itemName", "itemPrice", "foodType"],
      populateFields: [
        {
          field: "subCategoryId",
          matchField: "subCategoryName",
        },
      ]
    },
    Bill: {
      model: Bill,
      searchFields: [""],
      populateFields: [
        {
          field: "otpUserId",
          matchField: "groupName", // Match against "groupName"
        },
        {
          field: "tableId",
          matchField: "tableName", // Match against "tableName"
        },
      ],
    },
    // Add more models with their fields here
  };

  if (!models[modelName]) {
    throw new Error("Invalid model name");
  }

  const { model, searchFields, populateFields } = models[modelName];
  const pipeline = [];

  // If populating other models, add the $lookup and $match stages
  if (populateFields) {
    populateFields.forEach((populateEntry, index) => {
      const asField = `${populateEntry.field}_${index}`;

      pipeline.push({
        $lookup: {
          from: "categories",
          localField: populateEntry.field,
          foreignField: "_id",
          as: asField,
        },
      });

      pipeline.push({
        $lookup: {
          from: "tables",
          localField: populateEntry.field,
          foreignField: "_id",
          as: asField,
        },
      });

      pipeline.push({
        $lookup: {
          from: "otpusers",
          localField: populateEntry.field,
          foreignField: "_id",
          as: asField,
        },
      });

      pipeline.push({
        $lookup: {
          from: "subcategories",
          localField: populateEntry.field,
          foreignField: "_id",
          as: asField,
        },
      });

      pipeline.push({
        $lookup: {
          from: "items",
          localField: populateEntry.field,
          foreignField: "_id",
          as: asField,
        },
      });
    });

    // Additional $lookup stages specific to the Bill model
    pipeline.push({
      $lookup: {
        from: "otpusers",
        localField: "otpUserId",
        foreignField: "_id",
        as: "otpUserId",
      },
    });

    pipeline.push({
      $lookup: {
        from: "tables",
        localField: "tableId",
        foreignField: "_id",
        as: "tableId",
      },
    });

    // Additional $lookup stages specific to the Category model
    pipeline.push({
      $lookup: {
        from: "categories",
        localField: "categoryId",
        foreignField: "_id",
        as: "categoryId",
      },
    });

    pipeline.push({
      $lookup: {
        from: "subcategories",
        localField: "subCategoryId",
        foreignField: "_id",
        as: "subCategoryId",
      },
    });

    pipeline.push({
      $lookup: {
        from: "items",
        localField: "itemId",
        foreignField: "_id",
        as: "itemId",
      },
    });

    // Match stage for the Bill model
    pipeline.push({
      $match: {
        $or: [
          { "otpUserId.groupName": { $regex: filterObj.searchName, $options: "i" } },
          { "tableId.tableName": { $regex: filterObj.searchName, $options: "i" } },
          { "categoryId.categoryName": { $regex: filterObj.searchName, $options: "i" } },
          { "subCategoryId.subCategoryName": { $regex: filterObj.searchName, $options: "i" } },
          { "itemId.itemName": { $regex: filterObj.searchName, $options: "i" } },
        ],
      },
    });
  }

  // Match stage to filter records based on the search criteria
  if (filterObj.searchName) {
    const matchExpressions = searchFields.map((field) => ({
      [field]: { $regex: filterObj.searchName, $options: "i" },
    }));

    pipeline.push({
      $match: {
        $or: matchExpressions,
      },
    });
  }

  // Count stage to get the total count of matching documents
  const length = await model.countDocuments({
    $or: searchFields.map((field) => ({
      [field]: { $regex: filterObj.searchName, $options: "i" },
    }))
  });

  // Pagination - Skip stage
  const skipAmount = (parseInt(filterObj.pageNumber) - 1) * parseInt(filterObj.pageSize);
  pipeline.push({ $skip: skipAmount });

  // Limit stage to retrieve only the specified number of records per page
  pipeline.push({ $limit: parseInt(filterObj.pageSize) });

  model.aggregate(pipeline)
    .then((results) => {
      res.status(200).json({
        status: "success",
        statusCode: 200,
        message: "Get all filtering data",
        data: results,
        count: length,
      });
    })
    .catch((error) => {
      console.error(error);
    });
});