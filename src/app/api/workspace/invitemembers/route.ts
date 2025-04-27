// app/api/invite/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '../../../../lib/prisma'
import redis from '../../../../lib/redis'
import { v4 as uuidv4 } from 'uuid'
import crypto from 'crypto'
import nodemailer from 'nodemailer'

function generatePassword(length: number = 12) {
  return crypto.randomBytes(length).toString('base64url').slice(0, length)
}

function generateToken(payload: object) {
  return Buffer.from(JSON.stringify(payload)).toString('base64url')
}

export async function POST(req: NextRequest) {
  try {
    // 1. Session Validation
    const cookieStore = cookies()
    const sessionId = (await cookieStore).get('session_id')?.value

    if (!sessionId) {
      return NextResponse.json({ message: 'Unauthorized - No session ID' }, { status: 401 })
    }

    const sessionData = await redis.get(`session:${sessionId}`)
    if (!sessionData) {
      return NextResponse.json({ message: 'Unauthorized - No session data' }, { status: 401 })
    }

    const user = JSON.parse(sessionData)
    if (!user?.id || !user?.email) {
      return NextResponse.json({ message: 'Unauthorized - Invalid user data' }, { status: 401 })
    }

    // 2. Extract Body Data
    const body = await req.json()
    const { receiverEmail, receiverMemberId, role: roleName, message, workspaceId } = body

    if (!receiverEmail || !receiverMemberId || !roleName || !workspaceId) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
    }

    // 3. Sender Must be Admin
    const senderMember = await prisma.members.findFirst({
      where: { userId: user.id },
      include: { Roles: true },
    })

    if (!senderMember || senderMember.Roles?.name !== 'admin') {
      return NextResponse.json({ message: 'Forbidden - Only admins can invite' }, { status: 403 })
    }

    // 4. Find Role by Name
    const roleRecord = await prisma.roles.findFirst({
      where: { name: roleName,workspaceId },
    })

    if (!roleRecord) {
      return NextResponse.json({ message: `Role "${roleName}" not found` }, { status: 404 })
    }

    const roleId = roleRecord.id

    // 5. Check if User Exists
    const existingUser = await prisma.user.findUnique({
      where: { email: receiverEmail },
    })

    let userId: string
    let generatedPassword: string | undefined = undefined

    if (!existingUser) {
      // 6. Create New User
      generatedPassword = generatePassword(12)

      const newUser = await prisma.user.create({
        data: {
          name: receiverMemberId,
          email: receiverEmail,
          universityId: receiverMemberId,
          password: generatedPassword,
        },
      })

      userId = newUser.id
    } else {
      userId = existingUser.id

      // Check if already a member
      const membership = await prisma.members.findFirst({
        where: { userId, workspaceId },
      })

      if (membership) {
        return NextResponse.json({ message: 'User is already a member of this workspace' }, { status: 400 })
      }
    }

    // 7. Create Member (Always create after user is ready)
    await prisma.members.create({
      data: {
        userId,
        workspaceId,
        rolesId: roleId,
      },
    })

    // 8. Setup Email Transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'hr1411687@gmail.com',
        pass: 'atuy eoyx uxdc ocze', // app password
      },
    })

    // 9. Prepare and Send Email
    let emailHtml = ''
    let subject = ''

    if (generatedPassword) {
      // New User
      const registerLink = `https://yourwebsite.com/register?workspaceId=${workspaceId}`
      emailHtml = `
        <div style="font-family:Arial,sans-serif;">
          <h2>Welcome! 👋</h2>
          <p>${message || 'You have been invited to join our workspace.'}</p>
          <p><strong>Your temporary password:</strong> ${generatedPassword}</p>
          <a href="${registerLink}" style="background:#0070f3;color:#fff;padding:10px 20px;text-decoration:none;border-radius:5px;">Register Here</a>
        </div>
      `
      subject = `You're Invited to Join Workspace`
    } else {
      // Existing User
      const payload = { workspaceId, receiverUserId: userId }
      const token = generateToken(payload)
      const inviteLink = `https://yourwebsite.com/invite?token=${token}`

      emailHtml = `
        <div style="font-family:Arial,sans-serif;">
          <h2>Workspace Invite 🚀</h2>
          <p>${message || 'Click below to join immediately.'}</p>
          <a href="${inviteLink}" style="background:#28a745;color:#fff;padding:10px 20px;text-decoration:none;border-radius:5px;">Accept Invite</a>
        </div>
      `
      subject = `You're Invited to Join Workspace`

      // Save token to Redis (optional, for security)
      await redis.set(`invite:${token}`, JSON.stringify(payload), 'EX', 60 * 60 * 24) // expires in 24 hours
    }

    const sendResult = await transporter.sendMail({
      from: `"${user.email}" <hr1411687@gmail.com>`,
      to: receiverEmail,
      subject,
      html: emailHtml,
    })

    console.log('Email sent:', sendResult)

    return NextResponse.json({ message: 'Invite sent successfully!' }, { status: 200 })

  } catch (error) {
    console.error('Error inviting user:', error)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}
