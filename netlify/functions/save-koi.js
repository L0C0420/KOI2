import { getStore } from '@netlify/blobs';

export default async (req, context) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('', {
      status: 200,
      headers
    });
  }

  const user = context.clientContext?.user;
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
      status: 401,
      headers
    });
  }

  try {
    const data = await req.json();
    const store = getStore('koi-data');
    
    if (data.koiList) {
      await store.set('koi-list', JSON.stringify(data.koiList));
    }
    
    if (data.contactSettings) {
      await store.set('contact-settings', JSON.stringify(data.contactSettings));
    }
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers
    });
  }
};

export const config = {
  path: "/api/save-koi"
};
