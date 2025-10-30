const FinanceMethod = require('../models/FinanceMethod');
const { validationResult } = require('express-validator');

// @desc    Get all finance methods
// @route   GET /api/finance-methods
// @access  Public
const getAllFinanceMethods = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    const financeMethods = await FinanceMethod.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: financeMethods.length,
      data: financeMethods
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single finance method
// @route   GET /api/finance-methods/:id
// @access  Public
const getFinanceMethodById = async (req, res) => {
  try {
    const financeMethod = await FinanceMethod.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!financeMethod) {
      return res.status(404).json({ message: 'Finance method not found' });
    }

    res.json({
      success: true,
      data: financeMethod
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new finance method
// @route   POST /api/finance-methods
// @access  Private/Admin
const createFinanceMethod = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, category, methodology, benefits, imageUrl } = req.body;

    const financeMethod = await FinanceMethod.create({
      title,
      description,
      category,
      methodology,
      benefits,
      imageUrl,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Finance method created successfully',
      data: financeMethod
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update finance method
// @route   PUT /api/finance-methods/:id
// @access  Private/Admin
const updateFinanceMethod = async (req, res) => {
  try {
    const financeMethod = await FinanceMethod.findById(req.params.id);

    if (!financeMethod) {
      return res.status(404).json({ message: 'Finance method not found' });
    }

    const { title, description, category, methodology, benefits, imageUrl } = req.body;

    financeMethod.title = title || financeMethod.title;
    financeMethod.description = description || financeMethod.description;
    financeMethod.category = category || financeMethod.category;
    financeMethod.methodology = methodology || financeMethod.methodology;
    financeMethod.benefits = benefits || financeMethod.benefits;
    financeMethod.imageUrl = imageUrl || financeMethod.imageUrl;

    const updatedFinanceMethod = await financeMethod.save();

    res.json({
      success: true,
      message: 'Finance method updated successfully',
      data: updatedFinanceMethod
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete finance method
// @route   DELETE /api/finance-methods/:id
// @access  Private/Admin
const deleteFinanceMethod = async (req, res) => {
  try {
    const financeMethod = await FinanceMethod.findById(req.params.id);

    if (!financeMethod) {
      return res.status(404).json({ message: 'Finance method not found' });
    }

    await financeMethod.deleteOne();

    res.json({
      success: true,
      message: 'Finance method deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllFinanceMethods,
  getFinanceMethodById,
  createFinanceMethod,
  updateFinanceMethod,
  deleteFinanceMethod
};
