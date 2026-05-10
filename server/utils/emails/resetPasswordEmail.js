const resetPasswordTemplate = (otp) => {
    return {
        subject: "PrepAI Password Reset OTP",
        html: `
      <div>
        <p><b>PrepAI 🔐</b></p>

        <p>You requested to reset your password.</p>

        <p>Your OTP is:</p>
        <h2>${otp}</h2>

        <p>This OTP is valid for a limited time.</p>
        <p>Please do not share this OTP with anyone.</p>

        <p>If you did not request this, you can ignore this email.</p>

        <br/>
        <p>Best regards,</p>
        <p><b>PrepAI Team</b></p>
      </div>
    `
    };
};

module.exports = resetPasswordTemplate;