const Joi = require("joi");
const mongoose = require("mongoose");

//defining a model
const ProjectCatalogue = mongoose.model(
  "catalogues",
  new mongoose.Schema(
    {
      headline: {
        type: String,
        minlength: 3,
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
      daysRequired: { type: Number, required: true },

      category: {
        type: String,
        maxlength: 30,
        required: true,
      },
      budget: {
        type: Number,
        min: 1,
        required: true,
      },

      specifications: [
        {
          type: Object,
          required: true,
        },
      ],
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

// Job schema validation method to validate incoming data

const validate = (catalogue) => {
  const schema = Joi.object({
    headline: Joi.string().min(3).required(),
    description: Joi.string().min(3).max(1500).required(),
    category: Joi.string().required(),
    specifications: Joi.array(),
    daysRequired: Joi.number().min(1).required(),
    attachments: Joi.array().items(Joi.string()),
    isActive: Joi.string().min(6).max(20),
    budget: Joi.number().min(1).required(),
    userId: Joi.required(),
  });

  return schema.validate(catalogue);
};

//exporting
exports.ProjectCatalogue = ProjectCatalogue;
exports.validate = validate;
