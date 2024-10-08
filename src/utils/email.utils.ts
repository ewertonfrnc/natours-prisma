import { createTransport, SendMailOptions, TransportOptions } from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

const sendEmail = async (options) => {
  // Create a transporter
  const transporter = createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  } as TransportOptions);

  // Define email options
  const mailOptions: SendMailOptions = {
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html: options.html,
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
