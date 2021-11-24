const Joi = require("joi");
const mongoose = require("mongoose");

//defining a model
const UserTeaser = mongoose.model(
  "users_teaser",
  new mongoose.Schema({
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
  })
);

//User schema validation method to validate incoming data
const validateUser = (user) => {
  const schema = {
    username: Joi.string().minlength(4).maxlength(25).required(),
    accountType: Joi.string().required(),
    avatar: Joi.string(),
    isEmailVerified: Joi.boolean.required(),
    isVerified: Joi.boolean.required(),
    isActive: Joi.boolean.required(),
    createdAt: Joi.date().timestamp().required(),
  };

  return Joi.validate(user, schema);
};

//exporting
exports.UserTeaser = UserTeaser;
exports.validateUserTeaser = validateUser;
