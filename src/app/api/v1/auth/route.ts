import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/backend/database/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, role } = body;

    let user = await db.user.findUnique({ where: { email: email || 'admin@makeit.com' } });
    if (!user) {
      user = await db.user.create({
        data: {
          email: email || 'admin@makeit.com',
          name: email?.split('@')[0] || 'Platform Administrator',
          role: role || 'SUPER_ADMIN'
        }
      });
    }

    const tokenPayload = Buffer.from(JSON.stringify({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    })).toString('base64');

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar
        },
        token: tokenPayload
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Authentication error', code: 'AUTH_FAILED' },
      { status: 500 }
    );
  }
}
