import { getStore } from '@netlify/blobs';

export default async (req, context) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Admin-Password',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('', { status: 200, headers });
  }

  // Simple password authentication
  const adminPassword = req.headers.get('x-admin-password');
  const correctPassword = process.env.ADMIN_PASSWORD || 'your-secret-password-123';

  if (!adminPassword || adminPassword !== correctPassword) {
    return new Response(JSON.stringify({ 
      error: 'Unauthorized - Invalid password' 
    }), { 
      status: 401,
      headers
    });
  }

  // Process the request
  try {
    const data = await req.json();
    const store = getStore('koi-data');
    
    if (data.koiList) {
      await store.set('koi-list', JSON.stringify(data.koiList));
      console.log('Koi list saved successfully');
    }
    
    if (data.contactSettings) {
      await store.set('contact-settings', JSON.stringify(data.contactSettings));
      console.log('Contact settings saved successfully');
    }
    
    return new Response(JSON.stringify({ 
      success: true,
      message: 'Data saved successfully'
    }), {
      status: 200,
      headers
    });
  } catch (error) {
    console.error('Save error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to save data: ' + error.message 
    }), {
      status: 500,
      headers
    });
  }
};

export const config = {
  path: "/api/save-koi"
};
