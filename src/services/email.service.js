const MAIL_SETTINGS = {
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // secure:true for port 465, secure:false for port 587
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWWORD,
  },
};

const nodemailer = require('nodemailer');
const transporter =
  nodemailer.createTransport(MAIL_SETTINGS);

module.exports.sendMail = async (params) => {
  const { name, from, subject, message } = params;
  try {
    let info = await transporter.sendMail({
      from: process.env.MAIL_FROM,
      replyTo: from,
      to: process.env.SUPPORT_EMAIL,
      subject: subject,
      html: `<!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Template</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f9;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          }
          h1 {
            color: #333;
          }
          p {
            color: #555;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <p>${message}</p>
        </div>
      </body>
      </html>
    `,
    });
    return info;
  } catch (error) {
    console.log(error);
    return false;
  }
};
