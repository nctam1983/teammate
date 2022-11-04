import * as dotenv from 'dotenv';
dotenv.config();
import nodeMailer from 'nodemailer';

const sendMail = (to, subject, html) => {
    const auth = {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      }

    const transporter = nodeMailer.createTransport({
        service: 'gmail',
        secure: false,
        auth
      });
    
    const mailOptions = {
        from: `"Teammate👻" <${auth.user}>`,
        to: to,
        subject,
        html
    }

    return transporter.sendMail(mailOptions, (error, info) => {
        if (error) return console.error(error);
    });
}

export default sendMail;


