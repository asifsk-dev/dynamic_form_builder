const mongoose = require("mongoose");

const FieldSchema = new mongoose.Schema({
  label: { type: String, required: true },

  name: {
    type: String,
    required: true
  },

  type: {
    type: String,
    enum: [
      "text",
      "textarea",
      "number",
      "email",
      "date",
      "checkbox",
      "radio",
      "select"
    ],
    required: true
  },

  required: { type: Boolean, default: false },

  options: { type: [String], default: [] },

  validation: {
    min: Number,
    max: Number,
    regex: String
  },

  order: { type: Number, default: 0 },

  parentFieldId: { type: String, default: null },
  parentOptionValue: { type: String, default: null },

  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null }
});

const FormSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },

    fields: [FieldSchema],
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Form", FormSchema);
