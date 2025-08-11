// File: backend/src/utils/email/transporte.ts
import nodemailer from 'nodemailer';
import { config } from '../../config/config.js';

export const transporter = nodemailer.createTransport({
  service: config.email.emailservice,
  auth: {
    user: config.email.emailuser,
    pass: config.email.emailpass,
  },
});

transporter.verify((error) => {
  if (error) {
    console.error('Error with mail transporter:', error);
  } else {
    console.log('Mail transporter is ready to send emails');
  }
});