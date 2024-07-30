import nodemailer from "nodemailer";
import * as ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";

export const sendMail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const { emails, subject, data, template } = options;

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const templatePath = path.join(__dirname, "../../mails", template);

  const html = await ejs.renderFile(templatePath, data);

  for (const recipientEmail of emails) {
    const mailOptions = {
      from: process.env.SMTP_MAIL,
      to: recipientEmail, // Set recipient for each iteration
      subject,
      html,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error(`Error sending email to ${recipientEmail}:`, error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

export default sendMail;
