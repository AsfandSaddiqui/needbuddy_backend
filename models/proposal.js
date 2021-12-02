const Joi = require("joi");
const mongoose = require("mongoose");

//defining a model
const Proposal = mongoose.model(
  "proposals",
  new mongoose.Schema(
    {
      sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "sellers",
        required: true,
        unique: true,
      },
      coverLetter: {
        type: String,
        minlength: 3,
        maxlength: 1500,
        lowercase: true,
        required: true,
      },
      timeRequired: { type: String, lowercase: true, required: true },

      offer: {
        type: Number,
        min: 1,
        required: true,
      },

      attachments: [
        {
          type: String,
          maxlength: 300,
        },
      ],
      isActive: { type: Boolean, default: true },
      jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "jobs",
        required: true,
      },
    },
    { timestamps: true }
  )
);

//User schema validation method to validate incoming data
const validateProposal = (proposal) => {
  const schema = Joi.object({
    coverLetter: Joi.string().min(3).max(1500).required(),
    timeRequired: Joi.string().min(6).max(20).required(),
    attachments: Joi.array().items(Joi.string()),
    isActive: Joi.boolean,
    offer: Joi.number().min(1).required(),
    sellerId: Joi.required(),
    jobId: Joi.required(),
  });

  return schema.validate(proposal);
};

//exporting
exports.Proposal = Proposal;
exports.validate = validateProposal;
