const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rahulj2501@gmail.com',
    pass: 'ckip xetf jrzq qobq'
  }
});

// const mailOptions = {
//   from: 'rahulj2501@gmail.com',
//   to: 'bsudhakar1974@gmail.com',
//   subject: 'Sending Email using Node.js',
//   text: 'That was easy!'
// };

// const welcomeMail = transporter.sendMail(mailOptions, function(error, info){
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('Email sent: ' + info.response);
//   }
// });


module.exports = transporter
