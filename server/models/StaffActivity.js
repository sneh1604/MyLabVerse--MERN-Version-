const mongoose = require("mongoose");

const StaffActivitySchema = new mongoose.Schema({
    staffId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    activityType: {
        type: String,
        enum: ['login', 'logout', 'report_creation', 'user_management', 'test_update'],
        required: true
    },
    details: {
        reportType: String,
        clientId: mongoose.Schema.Types.ObjectId,
        action: String,
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const StaffActivityModel = mongoose.model("staff_activities", StaffActivitySchema);

module.exports = StaffActivityModel;
