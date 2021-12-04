const Joi = require("joi");
const mongoose = require("mongoose");

//defining a model
const Message = mongoose.model(
  "conversations",
  new mongoose.Schema(
    {
      conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "conversations",
        required: true,
      },
      senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
    },
    { timestamps: true }
  )
);

//Job schema validation method to validate incoming data
const validate = (message) => {
  const schema = Joi.object({
    text: Joi.string().required(),
    senderId: Joi.required(),
    conversationId: Joi.required(),
  });

  return schema.validate(message);
};

//exporting
exports.Message = Message;
exports.validate = validate;
