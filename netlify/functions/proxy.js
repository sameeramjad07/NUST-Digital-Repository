const axios = require('axios');
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();
exports.handler = async function(event, context) {
  const path = event.path.replace('/api/proxy/', '');
  const baseUrl = process.env.VITE_QALAM_BASE_URL;
  const apiUrl = `${baseUrl}/${path}`;

  try {
    const response = await axios({
      url: apiUrl,
      method: event.httpMethod,
      headers: {
        ...event.headers,
        host: undefined,
      },
      params: event.queryStringParameters,
      data: event.body,
    });

    return {
      statusCode: response.status,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify({
        message: error.message,
        details: error.response?.data,
      }),
    };
  }
};
