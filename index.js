import express from "express";
import bodyParser from "body-parser";
import twilio from "twilio";

const app = express();
app.use(bodyParser.json());

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

app.post("/send-emergency-sms", async (req, res) => {
  try {
    const { patient_name, issue, callback_number } = req.body;

    await client.messages.create({
      body: `🚨 DENTAL EMERGENCY 🚨
Patient: ${patient_name || "Unknown"}
Issue: ${issue}
Callback: ${callback_number || "Not provided"}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: process.env.DENTIST_PHONE_NUMBER
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
