import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();
export default async function handler(req, res) {
    const baseUrl = process.env.VITE_QALAM_BASE_URL; // Ensure this is set in Vercel envs
    const apiUrl = `${baseUrl}${req.url.replace('/api/proxy', '')}`;

    try {
        const response = await axios({
          url: apiUrl,
          method: req.method,
          headers: {
            ...req.headers,
            host: undefined, // Remove the host header
          },
          params: req.query,
          data: req.body,
        });

    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      message: error.message,
      details: error.response?.data,
    });
  }
}
