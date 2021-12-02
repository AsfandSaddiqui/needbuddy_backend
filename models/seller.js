const Joi = require("joi");
const mongoose = require("mongoose");

//defining a model
const Seller = mongoose.model(
  "sellers",
  new mongoose.Schema(
    {
      headline: {
        type: String,
        maxlength: 25,
      },
      description: {
        type: String,
        maxlength: 1500,
      },

      expertise: { type: String },
      expertiseLevel: {
        type: String,
        maxlength: 20,
        enum: ["Entry", "Intermediate", "Expert"],
      },
      skills: [{ type: String }],
      badge: { type: String, enum: ["Top Rated", "Top Rated Plus", "Expert"] },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    },
    { timestamps: true }
  )
);

//User schema validation method to validate incoming data
const validateSeller = (seller) => {
  const schema = Joi.object({
    headline: Joi.string().min(3).max(25),
    description: Joi.string().min(3).max(1500),
    expertise: Joi.string(),
    expertiseLevel: Joi.string().max(20),
    skills: Joi.array(),
    badge: Joi.string().max(20),
    address: Joi.string().max(255),
    city: Joi.string().min(4).max(25),
    zipCode: Joi.number(),
    phoneNumber: Joi.string().min(10).max(11),
    avatar: Joi.string(),
    userId: Joi.string().required(),
  });

  return schema.validate(seller);
};

//exporting
exports.Seller = Seller;
exports.validate = validateSeller;
