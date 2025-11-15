const { Parser } = require('json2csv');

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

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Example: /submissions?filter[fieldName]=value
    const filter = { formId, isDeleted: false };
    if (req.query.filter) {
      for (const [field, value] of Object.entries(req.query.filter)) {
        filter[`answers`] = {
          $elemMatch: { name: field, value: value }
        };
      }
    }

    const totalSubmissions = await Submission.countDocuments(filter);

    const submissions = await Submission.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);

    return res.status(200).json({
      message: "Submissions fetched successfully",
      formId,
      page,
      limit,
      totalSubmissions,
      totalPages: Math.ceil(totalSubmissions / limit),
      submissions
    });

  } catch (err) {
    next(err);
  }
};

exports.exportSubmissions = async (req, res, next) => {
  try {
    const { formId } = req.params;

    const form = await Form.findById(formId);
    if (!form || form.isDeleted) {
      return res.status(404).json({ error: "Form not found" });
    }

    const submissions = await Submission.find({ formId, isDeleted: false });

    if (!submissions.length) {
      return res.status(404).json({ error: "No submissions found for this form" });
    }

    // Transform submissions for CSV
    const data = submissions.map(sub => {
      const row = { submissionId: sub._id, submittedAt: sub.createdAt, ip: sub.ip };
      sub.answers.forEach(ans => {
        row[ans.name] = Array.isArray(ans.value) ? ans.value.join(', ') : ans.value;
      });
      return row;
    });

    const parser = new Parser();
    const csv = parser.parse(data);

    res.header('Content-Type', 'text/csv');
    res.attachment(`${form.title}_submissions.csv`);

    return res.send(csv);
  } catch (err) {
    next(err);
  }
};