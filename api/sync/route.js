import { kv } from '@vercel/kv';

export async function POST(request) {
  try {
    const data = await request.json();
    const { deviceId, collections } = data;
    
    // Generate sync ID
    const syncId = `sync_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    
    // Save each collection
    for (const [collectionName, items] of Object.entries(collections)) {
      await kv.set(`${collectionName}:latest`, JSON.stringify(items));
    }
    
    // Save sync metadata
    await kv.set(`syncs:${syncId}`, {
      deviceId,
      timestamp: new Date().toISOString(),
      collections: Object.keys(collections)
    });
    
    // Update device info
    await kv.set(`devices:${deviceId}`, {
      lastSync: new Date().toISOString(),
      userAgent: request.headers.get('user-agent') || 'unknown'
    });
    
    return Response.json({
      success: true,
      syncId,
      message: `Synced ${Object.keys(collections).length} collections`
    });
    
  } catch (error) {
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
