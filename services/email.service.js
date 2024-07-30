import { User } from "../models/user.model.js";
import sendMail from "../utils/mail/sendMail.js";

export const sendEmailToAdminsAndOwners = async (subject, data) => {
  const adminsAndOwnersEmails = await User.find({
    $or: [{ role: "admin" }, { role: "owner" }],
  }).select("email");

  const emailArray = adminsAndOwnersEmails.map((user) => user.email);

  try {
    await sendMail({
      emails: emailArray,
      subject,
      template: "admin-notification.mail.ejs",
      data,
    });
  } catch (error) {
    console.error(
      "Email Service Error (sendEmailToAdminsAndOwners):",
      error.message,
    );
  }
};

export const sendEmailToUser = async (subject, data) => {
  const userEmail = data.user.email;

  try {
    await sendMail({
      emails: [userEmail],
      subject,
      template: "user-notification.mail.ejs",
      data,
    });
  } catch (error) {
    console.error("Email Service Error (sendEmailToUser):", error.message);
  }
};
