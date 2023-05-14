import axios from "axios";
import alert from "./alert";

const sendEmail = async (
  orgName,
  toEmail,
  subject,
  orgId,
  userName,
  password,
  templateId,
  sendGridApi,
  sendGridUrl,
  sendGriFrom
) => {
  if (sendGridApi && sendGriFrom && sendGridUrl) {
    const apiKey = sendGridApi;
    const url = sendGridUrl;

    const data = {
      personalizations: [
        {
          to: [{ email: toEmail }],
          subject: subject,
          dynamic_template_data: {
            Recipient: orgName,
            organization_id: orgId,
            user_name: userName,
            password: password,
          },
        },
      ],
      template_id: templateId,
      from: { name: "Opet Team", email: sendGriFrom },
    };

    try {
      const response = await axios.post(url, data, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      });
      console.log("Email sent:", response.data);
    } catch (error) {
      alert(
        "May be API error",
        "Please contact developer of this application for the api key to send emails" +
          `\nYour organization ID is : ${orgId}`
      );
    }
  }
};

export default sendEmail;
