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
      address: {
        type: String,
        minlength: 4,
        maxlength: 255,
        lowercase: true,
        default: null,
      },
      city: {
        type: String,
        minlength: 4,
        maxlength: 25,
        lowercase: true,
        default: null,
      },

      zipCode: {
        type: Number,
        minlength: 4,
        maxlength: 25,
        default: null,
      },
      phoneNumber: {
        type: String,
        minlength: 10,
        maxlength: 11,
        default: null,
      },
      accountType: {
        type: String,
        required: true,
        enum: ["seller", "buyer", "admin"],
      },
      avatar: { type: String, default: null },
      isEmailVerified: { type: Boolean, default: false },
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
    address: Joi.string().max(255),
    city: Joi.string().min(4).max(25),
    zipCode: Joi.number(),
    phoneNumber: Joi.string().min(10).max(11),
    avatar: Joi.string(),
    isEmailVerified: Joi.boolean,
    isActive: Joi.boolean,
  });

  return schema.validate(user);
};

//exporting
exports.User = User;
exports.validate = validateUser;
