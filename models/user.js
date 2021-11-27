const Joi = require("joi");
const mongoose = require("mongoose");

//defining a model
const User = mongoose.model(
  "users",
  new mongoose.Schema(
    {
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
      avatar: { type: String, default: null },
      isEmailVerified: { type: Boolean, default: false },
      isVerified: { type: Boolean, default: false },
      isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
  )
);

//User schema validation method to validate incoming data
const validateUser = (user) => {
  const schema = Joi.object({
    firstName: Joi.string().min(3).max(25).required(),
    lastName: Joi.string().min(3).max(25).required(),
    email: Joi.string().email().max(64).required(),
    password: Joi.string().min(10).max(255),
    username: Joi.string().min(4).max(25).required(),
    accountType: Joi.string(),
    avatar: Joi.string(),
    isEmailVerified: Joi.boolean,
    isVerified: Joi.boolean,
    isActive: Joi.boolean,
  });

  return schema.validate(user);
};

//exporting
exports.User = User;
exports.validate = validateUser;
