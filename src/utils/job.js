const cron = require("node-cron");
const {
  fetchPendingEmails,
  sendBasicEmail,
  updateTicket
} = require("../services/email-service");
const sender = require("../config/emailConfig");
const { EMAIL_ID } = require("../config/serverConfig");

/**
 *
 * 10:00 am
 * Every 5 minutes
 * we will check are there any pending emails which was expected to be sent between 10:00 am and 10:05 am
 * if yes, we will send the email
 */

const setupJobs = () => {
  cron.schedule("*/2 * * * *", async () => {
    console.log("Running email check job at:", new Date().toISOString());
    try {
      const response = await fetchPendingEmails();
      console.log(`Found ${response.length} pending emails to process`);

      for (const email of response) {
        try {
          console.log(`Attempting to send email to ${email.recepientEmail}`);
          await sender.sendMail({
            from: EMAIL_ID,
            to: email.recepientEmail,
            subject: email.subject,
            text: email.content,
          });
          console.log(`Email sent successfully to ${email.recepientEmail}`);
          await updateTicket(email.id, { status: "SUCCESS" });
        } catch (err) {
          console.error(`Failed to send email to ${email.recepientEmail}:`, err);
          await updateTicket(email.id, { status: "FAILED" });
        }
      }
    } catch (error) {
      console.error("Error in cron job:", error);
    }
  });
};

module.exports = {
  setupJobs,
};
