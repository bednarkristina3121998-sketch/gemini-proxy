export default async function handler(req) {
  const url = new URL(req.url, `https://${req.headers.get('host')}`);
  
  // 1. 获取 Cloudflare 传过来的真实路径和 API Key
  const path = url.searchParams.get('path');
  const key = url.searchParams.get('key');

  // 兜底逻辑：如果参数丢了，报错提醒
  if (!path || !key) {
    return new Response(JSON.stringify({ 
      error: "Parameters missing", 
      receivedPath: path, 
      receivedKey: !!key 
    }), { status: 400 });
  }

  // 2. 拼装发往 Google 的最终地址
  const googleUrl = `https://generativelanguage.googleapis.com${path}?key=${key}`;

  try {
    const response = await fetch(googleUrl, {
      method: req.method,
      headers: { "Content-Type": "application/json" },
      // 只有 POST 请求才读取并转发 body
      body: req.method === 'POST' ? await req.text() : null,
    });

    const data = await response.text();
    
    return new Response(data, {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
