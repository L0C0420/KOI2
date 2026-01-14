import { getStore } from '@netlify/blobs';

export default async (req, context) => {
  try {
    const store = getStore('koi-data');
    
    const koiListStr = await store.get('koi-list');
    const koiList = koiListStr ? JSON.parse(koiListStr) : [];
    
    const contactStr = await store.get('contact-settings');
    const contactSettings = contactStr ? JSON.parse(contactStr) : {};
    
    return new Response(JSON.stringify({
      koiList,
      contactSettings
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      koiList: [], 
      contactSettings: {} 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const config = {
  path: "/api/get-koi"
};
