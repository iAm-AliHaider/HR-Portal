// Email service for server-side use only
// For client-side, use the API routes

// Conditional import for server-side only
const getNodemailer = async () => {
  if (typeof window === 'undefined') {
    // Server-side only
    return await import('nodemailer');
  }
  return null;
};

// Email configuration interface
interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

// Email template interface
interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
}

// Email sending interface
interface SendEmailParams {
  to: string | string[];
  template: string;
  data: Record<string, any>;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

class EmailService {
  private transporter: any = null;
  private isDevelopment: boolean;
  private isServer: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.isServer = typeof window === 'undefined';
  }

  private async initialize() {
    if (!this.isServer) {
      console.log('📧 Email service: Client-side, use API routes');
      return;
    }

    if (this.isDevelopment) {
      console.log('📧 Email service initialized in development mode');
      return;
    }

    try {
      const nodemailer = await getNodemailer();
      if (!nodemailer) return;

      // Validate environment variables
      if (!this.validateEnvironment()) {
        throw new Error('Missing required email environment variables');
      }

      const config: EmailConfig = {
        host: process.env.SMTP_HOST!,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER!,
          pass: process.env.SMTP_PASS!
        }
      };

      this.transporter = nodemailer.default.createTransport(config);

      // Verify connection
      await this.transporter.verify();
      console.log('✅ Email service connected successfully');
    } catch (error) {
      console.error('❌ Email service initialization failed:', error);
      this.transporter = null;
    }
  }

  private validateEnvironment(): boolean {
    const requiredVars = [
      'SMTP_HOST',
      'SMTP_USER',
      'SMTP_PASS',
      'EMAIL_FROM'
    ];

    const missing = requiredVars.filter(varName => !process.env[varName]);
    
    if (missing.length > 0) {
      console.warn('Missing environment variables:', missing);
      return false;
    }
    
    return true;
  }

  // Email templates
  private getEmailTemplates(): Record<string, (data: any) => EmailTemplate> {
    return {
      // Leave request notification
      leaveRequest: (data: { employeeName: string; leaveType: string; startDate: string; endDate: string; reason: string; managerName: string }) => ({
        subject: `Leave Request from ${data.employeeName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">New Leave Request</h2>
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Employee:</strong> ${data.employeeName}</p>
              <p><strong>Leave Type:</strong> ${data.leaveType}</p>
              <p><strong>Start Date:</strong> ${data.startDate}</p>
              <p><strong>End Date:</strong> ${data.endDate}</p>
              <p><strong>Reason:</strong> ${data.reason}</p>
            </div>
            <p>Hi ${data.managerName},</p>
            <p>A new leave request has been submitted and requires your approval.</p>
            <a href="${process.env.NEXTAUTH_URL}/leave/approvals" 
               style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0;">
              Review Request
            </a>
            <p>Best regards,<br>HR Portal Team</p>
          </div>
        `,
        text: `New Leave Request from ${data.employeeName}\n\nLeave Type: ${data.leaveType}\nStart Date: ${data.startDate}\nEnd Date: ${data.endDate}\nReason: ${data.reason}\n\nPlease review at: ${process.env.NEXTAUTH_URL}/leave/approvals`
      }),

      // Leave approval notification
      leaveApproval: (data: { employeeName: string; leaveType: string; status: string; managerName: string; comments?: string }) => ({
        subject: `Leave Request ${data.status}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: ${data.status === 'approved' ? '#059669' : '#dc2626'};">Leave Request ${data.status}</h2>
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Status:</strong> <span style="color: ${data.status === 'approved' ? '#059669' : '#dc2626'}; text-transform: uppercase;">${data.status}</span></p>
              <p><strong>Leave Type:</strong> ${data.leaveType}</p>
              <p><strong>Reviewed by:</strong> ${data.managerName}</p>
              ${data.comments ? `<p><strong>Comments:</strong> ${data.comments}</p>` : ''}
            </div>
            <p>Hi ${data.employeeName},</p>
            <p>Your leave request has been ${data.status} by ${data.managerName}.</p>
            <a href="${process.env.NEXTAUTH_URL}/leave" 
               style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0;">
              View Details
            </a>
            <p>Best regards,<br>HR Portal Team</p>
          </div>
        `
      }),

      // Training enrollment
      trainingEnrollment: (data: { employeeName: string; courseName: string; startDate: string; instructor: string }) => ({
        subject: `Training Enrollment Confirmation: ${data.courseName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Training Enrollment Confirmed</h2>
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Course:</strong> ${data.courseName}</p>
              <p><strong>Start Date:</strong> ${data.startDate}</p>
              <p><strong>Instructor:</strong> ${data.instructor}</p>
            </div>
            <p>Hi ${data.employeeName},</p>
            <p>You have been successfully enrolled in the training course.</p>
            <a href="${process.env.NEXTAUTH_URL}/training" 
               style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0;">
              View Training
            </a>
            <p>Best regards,<br>HR Portal Team</p>
          </div>
        `
      }),

      // Welcome email for new employees
      welcome: (data: { employeeName: string; position: string; department: string; startDate: string; managerName: string }) => ({
        subject: `Welcome to the Team, ${data.employeeName}!`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Welcome to Our Team!</h2>
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Position:</strong> ${data.position}</p>
              <p><strong>Department:</strong> ${data.department}</p>
              <p><strong>Start Date:</strong> ${data.startDate}</p>
              <p><strong>Manager:</strong> ${data.managerName}</p>
            </div>
            <p>Hi ${data.employeeName},</p>
            <p>Welcome to our company! We're excited to have you join our team.</p>
            <p>Your onboarding process will begin on your start date. Please log into the HR Portal to complete your profile and review important documents.</p>
            <a href="${process.env.NEXTAUTH_URL}/onboarding" 
               style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0;">
              Start Onboarding
            </a>
            <p>Best regards,<br>HR Team</p>
          </div>
        `
      }),

      // Generic notification
      notification: (data: { recipientName: string; title: string; message: string; actionUrl?: string; actionText?: string }) => ({
        subject: data.title,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">${data.title}</h2>
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p>${data.message}</p>
            </div>
            <p>Hi ${data.recipientName},</p>
            ${data.actionUrl && data.actionText ? `
              <a href="${data.actionUrl}" 
                 style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0;">
                ${data.actionText}
              </a>
            ` : ''}
            <p>Best regards,<br>HR Portal Team</p>
          </div>
        `
      })
    };
  }

  // Send email method
  async sendEmail({ to, template, data, attachments }: SendEmailParams): Promise<{ success: boolean; error?: string }> {
    try {
      // Client-side: redirect to API
      if (!this.isServer) {
        return { success: false, error: 'Use API route /api/send-email for client-side email sending' };
      }

      // Initialize if not done
      if (!this.transporter && this.isServer) {
        await this.initialize();
      }

      // Development mode - log email instead of sending
      if (this.isDevelopment) {
        console.log('📧 [DEV] Email would be sent:');
        console.log('To:', to);
        console.log('Template:', template);
        console.log('Data:', data);
        return { success: true };
      }

      // Production mode - send actual email
      if (!this.transporter) {
        throw new Error('Email service not initialized');
      }

      const templates = this.getEmailTemplates();
      const templateFunc = templates[template];
      
      if (!templateFunc) {
        throw new Error(`Email template '${template}' not found`);
      }

      const emailTemplate = templateFunc(data);
      
      const mailOptions = {
        from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
        to: Array.isArray(to) ? to.join(', ') : to,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
        text: emailTemplate.text,
        attachments
      };

      await this.transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully to:', to);
      
      return { success: true };
    } catch (error) {
      console.error('❌ Email sending failed:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Bulk email sending
  async sendBulkEmails(emails: SendEmailParams[]): Promise<{ sent: number; failed: number; errors: string[] }> {
    const results = await Promise.allSettled(
      emails.map(email => this.sendEmail(email))
    );

    const sent = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    const failed = results.length - sent;
    const errors = results
      .filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.success))
      .map(r => r.status === 'rejected' ? r.reason.message : (r as any).value.error);

    console.log(`📧 Bulk email results: ${sent} sent, ${failed} failed`);
    
    return { sent, failed, errors };
  }

  // Quick send methods for common scenarios
  async sendLeaveRequestNotification(employeeData: any, managerEmail: string) {
    return this.sendEmail({
      to: managerEmail,
      template: 'leaveRequest',
      data: employeeData
    });
  }

  async sendLeaveApprovalNotification(approvalData: any, employeeEmail: string) {
    return this.sendEmail({
      to: employeeEmail,
      template: 'leaveApproval',
      data: approvalData
    });
  }

  async sendWelcomeEmail(employeeData: any, employeeEmail: string) {
    return this.sendEmail({
      to: employeeEmail,
      template: 'welcome',
      data: employeeData
    });
  }

  async sendTrainingEnrollmentNotification(trainingData: any, employeeEmail: string) {
    return this.sendEmail({
      to: employeeEmail,
      template: 'trainingEnrollment',
      data: trainingData
    });
  }

  async sendGenericNotification(notificationData: any, recipientEmail: string) {
    return this.sendEmail({
      to: recipientEmail,
      template: 'notification',
      data: notificationData
    });
  }

  // Method to check if email service is available
  isAvailable(): boolean {
    return this.isServer && (this.isDevelopment || this.validateEnvironment());
  }
}

// Export singleton instance
export const emailService = new EmailService();
export default emailService; 