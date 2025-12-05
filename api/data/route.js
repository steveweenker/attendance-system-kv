import { kv } from '@vercel/kv';

export async function GET() {
  try {
    // Collections to fetch
    const collections = ['students', 'faculty', 'classes', 'attendance', 'years', 'settings'];
    const data = {};
    
    // Fetch all collections in parallel
    for (const collection of collections) {
      const items = await kv.get(`${collection}:latest`);
      data[collection] = items ? JSON.parse(items) : [];
    }
    
    // Get sync stats
    const devices = await kv.keys('devices:*');
    const syncs = await kv.keys('syncs:*');
    
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
