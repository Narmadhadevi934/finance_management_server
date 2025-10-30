const mongoose = require('mongoose');

const financeMethodSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    trim: true
  },
  methodology: {
    type: String,
    required: [true, 'Please add methodology details'],
    trim: true
  },
  benefits: [{
    type: String,
    trim: true
  }],
  imageUrl: {
    type: String,
    default: 'https://via.placeholder.com/400x300?text=Finance+Method'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('FinanceMethod', financeMethodSchema);
