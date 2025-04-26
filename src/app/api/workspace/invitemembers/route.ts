// app/api/invite/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '../../../../lib/prisma'
import redis from '../../../../lib/redis'

import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

function generatePassword(length: number = 8) {
  return crypto.randomBytes(length).toString('base64url').slice(0, length); // base64url safe
}

function generateToken(payload: object) {
  const str = JSON.stringify(payload);
  return Buffer.from(str).toString('base64url'); // base64url safe
}

function decodeToken(token: string) {
  const str = Buffer.from(token, 'base64url').toString('utf-8');
  return JSON.parse(str);
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies()
    const sessionId = (await cookieStore).get('session_id')?.value

    if (!sessionId) {
      return NextResponse.json({ message: 'Unauthorized - No session ID' }, { status: 401 });
    }

    const sessionData = await redis.get(`session:${sessionId}`);
    if (!sessionData) {
      return NextResponse.json({ message: 'Unauthorized - No session data' }, { status: 401 });
    }

    const user = JSON.parse(sessionData);

    if (!user?.id || !user?.email) {
      return NextResponse.json({ message: 'Unauthorized - Invalid user data' }, { status: 401 });
    }

    const body = await req.json();
    const { receiverEmail, receiverMemberId, role, message, workspaceId } = body;

    if (!receiverEmail || !receiverMemberId || !role) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }

    // ✅ 1. Check if sender is an admin
    const senderMember = await prisma.members.findFirst({
      where: {
        userId: user.id,
      },
      include: {
        Roles: true,
      },
    });

    if (!senderMember || senderMember.Roles?.name !== 'admin') {
      return NextResponse.json({ message: 'Forbidden - Only admins can invite' }, { status: 403 });
    }

    // ✅ 2. Check if receiver user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: receiverEmail },
    });

    // ✅ 3. If user exists, check if already a member
    if (existingUser) {
      const existingMembership = await prisma.members.findFirst({
        where: {
          userId: existingUser.id,
          workspaceId,
        },
      });

      if (existingMembership) {
        return NextResponse.json({ message: 'User is already a member of this workspace' }, { status: 400 });
      }
    }

    // ✅ 4. Setup email transporter
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
    if (!existingUser) {
      // ✅ 5. New User Creation
      const generatedPassword = generatePassword(12);

      const newUser = await prisma.user.create({
        data: {
          name: receiverMemberId,
          email: receiverEmail,
          universityId:receiverMemberId,
          password: generatedPassword,
        },
      });

      // Optionally: Directly create a Member record
      await prisma.members.create({
        data: {
          userId: newUser.id,
          workspaceId,
          rolesId: null, // Assign a role later if needed
        },
      });

      const registerLink = `https://yourwebsite.com/register?workspaceId=${workspaceId}`;

 const sendResult =      await transporter.sendMail({
        from: `"${user.email}" <hr1411687@gmail.com>`,
        to: receiverEmail,
        subject: `You're Invited to Join Workspace`,
        html: `
          <div style="font-family:Arial,sans-serif;">
            <h2>Welcome! 👋</h2>
            <p>${message || 'You have been invited to join our workspace.'}</p>
            <p><strong>Your temporary password:</strong> ${generatedPassword}</p>
            <a href="${registerLink}" style="background:#0070f3;color:#fff;padding:10px 20px;text-decoration:none;border-radius:5px;">Register Here</a>
          </div>
        `,
      });
      console.log('Full Nodemailer send result:', sendResult)

    } else {
      // ✅ 6. Existing User - Send Invite Link
      const payload = {
        workspaceId,
        role,
        receiverUserId: existingUser.id,
      };

      const encodedToken = generateToken(payload);

      const inviteLink = `https://yourwebsite.com/invite?token=${encodedToken}`;

     const sendResult =  await transporter.sendMail({
        from: `"${user.email}" <hr1411687@gmail.com>`,
        to: receiverEmail,
        subject: `You're Invited to Join Workspace`,
        html: `
          <div style="font-family:Arial,sans-serif;">
            <h2>Workspace Invite 🚀</h2>
            <p>${message || 'Click below to join immediately.'}</p>
            <a href="${inviteLink}" style="background:#28a745;color:#fff;padding:10px 20px;text-decoration:none;border-radius:5px;">Accept Invite</a>
          </div>
        `,
      });
      console.log('Full Nodemailer send result:', sendResult)
      // Optionally save token to Redis for extra security (optional)
      await redis.set(`invite:${encodedToken}`, JSON.stringify(payload), 'EX', 60 * 60 * 24); // expire in 24 hours
    }

    return NextResponse.json({ message: 'Invite sent successfully!' }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
