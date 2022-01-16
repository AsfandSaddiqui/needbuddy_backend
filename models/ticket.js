const Joi = require("joi");
const mongoose = require("mongoose");

//defining a model
const Ticket = mongoose.model(
  "tickets",
  new mongoose.Schema(
    {
      status: {
        type: String,
        maxlength: 20,
        required: true,
        default: "pending",
      },

      userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users",
      },

      description: {
        type: String,
        minlength: 3,
        maxlength: 1500,
        lowercase: true,
        required: true,
      },
      category: {
        type: String,
        minlength: 3,
        maxlength: 1500,
        lowercase: true,
        required: true,
      },
    },
    { timestamps: true }
  )
);

//Job schema validation method to validate incoming data
const validate = (ticket) => {
  const schema = Joi.object({
    status: Joi.string(),
    userId: Joi.required(),
    category: Joi.string().required(),
    description: Joi.string().required(),
  });

  return schema.validate(ticket);
};

//exporting
exports.Ticket = Ticket;
exports.validate = validate;
