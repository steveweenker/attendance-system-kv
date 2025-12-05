import { kv } from '@vercel/kv';

export async function GET() {
  try {
    // count connected devices
    const devices = await kv.keys('device:*');
    const syncs = await kv.keys('sync:*');
    
    return Response.json({
      online: true,
      database: 'Vercel KV (Redis)',
      status: 'connected',
      stats: {
        devices: devices.length,
        syncs: syncs.length,
        uptime: process.uptime() || 'unknown'
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    return Response.json({
      online: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
