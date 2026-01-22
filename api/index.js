export default async function handler(req) {
  const url = new URL(req.url, `https://${req.headers.get('host')}`);
  
  // 核心修正 1：去掉 Vercel 带来的 /api 前缀
  const cleanPath = url.pathname.replace(/^\/api/, '');
  
  // 核心修正 2：构造正确的 Google 地址
  const targetUrl = `https://generativelanguage.googleapis.com${cleanPath}${url.search}`;

  const response = await fetch(targetUrl, {
    method: req.method,
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': url.searchParams.get('key') // 确保 Key 被传递
    },
    // 只有非 GET 请求才传递 body
    body: req.method !== 'GET' ? await req.text() : null,
  });

  const data = await response.text();
  
  return new Response(data, {
    status: response.status,
    headers: { 'Content-Type': 'application/json' }
  });
}
