const https = require('https');

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { era } = JSON.parse(event.body);
  const API_KEY = process.env.DEEPSEEK_API_KEY;

  const postData = JSON.stringify({
    model: "deepseek-chat",
    messages: [
      { role: "system", content: "你是一位精通英国历史的教授。" },
      { role: "user", content: `请详细解析关于 ${era} 的内容。` }
    ]
  });

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.deepseek.com',
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 9000 // 9秒超时，适配 Netlify 免费版
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: 200,
          headers: { "Content-Type": "application/json" },
          body: data
        });
      });
    });

    req.on('error', (e) => {
      resolve({ statusCode: 500, body: JSON.stringify({ error: e.message }) });
    });

    req.write(postData);
    req.end();
  });
};