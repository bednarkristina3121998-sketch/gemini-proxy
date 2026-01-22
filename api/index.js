// Node.js 兼容版（最稳方案）
export default async function handler(req, res) {
  try {
    // 1. 获取 Cloudflare 传过来的参数
    // Vercel 的 Node.js 模式会自动帮你解析 query
    const { path, key } = req.query;

    if (!path || !key) {
      return res.status(400).json({ error: "参数丢失：请检查 Cloudflare 转发配置" });
    }

    // 2. 拼装 Google 地址
    const googleUrl = `https://generativelanguage.googleapis.com${path}?key=${key}`;

    // 3. 转发给 Google
    const response = await fetch(googleUrl, {
      method: req.method,
      headers: { "Content-Type": "application/json" },
      // 只有发消息时才传递 body
      body: req.method === 'POST' ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.json();
    
    // 4. 返回结果
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: "Vercel 中转站故障: " + err.message });
  }
}
