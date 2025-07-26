const mongoose = require('mongoose');

const AppSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resume: String,
  message: String
}, { timestamps: true });

module.exports = mongoose.model('Application', AppSchema);
