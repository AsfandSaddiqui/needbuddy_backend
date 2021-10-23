const Joi = require("joi");
const mongoose = require("mongoose");

//defining a model
const User = mongoose.model(
  "Users",
  new mongoose.Schema({
    firstName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 25,
      lowercase: true,
    },
    lastName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 25,
      lowercase: true,
    },
    email: { type: String, required: true, maxlength: 64, lowercase: true },
    password: { type: String, required: true, minlength: 10, maxlength: 255 },
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 4,
      maxlength: 25,
      lowercase: true,
    },
    accountType: { type: String, required: true, enum: ["seller", "buyer"] },
    avatar: { type: String },
    isEmailVerified: { type: Boolean },
    isVerified: { type: Boolean },
    isActive: { type: Boolean },
    createAt: { type: Date },
    updatedAt: { type: Date },
  })
);

//User schema validation method to validate incoming data
const validateUser = (user) => {
  const schema = {
    firstName: Joi.string().minlength(3).maxlength(25).required(),
    lastName: Joi.string().minlength(3).maxlength(25).required(),
    email: Joi.string().email().maxlength(64).required(),
    password: Joi.string().minlength(10).maxlength(255).required(),
    username: Joi.string().minlength(4).maxlength(25).required(),
    accountType: Joi.string().required(),
    avatar: Joi.string(),
    isEmailVerified: Joi.boolean.required(),
    isVerified: Joi.boolean.required(),
    isActive: Joi.boolean.required(),
    createdAt: Joi.date().timestamp().required(),
    updatedAt: Joi.date().timestamp().required(),
  };

  return Joi.validate(user, schema);
};

//exporting
exports.User = User;
exports.validate = validateUser;
