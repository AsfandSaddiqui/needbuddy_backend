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
        maxlength: 25,
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
        minlength: 10,
        maxlength: 20,
        enum: ["Entry", "Intermediate", "Expert"],
        required: true,
      },
      budget: {
        type: Number,
        min: 1,
        required: true,
      },

      skillsRequired: [
        {
          type: String,
          minlength: 3,
          required: true,
        },
      ],
      images: [
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
        unique: true,
      },
    },
    { timestamps: true }
  )
);

//User schema validation method to validate incoming data
const validateJob = (job) => {
  const schema = Joi.object({
    headline: Joi.string().min(3).max(25).required(),
    description: Joi.string().min(3).max(1500).required(),
    expertiseRequired: Joi.string().min(3).max(25).required(),
    skillsRequired: Joi.array().items(Joi.string()).required(),
    timeRequired: Joi.string().min(6).max(20).required(),
    images: Joi.array().items(Joi.string()),
    isActive: Joi.string().min(6).max(20),
    budget: Joi.number().min(1).required(),
    userId: Joi.required(),
  });

  return schema.validate(job);
};

//exporting
exports.Job = Job;
exports.validate = validateJob;