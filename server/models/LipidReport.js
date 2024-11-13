// models/LipidReport.js
const mongoose = require('mongoose');

const LipidReportSchema = new mongoose.Schema({
    clientName: { type: String, required: true },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // New field for client ID
    serumCholesterol: { type: Number, required: true },
    serumTriglyceride: { type: Number, required: true },
    hdlCholesterol: { type: Number, required: true },
    ldlCholesterol: { type: Number, required: true },
    vldlCholesterol: { type: Number, required: true },
    ldlHdlRatio: { type: Number, required: true },
    totalCholesterolHdlRatio: { type: Number, required: true },
    totalLipids: { type: Number, required: true },
    dateCreated: { type: Date, default: Date.now },
});

const LipidReport = mongoose.model('LipidReport', LipidReportSchema);
module.exports = LipidReport;
