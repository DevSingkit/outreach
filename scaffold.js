const fs = require('fs');
const path = require('path');

const apiRoutes = [
  'api/register',
  'api/auth/logout',
  'api/auth/register',
  'api/auth/forgot-password',
  'api/auth/reset-password',
  'api/auth/guest-convert',
  'api/registrations/[id]/qr',
  'api/owners/me/registrations',
  'api/checkin/scan',
  'api/checkin/manual',
  'api/checkin/status',
  'api/checkin/event/[event_id]',
  'api/examination',
  'api/examination/[reg_pet_id]',
  'api/procedure',
  'api/procedure/[reg_pet_id]',
  'api/billing',
  'api/billing/[billing_id]/payment',
  'api/billing/[registration_id]',
  'api/discharge/[registration_id]',
  'api/chatbot/session/[token]',
  'api/chatbot/message',
  'api/chatbot/history/[session_id]',
  'api/admin/events',
  'api/admin/events/[id]',
  'api/admin/events/[id]/status',
  'api/admin/staff',
  'api/admin/staff/[id]',
  'api/admin/reports/billing',
  'api/admin/reports/participants',
  'api/admin/chatbot-logs',
];

const boilerplate = `import { NextResponse } from 'next/server';\n\nexport async function GET() {\n  return NextResponse.json({ message: 'Not implemented' }, { status: 501 });\n}`;

function scaffold() {
  try {
    const baseDir = path.join(process.cwd(), 'app');
    console.log(`📂 Target directory: ${baseDir}`);

    if (!fs.existsSync(baseDir)) {
      console.log('Creating missing /app directory...');
      fs.mkdirSync(baseDir);
    }

    apiRoutes.forEach((route) => {
      const fullPath = path.join(baseDir, route);
      
      // Create directory
      fs.mkdirSync(fullPath, { recursive: true });

      // Create route.ts file
      const filePath = path.join(fullPath, 'route.ts');
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, boilerplate);
        console.log(`✅ Created: ${route}/route.ts`);
      } else {
        console.log(`🟡 Skipped (Exists): ${route}/route.ts`);
      }
    });

    console.log('\n🚀 API Scaffolding Complete!');
  } catch (err) {
    console.error('❌ CRITICAL ERROR:', err.message);
  }
}

scaffold();