const Joi = require("joi");
const mongoose = require("mongoose");

//defining a model
const Conversation = mongoose.model(
  "conversations",
  new mongoose.Schema(
    {
      senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
      },
      receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
      },
    },
    { timestamps: true }
  )
);

//Job schema validation method to validate incoming data
const validate = (conversation) => {
  const schema = Joi.object({
    senderId: Joi.required(),
    receiverId: Joi.required(),
  });

  return schema.validate(conversation);
};

//exporting
exports.Conversation = Conversation;
exports.validate = validate;
