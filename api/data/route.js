import { kv } from '@vercel/kv';

export async function GET() {
  try {
    // collections to fetch
    const collections = ['students', 'faculty', 'classes', 'attendance', 'years', 'settings'];
    const data = {};
    
    // fetch all collections in parallel
    for (const collection of collections) {
      const raw = await kv.get(`${collection}:latest`);
      data[collection] = raw ? JSON.parse(raw) : [];
    }
    
    // Get sync stats
    const devices = await kv.keys('device:*');
    const syncs = await kv.keys('sync:*');
    
    return Response.json({
      success: true,
      data,
      stats: {
        totalDevices: devices.length,
        totalSyncs: syncs.length,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    return Response.json({
      success: false,
      data: {
        students: [], faculty: [], classes: [],
        attendance: [], years: [], settings: []
      },
      error: error.message
    });
  }
}
