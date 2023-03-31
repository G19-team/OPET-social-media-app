import axios from "axios";

export const sendEmail = async (
  orgName,
  toEmail,
  subject,
  orgId,
  userName,
  password,
  templateId
) => {
  const apiKey =
    "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";
  const url = "https://api.sendgrid.com/v3/mail/send";

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
    from: { name: "Opet Team", email: "g20.8368113101@gmail.com" },
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
    console.log("Error sending email:", error);
  }
};
