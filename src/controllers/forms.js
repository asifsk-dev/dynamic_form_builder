const { Types } = require("mongoose");
const Form = require("../models/Form");

exports.getAllForms = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
    const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 10;
    const skip = (page - 1) * limit;

    const totalForms = await Form.countDocuments({ isDeleted: false });

    const forms = await Form.aggregate([
      { $match: { isDeleted: false } },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          createdAt: 1,
          fields: {
            $sortArray: {
              input: {
                $filter: {
                  input: "$fields",
                  as: "f",
                  cond: { $eq: ["$$f.isDeleted", false] }
                }
              },
              sortBy: { order: 1 }
            }
          }
        }
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit }
    ]);

    return res.json({
      message: "Forms fetched successfully.",
      page,
      limit,
      totalForms,
      totalPages: Math.ceil(totalForms / limit),
      forms
    });
  } catch (err) {
    next(err);
  }
};

exports.createForm = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    const form = await Form.create({
      title,
      description,
      fields: []
    });

    return res.status(201).json({
      message: "Form created successfully", form: {
        _id: form._id,
        title: form.title,
        description: form.description,
        fields: form.fields
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const formId = new Types.ObjectId(req.params.id);
    const form = await Form.aggregate([
      {
        $match: {
          _id: formId,
          isDeleted: false
        }
      },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          createdAt: 1,
          fields: {
            $filter: {
              input: "$fields",
              as: "f",
              cond: { $eq: ["$$f.isDeleted", false] }
            }
          }
        }
      }
    ]);

    if (!form.length) return res.status(404).json({ message: "Forms not found." });

    return res.json({ message: "Forms fetched successfully.", form: form[0] });
  } catch (err) {
    next(err);
  }
};

exports.updateForm = async (req, res, next) => {
  try {
    const form = await Form.find({ _id: req.params.id, isDeleted: false }, {
      _id: 1,
      title: 1,
      description: 1,
      fields: 1,
      createdAt: 1
    });

    if (!form) return res.status(404).json({ message: "Forms not found." });

    const update = {
      title: req.body.title || form.title,
      description: req.body.description || form.description
    };

    await Form.updateOne({ _id: req.params.id }, update);

    return res.json({ message: "Forms update successfully." });
  } catch (err) {
    next(err);
  }
};

exports.deleteForm = async (req, res, next) => {
  try {
    const form = await Form.find({ _id: req.params.id, isDeleted: false });

    if (!form) return res.status(404).json({ message: "Forms not found." });

    const update = {
      isDeleted: true,
      deletedAt: new Date()
    };

    await Form.updateOne({ _id: req.params.id }, update);

    return res.json({ message: "Forms Deleted successfully." });
  } catch (err) {
    next(err);
  }
};