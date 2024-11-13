// models/BloodSugarReport.js
const mongoose = require('mongoose');

const BloodSugarReportSchema = new mongoose.Schema({
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    clientName: { type: String, required: true },
    fastingBloodSugar: { type: Number, required: true },
    postprandialBloodSugar: { type: Number, required: true },
    hba1c: { type: Number, required: true },
    totalCholesterol: { type: Number, required: true },
    triglycerides: { type: Number, required: true },
    dateCreated: { type: Date, default: Date.now },
});

const BloodSugarReport = mongoose.model('BloodSugarReport', BloodSugarReportSchema);

module.exports = BloodSugarReport;
