const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true, 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, 
    },
});

const sendEmail = async (to, subject, htmlContent) => {
    try {
        const mailOptions = {
            from: `"Budget Tracker "<${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject,
            html: htmlContent,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}: ${info.response}`)
        return true;
    } catch (error) {
        console.log(`Error sending email to ${to}:`, error);
        return false;
    }
};

module.exports = { sendEmail};