import { kv } from '@vercel/kv';

export async function GET() {
  try {
    // Check if KV is connected
    await kv.ping();
    
    // Get some stats
    const devices = await kv.keys('devices:*');
    const syncs = await kv.keys('syncs:*');
    
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
