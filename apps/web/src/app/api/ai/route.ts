export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const serverUrl =
    process.env.SERVER_URL ||
    process.env.NEXT_PUBLIC_SERVER_URL ||
    "http://localhost:3000";

  try {
    const body = await req.text();
    const contentType = req.headers.get("content-type") || "application/json";

    const backendResponse = await fetch(`${serverUrl}/api/ai`, {
      method: "POST",
      headers: {
        "content-type": contentType,
      },
      body,
    });

    return new Response(backendResponse.body, {
      status: backendResponse.status,
      headers: {
        "content-type":
          backendResponse.headers.get("content-type") ||
          "text/event-stream; charset=utf-8",
        "cache-control": "no-cache, no-transform",
        connection: "keep-alive",
        "x-accel-buffering": "no",
      },
    });
  } catch (error) {
    console.error("Next.js proxy error to /api/ai:", error);
    return new Response(
      JSON.stringify({ error: "Failed to connect to backend AI service" }),
      {
        status: 502,
        headers: { "content-type": "application/json" },
      },
    );
  }
}

