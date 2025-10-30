const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact
} = require('../controllers/contactController');
const { protect, admin } = require('../middleware/authMiddleware');

// Validation rules
const contactValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('message').trim().notEmpty().withMessage('Message is required')
];

// Routes
router.route('/')
  .post(contactValidation, createContact)
  .get(protect, admin, getAllContacts);

router.route('/:id')
  .get(protect, admin, getContactById)
  .put(protect, admin, updateContact)
  .delete(protect, admin, deleteContact);

module.exports = router;
