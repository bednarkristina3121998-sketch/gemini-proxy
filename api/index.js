export default async function handler(req) {
  const { searchParams } = new URL(req.url, `https://${req.headers.get('host')}`);
  
  // 1. 从参数里提取真正的路径和 Key
  const realPath = searchParams.get('path') || '/v1beta/models';
  const apiKey = searchParams.get('key');

  // 2. 拼装成发给 Google 的最终地址
  const googleUrl = `https://generativelanguage.googleapis.com${realPath}?key=${apiKey}`;

  try {
    const response = await fetch(googleUrl, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
      },
      // 如果是发消息（POST），就把内容传给 Google
      body: req.method === "POST" ? await req.text() : null,
    });

    const data = await response.text();
    return new Response(data, {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
