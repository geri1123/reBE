// File: backend/src/utils/email/templates/verificationEmail.ts
export const verificationEmailTemplate = (name: string, verificationLink: string) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2>Welcome to Real Estate Platform, ${name}!</h2>
    <p>Please verify your email by clicking the link below:</p>
    <a href="${verificationLink}" 
       style="display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">
      Verify Email
    </a>
    <p>If you didn't request this, please ignore this email.</p>
    <p>The link will expire in 10 minutes.</p>
  </div>
`;
export const AgentRejectedEmailTemplate = (name: string) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2>Hello, ${name}!</h2>
    <p>Your Request has been rejected by Agency owner  and you can not  login.</p>
    <p>Thank you for your time!</p>
  </div>
`;   