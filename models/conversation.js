const Joi = require("joi");
const mongoose = require("mongoose");

//defining a model
const Conversation = mongoose.model(
  "conversations",
  new mongoose.Schema(
    {
      members: {
        type: Array,
        required: true,
      },
    },
    { timestamps: true }
  )
);

//Job schema validation method to validate incoming data
const validate = (conversation) => {
  const schema = Joi.object({
    members: Joi.array().required(),
  });

  return schema.validate(conversation);
};

//exporting
exports.Conversation = Conversation;
exports.validate = validate;
