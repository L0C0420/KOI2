import { getStore } from '@netlify/blobs';

export default async (req, context) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (req.method === 'OPTIONS') {
    return new Response('', { status: 200, headers });
  }

  // TEMPORARILY DISABLED AUTH FOR TESTING
  console.log('Request received');
  console.log('Context:', JSON.stringify(context));
  console.log('ClientContext:', JSON.stringify(context.clientContext));

  try {
    const data = await req.json();
    console.log('Data received:', data);
    
    const store = getStore('koi-data');
    
    if (data.koiList) {
      await store.set('koi-list', JSON.stringify(data.koiList));
      console.log('Koi list saved');
    }
    
    if (data.contactSettings) {
      await store.set('contact-settings', JSON.stringify(data.contactSettings));
      console.log('Contact settings saved');
    }
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers
    });
  } catch (error) {
    console.error('Save error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers
    });
  }
};

export const config = {
  path: "/api/save-koi"
};
