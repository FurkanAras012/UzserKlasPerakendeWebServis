// API Configuration - Updated: 2025-07-01
export const API_CONFIG = {
  // Development
  // BASE_URL: 'http://localhost:5186/api/v1',
  
  // Production
  BASE_URL: 'http://192.168.1.224:8080/api/v1',
  
  // Timeout settings
  TIMEOUT: 30000,
  
  // Retry settings
  MAX_RETRIES: 3
};

// Helper function to get API URL
export function getApiUrl(endpoint = '') {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}

// Environment detection - Live Server için özelleştirilmiş
export const IS_PRODUCTION = true; // Manual production test için

// Auto-configure based on environment
if (IS_PRODUCTION) {
  API_CONFIG.BASE_URL = 'http://192.168.1.224:8080/api/v1';
} else {
  API_CONFIG.BASE_URL = 'http://localhost:5186/api/v1';
}
