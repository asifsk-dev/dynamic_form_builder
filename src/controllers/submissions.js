const Form = require("../models/Form");
const Submission = require("../models/Submission");
const validateSubmission = require("../utils/validateSubmission");

exports.submitForm = async (req, res, next) => {
  try {
    const form = await Form.findById(req.params.formId);
    if (!form || form.isDeleted) {
      return res.status(404).json({ error: "Form not found" });
    }

    const { answers } = req.body;

    const activeFields = form.fields.filter(f => !f.isDeleted);

    const errors = validateSubmission(activeFields, answers);

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    const submission = await Submission.create({
      formId: form._id,
      answers: answers,
      ip: req.ip
    });

    return res.status(201).json({
      message: "Form submitted successfully",
      submissionId: submission._id
    });

  } catch (err) {
    next(err);
  }
};

exports.getFormSubmissions = async (req, res, next) => {
  try {
    const { formId } = req.params;

    const form = await Form.findById(formId);
    if (!form || form.isDeleted) {
      return res.status(404).json({ error: "Form not found" });
    }

    const submissions = await Submission.find({ formId, isDeleted: false }, { _id: 1, formId: 1, answers: 1, ip: 1 }).sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Submissions fetched successfully",
      submissions
    });

  } catch (err) {
    next(err);
  }
};