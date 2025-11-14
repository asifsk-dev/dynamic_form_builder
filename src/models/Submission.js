const mongoose = require("mongoose");

const AnswerSchema = new mongoose.Schema({
  fieldId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  parentFieldId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  parentOptionValue: {
    type: String,
    default: null
  }
});

const SubmissionSchema = new mongoose.Schema(
  {
    formId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Form",
      required: true
    },
    answers: {
      type: [AnswerSchema],
      required: true
    },
    ip: {
      type: String,
      default: null
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    deletedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Submission", SubmissionSchema);
