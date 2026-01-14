import { getStore } from '@netlify/blobs';

export default async (req, context) => {
  const user = context.clientContext?.user;
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
      status: 401,
      headers: { 'Content-Type': 'application/json' }
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
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const config = {
  path: "/api/save-koi"
};
