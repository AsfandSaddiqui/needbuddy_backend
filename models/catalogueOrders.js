const Joi = require("joi");
const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({});

//defining a model
const CatalogueOrders = mongoose.model(
  "catalogue_orders",
  new mongoose.Schema(
    {
      review: {
        type: String,
        minlength: 3,
        maxlength: 300,
        lowercase: true,
      },
      rating: {
        type: Number,
        default: 0,
      },

      status: {
        type: String,
        maxlength: 20,
        default: "Ongoing",
      },

      amount: {
        type: Number,
        min: 1,
        required: true,
      },

      buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users",
      },

      catalogueId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "catalogues",
        required: true,
      },

      specifications: [
        {
          type: Object,
        },
      ],
    },
    { timestamps: true }
  )
);

//Job schema validation method to validate incoming data
const validate = (order) => {
  const schema = Joi.object({
    buyerId: Joi.required(),
    catalogueId: Joi.required(),
    amount: Joi.number().required(),
    specifications: Joi.array(),
    review: Joi.string(),
    rating: Joi.number(),
  });

  return schema.validate(order);
};

//exporting
exports.CatalogueOrders = CatalogueOrders;
exports.validate = validate;
