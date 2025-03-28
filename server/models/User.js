const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, default: 'user' },
  firebaseUID: { type: String, sparse: true },
  userTokenID: { 
    type: String, 
    unique: true, 
    sparse: true,
    validate: {
      validator: function(v) {
        // Allow LIMSGL-XXX format where X can be alphanumeric
        return /^LIMSGL-[A-Z0-9]{3,6}$/.test(v);
      },
      message: props => `${props.value} is not a valid token ID format! Should be LIMSGL-XXX where X is alphanumeric`
    }
  },
  authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
  createdAt: { type: Date, default: Date.now }
});

// Pre-save middleware to ensure required fields
userSchema.pre('save', function(next) {
  if (!this.name) {
    this.name = `User_${this._id}`;
  }
  if (!this.email) {
    this.email = `user_${this._id}@placeholder.com`;
  }
  next();
});

module.exports = mongoose.model('User', userSchema);