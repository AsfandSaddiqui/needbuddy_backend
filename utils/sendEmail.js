const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const verifyEmail = async (email, subject, url) => {
  const CLIENT_ID = process.env.GMAIL_CLIENT_ID;
  const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
  const REDIRECT_URI = process.env.GMAIL_REDIRECT_URI;
  const REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;

  const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );

  oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "hasnainmohiuddin99@gmail.com",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: "NeedBuddy <hasnainmohiuddin99@gmail.com>",
      to: `${email}`,
      subject: `${subject}`,
      text: "Verifiy Your Email",
      html: `<a href="${url}" target="_blank"><button>Verify Email</button></a>`,
    };

    //sending Email
    try {
      const result = await transport.sendMail(mailOptions);
      return "Email Send";
    } catch (e) {
      return e.message;
    }
  } catch (error) {
    return error.message;
  }
};

module.exports = verifyEmail;
