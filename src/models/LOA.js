const mongoose = require('mongoose');

module.exports = mongoose.model('LOA', new mongoose.Schema({
 deputyId: String,
 reason: String,
 startDate: Date,
 endDate: Date,
 status: {
  type: String,
  default: 'Pending'
 }
}));
