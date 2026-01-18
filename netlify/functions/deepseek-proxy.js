const https = require('https');

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "仅支持 POST 请求" };
  
  const { era } = JSON.parse(event.body);
  const API_KEY = process.env.DEEPSEEK_API_KEY;

  const postData = JSON.stringify({
    model: "deepseek-chat",
    messages: [
      { role: "system", content: "你是一位资深的英国历史教授。" },
      { role: "user", content: `请解析：${era}` }
    ]
  });

  return new Promise((resolve) => {
    const options = {
      hostname: 'api.deepseek.com',
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 10000 
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve({ statusCode: 200, body: data }));
    });

    req.on('error', (e) => resolve({ statusCode: 500, body: JSON.stringify({ error: e.message }) }));
    req.write(postData);
    req.end();
  });
};