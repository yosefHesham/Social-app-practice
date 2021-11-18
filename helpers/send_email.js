const mailer = require("nodemailer");

module.exports = async function (toMail, uniqueString) {
  const transporter = mailer.createTransport({
    service: "Gmail",
    auth: {
      user: "yosef.seven1998@gmail.com",
      pass: "uvgtaabjeyonyrvm",
    },
  });

  transporter.sendMail(
    {
      from: "yosef.seven1998@gmail.com",
      to: toMail,
      subject: "Mail Verification",
      html: `Press <a href=http://localhost:3000/api/user/verify/${uniqueString}> here </a> to verify, thanks !`,
    },
    function (err, resp) {
      if (err) {
        console.log(err);
      } else {
        console.log("Message Sent");
      }
    }
  );
};
