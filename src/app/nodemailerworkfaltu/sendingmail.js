const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  secure:true,
  host:'smtp.gmail.com',
  port:465,
  auth: {
    user: 'hr1411687@gmail.com',
    pass: 'atuy eoyx uxdc ocze', // Use App Password, not your regular password
  },
})

const mailOptions = {
  from: 'hr1411687@gmail.com',
  to: 'jr1411687@gmail.com',
  subject: 'Your Invite',
  text: 'Click to register!',
}

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log(error)
  }
  console.log('Email sent: ' + info.response)
})
