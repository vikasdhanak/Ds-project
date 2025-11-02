// Configuration for API endpoints
// Change this when you deploy to production

const config = {
  // For local development
  development: {
    API_URL: 'http://localhost:3000',
  },
  
  // For production (after deployment)
  production: {
    API_URL: 'https://your-backend-url.onrender.com', // Change this to your deployed backend URL
  }
};

// Automatically detect environment
const ENV = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
  ? 'development' 
  : 'production';

// Export the API base URL
const API_BASE = config[ENV].API_URL;

console.log(`🌍 Environment: ${ENV}`);
console.log(`📡 API URL: ${API_BASE}`);
