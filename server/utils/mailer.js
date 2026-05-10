const axios = require("axios");

const sendMail = async (to, subject, html) => {
    try {
        
        await axios.post(
            "https://api.brevo.com/v3/smtp/email",
            {
                sender: { email: "noreply.prepai@gmail.com" },
                to: [{ email: to }],
                
                subject: subject,
                htmlContent: html,
            },
            {
                headers: {
                    "api-key": process.env.BREVO_API_KEY,
                    "Content-Type": "application/json",
                },
            }
        );

      
    } catch (error) {
        console.error("Email error:", error.response?.data || error.message);
    }
};

module.exports = sendMail;