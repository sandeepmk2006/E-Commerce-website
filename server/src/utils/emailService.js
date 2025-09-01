import nodemailer from 'nodemailer';

export const sendPasswordResetEmail = async (to, url) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Password Reset',
    html: `
      <p>You requested a password reset</p>
      <p>Click this <a href="${url}">link</a> to reset your password</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
