import nodemailer from "nodemailer";
import * as ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";

export const sendMail = async (options) => {
  // const transporter = nodemailer.createTransport({
  //   host: process.env.SMTP_HOST,
  //   port: parseInt(process.env.SMTP_PORT || "587"),
  //   secure: true,
  //   service: process.env.SMTP_SERVICE,
  //   auth: {
  //     user: process.env.SMTP_MAIL,
  //     pass: process.env.SMTP_PASSWORD,
  //   },
  // });

  const { emails, subject, data, template } = options;

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const templatePath = path.join(__dirname, "../../mails", template);

  const html = await ejs.renderFile(templatePath, data);

  // for (const recipientEmail of emails) {
  //   const mailOptions = {
  //     from: process.env.SMTP_MAIL,
  //     to: recipientEmail, // Set recipient for each iteration
  //     subject,`
  //     html,
  //   };

  //   try {
  //     await transporter.sendMail(mailOptions);
  //   } catch (error) {
  //     console.error(`Error sending email to ${recipientEmail}:`, error);
  //     res.status(500).json({ message: "Internal Server Error" });
  //   }
  // }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"), // Use `true` for port 465, `false` for all other ports
    auth: {
      user:process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

 for(const email of emails) {
  try {

    const info = await transporter.sendMail({
      from: 'Fifty-One', // sender address
      to: email, // list of receivers
      subject,// Subject line
      html // html body
    });
  
    console.log("Message sent: %s", info.messageId);
    
  } catch (error) {
    console.log(error.message)
  }
 }
};

export default sendMail;
