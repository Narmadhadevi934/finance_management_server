const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getAllFinanceMethods,
  getFinanceMethodById,
  createFinanceMethod,
  updateFinanceMethod,
  deleteFinanceMethod
} = require('../controllers/financeController');
const { protect, admin } = require('../middleware/authMiddleware');

// Validation rules
const financeMethodValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('methodology').trim().notEmpty().withMessage('Methodology is required')
];

// Routes
router.route('/')
  .get(getAllFinanceMethods)
  .post(protect, admin, financeMethodValidation, createFinanceMethod);

router.route('/:id')
  .get(getFinanceMethodById)
  .put(protect, admin, updateFinanceMethod)
  .delete(protect, admin, deleteFinanceMethod);

module.exports = router;
