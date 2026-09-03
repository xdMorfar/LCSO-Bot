const mongoose = require('mongoose');

module.exports = mongoose.model('Deputy', new mongoose.Schema({
 userId: String,
 username: String,
 rank: String,
 joinDate: Date,
 activityHours: {
  type: Number,
  default: 0
 }
}));
