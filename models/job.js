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
      },
      description: {
        type: String,
        minlength: 3,
        maxlength: 1500,
        lowercase: true,
      },
      timeRequired: { type: String, lowercase: true },

      expertiseRequired: {
        type: String,
        maxlength: 20,
      },
      budget: {
        type: Number,
        min: 1,
      },

      skillsRequired: {
        type: String,
        minlength: 3,
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
    headline: Joi.string().min(3).max(100),
    description: Joi.string().min(3).max(1500),
    expertiseRequired: Joi.string().max(25),
    skillsRequired: Joi.string(),
    timeRequired: Joi.string().min(6).max(20),
    attachments: Joi.array().items(Joi.string()),
    isActive: Joi.boolean,
    budget: Joi.number().min(1),
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
    headline: Joi.string().min(3).max(25),
    description: Joi.string().min(3).max(1500),
    expertiseRequired: Joi.string().max(25),
    skillsRequired: Joi.string(),
    timeRequired: Joi.string().min(6).max(20),
    attachments: Joi.array().items(Joi.string()),
    isActive: Joi.string().min(6).max(20),
    budget: Joi.number().min(1),
    userId: Joi.required(),
  });

  return schema.validate(job);
};

//exporting
exports.Job = Job;
exports.validate = validate;
exports.validateStep = validateStep;
