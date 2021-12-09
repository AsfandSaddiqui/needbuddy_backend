const Joi = require("joi");
const mongoose = require("mongoose");

//defining a model
const Project = mongoose.model(
  "projects",
  new mongoose.Schema(
    {
      sellerReview: {
        type: String,
        minlength: 3,
        maxlength: 300,
        lowercase: true,
      },
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

      buyerReview: 
        {
          type: String,
          minlength: 3,
          maxlength:300
        },
      

      rating: {
        type: Number,
    
      
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
  });

  return schema.validate(project);
};



//exporting
exports.Project = Project;
exports.validate = validate;

