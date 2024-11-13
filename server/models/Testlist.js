const mongoose = require('mongoose');

const TestListSchema = new mongoose.Schema({
    name: String,
    description: String,
    cost: Number,
    status: Boolean,
    delete_flag: Boolean,
    date_created: { type: Date, default: Date.now },
    date_updated: { type: Date, default: null }
});

module.exports = mongoose.model('TestList', TestListSchema);
