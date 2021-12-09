const Joi = require("joi");
const mongoose = require("mongoose");

const reviewSchema= mongoose.Schema(
    {
      review: {
        type: String,
        minlength: 3,
        maxlength: 300,
        lowercase: true,
      },   
      rating: {
        type: Number,
      }
     } );

//defining a model
const Project = mongoose.model(
  "projects",
  new mongoose.Schema(
    {
      sellerReview: reviewSchema,

      // timeRequired: {
      //   type: String,
      //   enum: ["less than 1 month", "1 to 3 months", "3 to 6 months"],
      //   required: true,
      // },

      status: {
        type: String,
        maxlength: 20,
        enum: ["Ongoing", "Completed", "Canceled"],
        required: true,
        default: "Ongoing"
      },
      // amount: {
      //   type: Number,
      //   min: 1,
      //   required: true,
      // },

      buyerReview: reviewSchema,
      
      sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "sellers"
      },
      buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users"
      },

      proposalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "proposals",
        required: true,
      },
      jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "jobs",
        required: true,
      },
    },
    { timestamps: true }
  )
);

//Job schema validation method to validate incoming data
const validate = (project) => {
  const schema = Joi.object({
    proposalId: Joi.required(),
    jobId: Joi.required(),
    sellerId: Joi.required(),
    buyerId: Joi.required(),
  });

  return schema.validate(project);
};

//Converting string to object ID
const stringToObject = (id) => {
  const result = mongoose.Types.ObjectId(id);

  return result;
};



//exporting
exports.Project = Project;
exports.validate = validate;
exports.stringToObject = stringToObject;

