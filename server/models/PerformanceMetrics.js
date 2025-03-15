const mongoose = require("mongoose");

const PerformanceMetricsSchema = new mongoose.Schema({
    staffId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    reportsGenerated: {
        type: Number,
        default: 0
    },
    clientsServed: {
        type: Number,
        default: 0
    },
    testsProcessed: {
        type: Number,
        default: 0
    },
    reportTypes: {
        hemogram: { type: Number, default: 0 },
        lipid: { type: Number, default: 0 },
        bloodSugar: { type: Number, default: 0 },
        other: { type: Number, default: 0 }
    },
    averageProcessingTime: {
        type: Number, // in minutes
        default: 0
    }
});

const PerformanceMetricsModel = mongoose.model("performance_metrics", PerformanceMetricsSchema);

module.exports = PerformanceMetricsModel;
