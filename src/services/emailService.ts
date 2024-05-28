import nodemailer from 'nodemailer';
import config from '../config/config';
;


const transport = nodemailer.createTransport({
    service:'Gmail',
    auth:{
        user:config.user,
        pass:config.pass
    }
})

export async function sendRegistrationEmail(recipientEmail: string, loginLink: string) {
    try {
    
      const emailHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>Login Link</title>
          
        </head>
        <body>
          <h1>Welcome!succesfully registered with us</h1>
          <p>Thank you for registering. Please click on the following link to log in:</p>
          <p><a href="${loginLink}" >Login Link</a></p>
          <p>If you didn't request this, please ignore this email.</p>
      `;
  

      const mailOptions = {
        from: config.user,
        to: recipientEmail, 
        subject: 'Welcome! succesfully registered with us', 
        html: emailHTML, 
      };
  
    
      await transport.sendMail(mailOptions);
      console.log('Registration email sent successfully to:', recipientEmail);
    } catch (error) {
      console.error('Error sending registration email:', error);
      throw error;
    }
  }

  export const sendEmail = async (to: string, subject: string, text: string) => {
    try {
      
      
  
   
      const mailOptions = {
        from: config.user,
        to,
        subject,
        text,
      };
  
      await transport.sendMail(mailOptions);
  
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };
  
  