const Form = require("../models/Form");

exports.addField = async (req, res, next) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ error: "Form not found" });

    const fields = req.body;

    if (!Array.isArray(fields) || fields.length === 0) {
      return res.status(400).json({ error: "Fields array is required" });
    }

    const incomingNames = fields.map(f => f.name);
    const hasDuplicateInsidePayload =
      new Set(incomingNames).size !== incomingNames.length;

    if (hasDuplicateInsidePayload) {
      return res.status(400).json({ error: "Duplicate field names found in payload" });
    }

    const existingNames = form.fields.map(f => f.name);

    const duplicates = incomingNames.filter(name => existingNames.includes(name));
    if (duplicates.length > 0) {
      return res.status(400).json({
        error: `Field name(s) already exist in this form: ${duplicates.join(", ")}`
      });
    }

    form.fields.push(...fields);

    await form.save();

    res.status(201).json({ message: "Fields added successfully." });

  } catch (err) {
    next(err);
  }
};

exports.updateField = async (req, res, next) => {
  try {
    const { id: formId, fieldId } = req.params;
    const updates = req.body;

    const form = await Form.findOne({ _id: formId, isDeleted: false });
    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    const field = form.fields.id(fieldId);
    if (!field) {
      return res.status(404).json({ error: "Field not found" });
    }

    if (updates.name && updates.name !== field.name) {
      const exists = form.fields.some(f => f.name === updates.name);
      if (exists) {
        return res.status(400).json({
          error: `Field name '${updates.name}' already exists in this form`
        });
      }
    }

    Object.keys(updates).forEach(key => {
      field[key] = updates[key];
    });

    await form.save();

    res.json({
      message: "Field updated successfully."
    });

  } catch (err) {
    next(err);
  }
};

exports.removeField = async (req, res, next) => {
  try {
    const { id: formId, fieldId } = req.params;

    const form = await Form.findOne({ _id: formId, isDeleted: false });
    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    const field = form.fields.id(fieldId);
    if (!field) {
      return res.status(404).json({ error: "Field not found" });
    }

    field.isDeleted = true;
    field.deletedAt = new Date();

    await form.save();

    res.json({
      message: "Field updated successfully."
    });

  } catch (err) {
    next(err);
  }
};

exports.reorderFields = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { order } = req.body;

    if (!Array.isArray(order) || order.length === 0) {
      return res.status(400).json({ error: "Order array is required" });
    }

    const form = await Form.findOne({ _id: id, isDeleted: false }).lean();
    if (!form) return res.status(404).json({ error: "Form not found" });

    const fieldIds = form.fields.map(f => f._id.toString());

    for (const fieldId of order) {
      if (!fieldIds.includes(fieldId)) {
        return res.status(400).json({ error: `Invalid field id: ${fieldId}` });
      }
    }

    const operations = order.map((fieldId, index) => ({
      updateOne: {
        filter: { _id: id, "fields._id": fieldId },
        update: { $set: { "fields.$.order": index + 1 } }
      }
    }));

    await Form.bulkWrite(operations);

    return res.json({ message: "Fields reordered successfully" });

  } catch (err) {
    next(err);
  }
};
