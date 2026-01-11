const axios = require('axios');

exports.handler = async (event) => {
  const { era } = JSON.parse(event.body);
  const API_KEY = process.env.DEEPSEEK_API_KEY;

  try {
    const response = await axios.post('https://api.deepseek.com/v1/chat/completions', {
      model: "deepseek-chat",
      messages: [{ role: "user", content: `作为历史专家，请为我详细解析英国历史中的 ${era} 时代。` }]
    }, {
      headers: { 'Authorization': `Bearer ${API_KEY}` }
    });
    return { statusCode: 200, body: JSON.stringify(response.data) };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};