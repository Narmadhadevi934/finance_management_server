const Contact = require('../models/Contact');
const { validationResult } = require('express-validator');

// @desc    Create new contact inquiry
// @route   POST /api/contact
// @access  Public
const createContact = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, subject, message, inquiryType } = req.body;

    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
      inquiryType: inquiryType || 'General'
    });

    res.status(201).json({
      success: true,
      message: 'Your inquiry has been submitted successfully',
      data: contact
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all contact inquiries
// @route   GET /api/contact
// @access  Private/Admin
const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single contact inquiry
// @route   GET /api/contact/:id
// @access  Private/Admin
const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: 'Contact inquiry not found' });
    }

    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update contact inquiry status
// @route   PUT /api/contact/:id
// @access  Private/Admin
const updateContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: 'Contact inquiry not found' });
    }

    const { status } = req.body;

    contact.status = status || contact.status;
    if (status === 'resolved') {
      contact.resolvedAt = Date.now();
    }

    const updatedContact = await contact.save();

    res.json({
      success: true,
      message: 'Contact inquiry updated successfully',
      data: updatedContact
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete contact inquiry
// @route   DELETE /api/contact/:id
// @access  Private/Admin
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: 'Contact inquiry not found' });
    }

    await contact.deleteOne();

    res.json({
      success: true,
      message: 'Contact inquiry deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact
};
