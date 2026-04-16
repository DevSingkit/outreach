// lib/auth.ts
// DO NOT MODIFY — Role resolution is strictly server-side only.
// Never trust request headers for role. Always query the DB.

import { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export type AuthRole = 'Admin' | 'Staff' | 'Vet' | 'Owner';

export interface AuthContext {
  userId: string;
  role: AuthRole;
  staffId?: string;
  ownerId?: string;
}

/**
 * Resolves the authenticated user's role from the database.
 * Returns null if unauthenticated or user not found in system.
 *
 * Role Resolution Order:
 * 1. Get Supabase session from cookie
 * 2. If no session → return null (401)
 * 3. Query staff_accounts where supabase_uid = session.user.id AND is_active = true
 * 4. If staff found → return { userId, role: staff.role, staffId }
 * 5. Query owners where supabase_uid = session.user.id
 * 6. If owner found → return { userId, role: 'Owner', ownerId }
 * 7. Else → return null
 */
export async function getAuthContext(request: NextRequest): Promise<AuthContext | null> {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              request.cookies.set(name, value);
        });
      },
    },
  }
);

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;

  const uid = session.user.id;

  // 1. Check staff_accounts
  const { data: staff } = await supabase
    .from('staff_accounts')
    .select('staff_id, role, is_active')
    .eq('supabase_uid', uid)
    .eq('is_active', true)
    .single();

  if (staff) {
  const role = staff.role;

  if (!['Admin', 'Staff', 'Vet'].includes(role)) {
    return null;
  }

  return {
    userId: uid,
    role: role as AuthRole,
    staffId: staff.staff_id,
  };
}

  // 2. Check owners
  const { data: owner } = await supabase
    .from('owners')
    .select('owner_id')
    .eq('supabase_uid', uid)
    .single();

  if (owner) {
    return {
      userId: uid,
      role: 'Owner',
      ownerId: owner.owner_id,
    };
  }

  return null;
}