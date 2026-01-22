export default async function handler(req, res) {
  // 1. 获取原始请求路径，并去掉开头的 /api
  // 比如把 /api/v1beta/models 变成 /v1beta/models
  const path = req.url.replace(/^\/api/, "");

  // 2. 拼接完整的 Google API 地址
  const targetUrl = `https://generativelanguage.googleapis.com${path}`;

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
      },
      // 只有 POST 请求（发消息）才需要传内容
      body: req.method === "POST" ? await req.text() : undefined,
    });

    const data = await response.json();
    
    // 3. 把 Google 的回答原封不动传回给你的小程序
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
