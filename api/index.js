export const config = {
  runtime: 'edge', // 使用 Edge 模式，速度最快
};

export default async function handler(req) {
  const url = new URL(req.url);
  // 这里的目标是 Google，Vercel 会用美国 IP 去访问它
  const targetUrl = `https://generativelanguage.googleapis.com${url.pathname}${url.search}`;

  const response = await fetch(targetUrl, {
    method: req.method,
    headers: {
      // 转发必要的 Header
      'Content-Type': 'application/json',
    },
    body: req.method !== 'GET' ? req.body : null,
  });

  return response;
}
