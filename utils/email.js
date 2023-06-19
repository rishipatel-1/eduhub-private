const nodemailer = require("nodemailer");

const SendMail = async (to, subject, message) => {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "searchit.e.verificator@gmail.com",
      pass: "oqgybnwephcucmli",
    },
  });

  const mailOptions = {
    from: "searchit.e.verificator@gmail.com",
    to: to,
    subject: subject,
    html: message,
  };
  console.log("Mail Options:", mailOptions);
  console.log("Sending Email");
  // await transporter.sendMail(mailOptions, async (error, info) => {
  //   if (error) {
  //     console.log(error);
  //     // res.status(500).send("Error sending email");
  //     return 500;
  //   } else {
  //     console.log("Email sent: " + info.response);
  //     return 200;
  //   }
  // });
  return await transporter
    .sendMail(mailOptions)
    .then((info) => {
      console.log("Email sent: " + info.response);
      return 200;
    })
    .catch((err) => {
      console.log("Error while Sending Email:", err);
      return 500;
    });
};

module.exports = { SendMail };
