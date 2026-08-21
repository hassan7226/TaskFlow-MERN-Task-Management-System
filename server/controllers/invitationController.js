import Invitation from '../models/Invitation.js';
import crypto from 'crypto';
import User from '../models/User.js';
import transporter from '../config/nodemailer.js';

// Generate a random token
const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Send invitation (admin only)
export const sendInvitation = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Check if there's already a pending invitation
    const existingInvitation = await Invitation.findOne({ email, status: 'pending' });
    if (existingInvitation) {
      // If existing invitation is expired, delete it
      if (existingInvitation.isExpired()) {
        await Invitation.findByIdAndDelete(existingInvitation._id);
      } else {
        return res.status(400).json({ message: 'Invitation already sent to this email' });
      }
    }

    // Create new invitation
    const token = generateToken();
    const invitation = await Invitation.create({
      email,
      token,
      invitedBy: req.user._id
    });

    // Send email with invitation link
    const clientUrl = process.env.CLIENT_URL || 
      (req.headers.host?.includes('vercel.app') ? 'https://taskflow-iota-liart.vercel.app' : 'http://localhost:5173');
    const invitationLink = `${clientUrl}/signup?token=${token}`;

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'Invitation to Join TaskFlow',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #4F46E5; margin: 0;">You're Invited to Join TaskFlow!</h1>
          </div>
          <p style="font-size: 16px; line-height: 1.6;">Hello,</p>
          <p style="font-size: 16px; line-height: 1.6;">You have been invited to join the TaskFlow team. Click the button below to create your account and get started.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${invitationLink}" style="background: linear-gradient(to right, #4F46E5, #7C3AED); color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Create Your Account</a>
          </div>
          <p style="font-size: 16px; line-height: 1.6;">Or copy and paste this link into your browser:</p>
          <p style="background: #F3F4F6; padding: 10px; border-radius: 4px; word-break: break-all; font-size: 14px;">${invitationLink}</p>
          <p style="color: #6B7280; font-size: 14px; margin-top: 20px;">This invitation will expire in 7 days.</p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
            <p style="color: #6B7280; font-size: 12px; margin: 0;">If you didn't expect this invitation, you can safely ignore this email.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message: 'Invitation sent successfully',
      invitation: {
        email: invitation.email,
        token: invitation.token,
        invitationLink,
        expiresAt: invitation.expiresAt
      }
    });
  } catch (error) {
    console.error('Error sending invitation:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Validate invitation token
export const validateInvitation = async (req, res) => {
  try {
    const { token } = req.params;

    const invitation = await Invitation.findOne({ token, status: 'pending' });

    if (!invitation) {
      return res.status(404).json({ message: 'Invalid or expired invitation' });
    }

    if (invitation.isExpired()) {
      await Invitation.findByIdAndUpdate(invitation._id, { status: 'expired' });
      return res.status(400).json({ message: 'Invitation has expired' });
    }

    res.status(200).json({
      message: 'Invitation is valid',
      email: invitation.email
    });
  } catch (error) {
    console.error('Error validating invitation:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Get all invitations (admin only)
export const getInvitations = async (req, res) => {
  try {
    // Filter invitations by admin's tenant
    const invitations = await Invitation.find({ invitedBy: req.user._id })
      .populate('invitedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Invitations fetched successfully',
      invitations
    });
  } catch (error) {
    console.error('Error fetching invitations:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Delete invitation (admin only)
export const deleteInvitation = async (req, res) => {
  try {
    const { id } = req.params;

    const invitation = await Invitation.findByIdAndDelete(id);

    if (!invitation) {
      return res.status(404).json({ message: 'Invitation not found' });
    }

    res.status(200).json({ message: 'Invitation deleted successfully' });
  } catch (error) {
    console.error('Error deleting invitation:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Accept invitation (called during signup)
export const acceptInvitation = async (token) => {
  try {
    const invitation = await Invitation.findOne({ token, status: 'pending' });

    if (!invitation) {
      throw new Error('Invalid or expired invitation');
    }

    if (invitation.isExpired()) {
      await Invitation.findByIdAndUpdate(invitation._id, { status: 'expired' });
      throw new Error('Invitation has expired');
    }

    await Invitation.findByIdAndUpdate(invitation._id, {
      status: 'accepted',
      acceptedAt: new Date()
    });

    return invitation.email;
  } catch (error) {
    throw error;
  }
};
