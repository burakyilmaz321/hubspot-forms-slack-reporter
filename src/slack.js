const axios = require("axios");

async function sendSlackMessage(webhookUrl, total, lastDay) {
  const message = {
    text: `📋 *HubSpot Form Submissions Report*:\n` +
          `- Total submissions: ${total}\n` +
          `- Submissions in the last 1 day: ${lastDay}`
  };

  try {
    await axios.post(webhookUrl, message);
    console.log("Slack message sent successfully!");
  } catch (error) {
    console.error("Error sending Slack message:", error.message);
    throw error;
  }
}

module.exports = { sendSlackMessage };
