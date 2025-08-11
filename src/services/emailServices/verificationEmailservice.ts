
import { transporter } from '../../utils/email/transporter.js';
import { config } from '../../config/config.js';
import { verificationEmailTemplate } from '../../utils/email/templates/verificationEmail.js';
import { welcomeEmailTemplate } from '../../utils/email/templates/welcomeEmail.js';
import { pendingApprovalEmailTemplate } from '../../utils/email/templates/welcomeEmail.js';
import { changePasswordTemplate } from '../../utils/email/templates/changePassEmail.js';
import { AgentWellcomeEmailTemplate } from '../../utils/email/templates/welcomeEmail.js';
import { AgentRejectedEmailTemplate } from '../../utils/email/templates/verificationEmail.js';
abstract class Email {
  protected to: string;
  protected name: string;
  protected from = `Real Estate Platform <${config.email.emailuser}>`;

  constructor(to: string, name: string) {
    this.to = to;
    this.name = name;
  }

  protected abstract getSubject(): string;
  protected abstract getHtml(): string;

  async send(): Promise<boolean> {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: this.getSubject(),
      html: this.getHtml(),
    };

    try {
      await transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error(`Error sending "${this.getSubject()}" email to ${this.to}:`, error);
      return false;
    }
  }
}

export class VerificationEmail extends Email {
  private token: string;

  constructor(to: string, name: string, token: string) {
    super(to, name);
    this.token = token;
  }

  protected getSubject(): string {
    return 'Verify Your Account';
  }

  protected getHtml(): string {
    const verificationLink = `http://localhost:8080/api/auth/verify-email?token=${this.token}`;
    return verificationEmailTemplate(this.name, verificationLink);
  }
}

export class WelcomeEmail extends Email {
  protected getSubject(): string {
    return 'Welcome to Real Estate Platform';
  }

  protected getHtml(): string {
    return welcomeEmailTemplate(this.name);
  }
}

export class PendingApprovalEmail extends Email {
  protected getSubject(): string {
    return 'Registration Pending Approval';
  }

  protected getHtml(): string {
    return pendingApprovalEmailTemplate(this.name);
  }
}
export class ChangePasswordEmail extends Email {
  protected getSubject(): string {
    return 'Password Change Notification';
  }

  protected getHtml(): string {
    return changePasswordTemplate(this.name);
  }
}
export class AgentWellcomeEmail extends Email {
  protected getSubject(): string {
    return 'Request approved';
  }

  protected getHtml(): string {
    return AgentWellcomeEmailTemplate(this.name);
  }
}
export class RejectionEmail extends Email {
  protected getSubject(): string {
    return 'Request Rejected';
  }

  protected getHtml(): string {
    return AgentRejectedEmailTemplate(this.name);
  }
}