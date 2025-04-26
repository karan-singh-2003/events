import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// Must use POST export in App Router
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { to, subject } = body

  if (!to || !subject ) {
    return NextResponse.json({
      message: 'Please fill all required fields',
      status: 400,
    })
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'hr1411687@gmail.com',
        pass: 'atuy eoyx uxdc ocze', // App password here
      },
    })

    const mailOptions = {
        from: 'hr1411687@gmail.com',
        to,
        subject,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
            <h2>You're Invited!</h2>
            <p>Click below to register:</p>
            <a href="https://your-site.com/register" style="display: inline-block; padding: 10px 15px; background: #0070f3; color: #fff; text-decoration: none; border-radius: 5px;">Register Now</a>
          </div>
        `
      }
      

    const result = await transporter.sendMail(mailOptions)
console.log('Result:', result)

    return NextResponse.json({
      message: 'Email sent successfully!',
      status: 200,
    })
  } catch (error) {
    console.error('Email sending error:', error)
    return NextResponse.json({
      message: 'Error sending email',
      status: 500,
    })
  }
}
