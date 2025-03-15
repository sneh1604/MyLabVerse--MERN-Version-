const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
        unique: true // One profile per user
    },
    firstName: { 
        type: String, 
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    lastName: { 
        type: String, 
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    age: { 
        type: Number, 
        required: true,
        min: 0,
        max: 150
    },
    gender: { 
        type: String, 
        required: true, 
        enum: ['Male', 'Female', 'Other']
    },
    contact: { 
        type: String, 
        required: true,
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    address: { 
        type: String, 
        required: true,
        trim: true,
        maxlength: 200
    },
    medicalHistory: { 
        type: String,
        trim: true,
        maxlength: 1000
    }
}, {
    timestamps: true // Adds createdAt and updatedAt automatically
});

// Index for faster queries
ProfileSchema.index({ userId: 1 });

module.exports = mongoose.model('Profile', ProfileSchema);
