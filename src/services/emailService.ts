import nodemailer from 'nodemailer';
import config from '../config/config';

const transport = nodemailer.createTransport({
    service:'Gmail',
    auth:{
        user:config.user,
        pass:config.pass
    }
})

export async function sendRegistrationEmail(recipientEmail: string, loginLink: string,password :string) {
    try {
      // Email HTML content (you can customize this)
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
          <p><a href="${loginLink}" id ="postLink">Login Link</a></p>
          <p>If you didn't request this, please ignore this email.</p>
          <script>
        // Function to make a POST request
        function makePostRequest(url, data) {
            return fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(responseData => {
                console.log('POST request successful');
                console.log(responseData);
            })
            .catch(error => {
                console.error('Error making POST request:', error);
            });
        }

        // Function to handle the click event
        function handleClick(event) {
            event.preventDefault(); // Prevent the default action of following the link

            // URL to make the POST request to
            const url = '${loginLink}';

            // Data to send in the POST request (you can modify this as needed)
            const postData = {
                email: "${recipientEmail}",
                password:"${ password}"
              };

            // Make the POST request by calling the function and passing the data
            makePostRequest(url, postData);
        }

        // Add click event listener to the link
        document.getElementById('postLink').addEventListener('click', handleClick);
    </script>
        </body>
        </html>
      `;
  

      const mailOptions = {
        from: config.user,
        to: recipientEmail, 
        subject: 'Welcome! succesfully registered with us', 
        html: emailHTML, 
      };
  
      // Send the email
      await transport.sendMail(mailOptions);
      console.log('Registration email sent successfully to:', recipientEmail);
    } catch (error) {
      console.error('Error sending registration email:', error);
      throw error;
    }
  }