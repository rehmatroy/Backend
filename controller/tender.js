const Tenders = require('../model/tender');
const { validationResult } = require('express-validator');

const tender = new Tenders();

const getAllTenders = async (req, res, next) => {
  try {
    const [data] = await tender.getAllTenders();
    return res.status(200).json({ tenders: data });
  } catch (error) {
    return next({ code: 500, message: error });
  }
};

const createTender = async (req, res, next) => {
  const { name, description, price } = req.body;

  try {
    const result = await tender.createTender({ name, description, price });
    if (result) {
      return res.status(201).json({ message: 'Tender created successfully' });
    } else {
      return next({ code: 500, message: 'Failed to create tender' });
    }
  } catch (error) {
    return next({ code: 500, message: error });
  }
};

const updateTender = async (req, res, next) => {
  const { id } = req.params;
  const { name, description, price } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next({
      code: 400,
      message: errors.array(),
    });
  }

  try {
    const result = await tender.updateTender(id, { name, description, price });
    if (result) {
      return res.status(200).json({ message: 'Tender updated successfully' });
    } else {
      return next({ code: 404, message: 'Tender not found' });
    }
  } catch (error) {
    return next({ code: 500, message: error });
  }
};

const deleteTender = async (req, res, next) => {
  const { id } = req.params;

  try {
    const result = await tender.deleteTender(id);
    if (result) {
      return res.status(200).json({ message: 'Tender deleted successfully' });
    } else {
      return next({ code: 404, message: 'Tender not found' });
    }
  } catch (error) {
    return next({ code: 500, message: error });
  }
};

module.exports = {
  getAllTenders: getAllTenders,
  createTender: createTender,
  updateTender: updateTender,
  deleteTender: deleteTender,
};
