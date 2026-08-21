import mongoose from 'mongoose';

const invitationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'expired'],
    default: 'pending'
  },
  invitedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'userModel',
    required: true
  },
  expiresAt: {
    type: Date,
    default: function() {
      return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
    }
  },
  acceptedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Method to check if invitation is expired
invitationSchema.methods.isExpired = function() {
  return this.expiresAt < new Date();
};

const Invitation = mongoose.model('Invitation', invitationSchema);

export default Invitation;
