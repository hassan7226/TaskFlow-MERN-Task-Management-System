import transporter from "../config/nodemailer.js";
import mongoose from "mongoose";

// Get the userModel that's already registered
const userModel = mongoose.model("userModel");

/**
 * Send task assignment email to assigned users
 * @param {Array} assignedUserIds - Array of user IDs assigned to the task
 * @param {Object} taskDetails - Task details object
 * @param {Object} creatorDetails - Details of the user who created the task
 */
export const sendTaskAssignmentEmail = async (assignedUserIds, taskDetails, creatorDetails) => {
    try {
        console.log('Starting email notification process for task:', taskDetails.title);
        console.log('Assigned user IDs:', assignedUserIds);
        
        // Fetch assigned users' details
        const assignedUsers = await userModel.find({ _id: { $in: assignedUserIds } });
        console.log(`Found ${assignedUsers.length} assigned users`);
        
        // Send email to each assigned user
        const emailPromises = assignedUsers.map(async (user) => {
            try {
                console.log(`Preparing email for ${user.email}`);
                const mailOptions = {
                    from: process.env.SENDER_EMAIL,
                    to: user.email,
                    subject: `New Task Assigned: ${taskDetails.title}`,
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                                <h1 style="color: white; margin: 0; font-size: 24px;">🎯 New Task Assigned</h1>
                            </div>
                            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0;">
                                <p style="color: #333; font-size: 16px; margin-bottom: 20px;">
                                    Hello <strong>${user.name}</strong>,
                                </p>
                                <p style="color: #555; font-size: 14px; margin-bottom: 20px;">
                                    You have been assigned a new task. Here are the details:
                                </p>
                                
                                <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin-bottom: 20px;">
                                    <h2 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">${taskDetails.title}</h2>
                                    
                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 15px;">
                                        <div>
                                            <span style="color: #888; font-size: 12px; font-weight: bold;">PRIORITY:</span>
                                            <span style="color: #333; font-size: 14px; margin-left: 5px; text-transform: capitalize;">${taskDetails.priority}</span>
                                        </div>
                                        <div>
                                            <span style="color: #888; font-size: 12px; font-weight: bold;">DUE DATE:</span>
                                            <span style="color: #333; font-size: 14px; margin-left: 5px;">${new Date(taskDetails.dueDate).toLocaleDateString()}</span>
                                        </div>
                                        <div>
                                            <span style="color: #888; font-size: 12px; font-weight: bold;">STATUS:</span>
                                            <span style="color: #333; font-size: 14px; margin-left: 5px; text-transform: capitalize;">${taskDetails.status}</span>
                                        </div>
                                        <div>
                                            <span style="color: #888; font-size: 12px; font-weight: bold;">CREATED BY:</span>
                                            <span style="color: #333; font-size: 14px; margin-left: 5px;">${creatorDetails.name}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div style="text-align: center; margin-top: 30px;">
                                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/user/my-tasks" 
                                       style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                                        View Task
                                    </a>
                                </div>
                                
                                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center;">
                                    <p style="color: #999; font-size: 12px; margin: 0;">
                                        This is an automated email from TaskFlow. Please do not reply.
                                    </p>
                                </div>
                            </div>
                        </div>
                    `
                };
                
                const info = await transporter.sendMail(mailOptions);
                console.log(`✓ Email sent successfully to ${user.email}`);
                console.log(`  Message ID: ${info.messageId}`);
                return { success: true, email: user.email, messageId: info.messageId };
            } catch (error) {
                console.error(`✗ Failed to send email to ${user.email}:`, error);
                return { success: false, email: user.email, error: error.message };
            }
        });
        
        const results = await Promise.all(emailPromises);
        const successful = results.filter(r => r.success);
        const failed = results.filter(r => !r.success);
        
        console.log(`Email sending complete:`);
        console.log(`  ✓ Success: ${successful.length}`);
        console.log(`  ✗ Failed: ${failed.length}`);
        
        if (failed.length > 0) {
            console.error('Failed emails:', failed);
        }
        
    } catch (error) {
        console.error('Error in sendTaskAssignmentEmail:', error);
        throw error;
    }
};
