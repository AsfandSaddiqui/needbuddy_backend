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
        maxlength: 1500,
        lowercase: true,
        required: true,
      },
      timeRequired: {
        type: String,
        enum: ["less than 1 month", "1 to 3 months", "3 to 6 months"],
        required: true,
      },

      status: {
        type: String,
        maxlength: 20,
        enum: ["Ongoing", "Completed", "Canceled"],
        required: true,
      },
      amount: {
        type: Number,
        min: 1,
        required: true,
      },

      buyerReview: [
        {
          type: String,
          minlength: 3,
          required: true,
        },
      ],

      rating: {
        type: Double,
        ref: "jobs",
        required: true,
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
const validateJobSetup = (job) => {
  const schema = Joi.object({
    headline: Joi.string().min(3).max(25).required(),
    description: Joi.string().min(3).max(1500).required(),
    expertiseRequired: Joi.string().max(25).required(),
    skillsRequired: Joi.array().items(Joi.string()).required(),
    timeRequired: Joi.string().min(6).max(20).required(),
    attachments: Joi.array().items(Joi.string()),
    isActive: Joi.boolean,
    budget: Joi.number().min(1).required(),
    address: Joi.string().max(255),
    city: Joi.string().min(4).max(25),
    zipCode: Joi.number(),
    phoneNumber: Joi.string().min(10).max(11),
    avatar: Joi.string(),
    userId: Joi.required(),
  });

  return schema.validateJob(job);
};

//Job schema validation method to validate incoming data
const validateJob = (job) => {
  const schema = Joi.object({
    headline: Joi.string().min(3).max(25).required(),
    description: Joi.string().min(3).max(1500).required(),
    expertiseRequired: Joi.string().max(25).required(),
    skillsRequired: Joi.array().items(Joi.string()).required(),
    timeRequired: Joi.string().min(6).max(20).required(),
    attachments: Joi.array().items(Joi.string()),
    isActive: Joi.string().min(6).max(20),
    budget: Joi.number().min(1).required(),
    userId: Joi.required(),
  });

  return schema.validate(job);
};

//exporting
exports.Job = Job;
exports.validate = validateJob;
exports.validateJob = validateJobSetup;
