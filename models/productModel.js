const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
    },
    veg: {
      type: Boolean,
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    recommended: {
      type: Boolean,
      required: false,
      trim: true,
    },
    img: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
