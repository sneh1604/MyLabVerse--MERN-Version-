const mongoose = require('mongoose');

const UploadHistorySchema = new mongoose.Schema({
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fileName: { type: String, required: true },
    reportType: { type: String, required: true },
    successCount: { type: Number, default: 0 },
    failureCount: { type: Number, default: 0 },
    errors: [{ 
        row: Number,
        message: String 
    }],
    uploadDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UploadHistory', UploadHistorySchema);
