import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: NextRequest) {
  const data = await req.json();

  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: data.email,
    password: data.password,
    user_metadata: { role: data.role },
    email_confirm: true,
  });
  if (authError) return NextResponse.json({ error: authError.message }, { status: 400 });

  const { error: insertError } = await supabaseAdmin
    .from('staff_accounts')
    .insert({
      supabase_uid: authData.user.id,
      full_name: `${data.first_name} ${data.last_name}`,
      email: data.email,
      role: data.role,
      is_active: true,
    });
  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 400 });

  return NextResponse.json({ success: true });
}