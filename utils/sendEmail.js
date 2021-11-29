const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const verifyEmail = async (email, url) => {
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
      subject: "Email Verification",
      text: "Verifiy Your Email",
      html: `<div style="box-sizing:border-box;display:block;max-width:600px;margin:0 auto;padding:10px"><span style="color:transparent;display:none;height:0;max-height:0;max-width:0;opacity:0;overflow:hidden;width:0">Email Verification.</span>
			<div style="box-sizing:border-box;width:100%;margin-bottom:30px;margin-top:15px">
			<table style="box-sizing:border-box;width:100%;border-spacing:0;border-collapse:separate!important" width="100%">
				
			</table>
			</div>

			<div style="box-sizing:border-box;width:100%;margin-bottom:30px;background:#ffffff;border:1px solid #f0f0f0">
			<table style="box-sizing:border-box;width:100%;border-spacing:0;border-collapse:separate!important" width="100%">
				<tbody>
					<tr>
						<td style="box-sizing:border-box;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top;padding:30px" valign="top">
						<table style="box-sizing:border-box;width:100%;border-spacing:0;border-collapse:separate!important" width="100%">
							<tbody>
								<tr>
									<td style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top" valign="top">
									<h2 style="margin:0;margin-bottom:30px;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;line-height:1.5;font-size:24px;color:#294661!important">Hello ,</h2>

									<p style="margin:0;margin-bottom:30px;color:#294661;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300"><strong>To verify your account click on the button below</strong></p>
									</td>
								</tr>
								<tr>
									<td style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top" valign="top">
									<table cellpadding="0" cellspacing="0" style="box-sizing:border-box;border-spacing:0;width:100%;border-collapse:separate!important" width="100%">
										<tbody>
											<tr>
												<td align="center" style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top;padding-bottom:15px" valign="top">
												<table cellpadding="0" cellspacing="0" style="box-sizing:border-box;border-spacing:0;width:auto;border-collapse:separate!important">
													<tbody>
														<tr>
															<td align="center" bgcolor="#348eda" style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top;background-color:#348eda;border-radius:2px;text-align:center" valign="top"><a href="${url}" style="box-sizing:border-box;border-color:#348eda;font-weight:400;text-decoration:none;display:inline-block;margin:0;color:#ffffff;background-color:#348eda;border:solid 1px #348eda;border-radius:2px;font-size:14px;padding:12px 45px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://u298828.ct.sendgrid.net/ss/c/KeecV0-eUYdPWIcLaNcQIk8KHRb5oSkirDE8JL2zHb4lMRuOQtxvhnuUt7jphk3-HX7lbsw4W1fgWbYis71Y6Nw5dn92FxQC4q8Pzel_VqqtW4En-iQfhXXl6g3tRumSCKciOzJy-oE3ArtjuWEsDEnN7YVSzQy6w6hO3dn8Iuo1AmDC37m3GXFRgtLpgcGjMaGzKJ0YHtpszUNPr0aQFg/3he/WDia0v3QTvCFRSu-jBEyAw/h1/ga_N4173aK-eIOy6AQAjanQR4j-ZKUv26wwDEs6oQ3g&amp;source=gmail&amp;ust=1638299818598000&amp;usg=AOvVaw0ZMp3m5zeIxqrF4Rp_mvaP">Verify Email</a></td>
														</tr>
													</tbody>
												</table>
												</td>
											</tr>
										</tbody>
									</table>
									</td>
								</tr>
								<tr>
									<td style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top" valign="top">
									<p style="text-align:center; margin:0;margin-bottom:30px;color:#294661;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">&nbsp;<br>this link is only valid for 1 hour if link expire contact support.  </p>

									<p style="margin:0;margin-bottom:30px;color:#294661;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Thank you,<br>
									The NeedBuddy Team</p>
									</td>
								</tr>
							</tbody>
						</table>
						</td>
					</tr>
				</tbody>
			</table>
			</div>

			<div style="box-sizing:border-box;clear:both;width:100%">
			<table style="box-sizing:border-box;width:100%;border-spacing:0;font-size:12px;border-collapse:separate!important" width="100%">
				<tbody>
					<tr style="font-size:12px">
						
					</tr>
				</tbody>
			</table>
			</div>
			</div>`,
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
