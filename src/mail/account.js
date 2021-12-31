const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function sendWelcomeMail(to, name) {
  sgMail
    .send({
      to,
      from: "abdelraahmanmostafa@gmail.com",
      subject: "Welcome to the app",
      text: `welcome ${name},thank you for joining`,
    })
    .then(() => {
      console.log("email sent");
    })
    .catch((e) => {
      console.log(e);
    });
}
module.exports = { sendWelcomeMail };
