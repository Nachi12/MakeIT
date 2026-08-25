import { NextRequest, NextResponse } from 'next/server';
import { UserRole } from '@/types';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export function getAuthUser(req: NextRequest): AuthUser | null {
  // Check authorization header or session cookie
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      // Decode simulated or JWT payload
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
      if (decoded && decoded.id && decoded.role) {
        return decoded as AuthUser;
      }
    } catch (e) {
      // Fallback check
    }
  }

  // Admin header fallback for testing / admin client
  const adminHeaderRole = req.headers.get('x-user-role') as UserRole;
  if (adminHeaderRole) {
    return {
      id: req.headers.get('x-user-id') || 'usr-admin-1',
      email: req.headers.get('x-user-email') || 'admin@makeit.com',
      name: req.headers.get('x-user-name') || 'Platform Operations Admin',
      role: adminHeaderRole
    };
  }

  // Default demo fallback role if requested from UI
  return {
    id: 'usr-admin-1',
    email: 'admin@makeit.com',
    name: 'Platform Admin',
    role: 'SUPER_ADMIN'
  };
}

export function requireAuth(req: NextRequest, roles?: UserRole[]) {
  const user = getAuthUser(req);
  if (!user) {
    return NextResponse.json(
      { success: false, message: 'Authentication required.', code: 'UNAUTHORIZED' },
      { status: 401 }
    );
  }

  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    return NextResponse.json(
      { success: false, message: 'Access forbidden: Insufficient privileges.', code: 'FORBIDDEN' },
      { status: 403 }
    );
  }

  return null;
}
