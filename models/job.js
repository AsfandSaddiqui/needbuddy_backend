const Joi = require("joi");
const mongoose = require("mongoose");

//defining a model
const Job = mongoose.model(
  "jobs",
  new mongoose.Schema(
    {
      headline: {
        type: String,
        minlength: 3,
        maxlength: 100,
        lowercase: true,
        required: true,
      },
      description: {
        type: String,
        minlength: 3,
        maxlength: 1500,
        lowercase: true,
        required: true,
      },
      timeRequired: { type: String, lowercase: true, required: true },

      expertiseRequired: {
        type: String,
        maxlength: 20,
        required: true,
      },
      budget: {
        type: Number,
        min: 1,
        required: true,
      },

      skillsRequired: {
        type: String,
        minlength: 3,
        required: true,
      },

      attachments: [
        {
          type: String,
          maxlength: 300,
        },
      ],
      isActive: { type: Boolean, default: true },

      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
      },
    },
    { timestamps: true }
  )
);

//Job schema validation method to validate incoming data
const validateStep = (job) => {
  const schema = Joi.object({
    headline: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(3).max(1500).required(),
    expertiseRequired: Joi.string().max(25).required(),
    skillsRequired: Joi.string().required(),
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

  return schema.validate(job);
};

// Job schema validation method to validate incoming data

const validate = (job) => {
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
exports.validate = validate;
exports.validateStep = validateStep;
