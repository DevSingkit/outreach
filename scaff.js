const fs = require('fs');
const path = require('path');

const structure = {
  app: {
    '(public)': {
      'page.tsx': '',
      events: {
        'page.tsx': '',
        '[id]': {
          'page.tsx': '',
        },
      },
      register: {
        '[event_id]': {
          'page.tsx': '',
        },
        confirm: {
          'page.tsx': '',
        },
      },
      chatbot: {
        '[token]': {
          'page.tsx': '',
        },
      },
      auth: {
        login: {
          'page.tsx': '',
        },
        'forgot-password': {
          'page.tsx': '',
        },
        'reset-password': {
          'page.tsx': '',
        },
      },
    },

    owner: {
      dashboard: { 'page.tsx': '' },
      registrations: {
        'page.tsx': '',
        '[id]': { 'page.tsx': '' },
      },
      pets: {
        'page.tsx': '',
        '[id]': { 'page.tsx': '' },
      },
      'layout.tsx': '',
    },

    staff: {
      dashboard: { 'page.tsx': '' },
      checkin: { 'page.tsx': '' },
      queue: { 'page.tsx': '' },
      examination: {
        '[reg_pet_id]': { 'page.tsx': '' },
      },
      procedure: {
        '[reg_pet_id]': { 'page.tsx': '' },
      },
      billing: {
        '[registration_id]': { 'page.tsx': '' },
      },
      discharge: {
        '[registration_id]': { 'page.tsx': '' },
      },
      participants: { 'page.tsx': '' },
      'layout.tsx': '',
    },

    admin: {
      dashboard: { 'page.tsx': '' },
      events: {
        'page.tsx': '',
        '[id]': { 'page.tsx': '' },
      },
      staff: { 'page.tsx': '' },
      reports: { 'page.tsx': '' },
      'chatbot-logs': { 'page.tsx': '' },
      'layout.tsx': '',
    },

    api: {},

    'layout.tsx': '',
  },

  lib: {
    'api.ts': '',
    'auth.ts': '',
    'supabase-server.ts': '',
    'supabase-client.ts': '',
  },

  components: {
    'Sidebar.tsx': '',
    'Topbar.tsx': '',
    'PageWrapper.tsx': '',
    'Card.tsx': '',
    'StatusBadge.tsx': '',
    'DataTable.tsx': '',
    'QRDisplay.tsx': '',
    'QRScanner.tsx': '',
    'LoadingSpinner.tsx': '',
    'EmptyState.tsx': '',
    'ToastProvider.tsx': '',
    'DischargeBlocker.tsx': '',
    'ParticipantTimeline.tsx': '',
  },

  'middleware.ts': '',
};

function createStructure(base, obj) {
  for (const name in obj) {
    const fullPath = path.join(base, name);

    if (typeof obj[name] === 'string') {
      fs.writeFileSync(fullPath, obj[name]);
      console.log('Created file:', fullPath);
    } else {
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log('Created folder:', fullPath);
      }
      createStructure(fullPath, obj[name]);
    }
  }
}

createStructure(process.cwd(), structure);

console.log('\nScaffold complete.');