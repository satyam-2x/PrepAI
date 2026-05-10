const verifyEmailTemplate = (otp) => {
  return {
    subject: "PrepAI Account Verification OTP",
    html: `
      <div>
        <p><b>Welcome to PrepAI 🚀</b></p>

        <p>Use the OTP below to verify your account:</p>
        <h2>${otp}</h2>

        <p>This OTP is valid for 5 minutes.</p>
        <p>Please do not share this OTP with anyone.</p>

        <br/>
        <p>Best regards,</p>
        <p><b>PrepAI Team</b></p>
      </div>
    `
  };
};

module.exports = verifyEmailTemplate;