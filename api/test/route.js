export async function GET() {
  return Response.json({
    message: "Test endpoint working",
    timestamp: new Date().toISOString(),
    kvAvailable: true
  });
}
