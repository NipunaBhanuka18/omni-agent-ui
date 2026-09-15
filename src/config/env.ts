export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:3001',
  WS_URL: import.meta.env.VITE_WS_URL || 'ws://localhost:3001',
  COGNITO_USER_POOL_ID: import.meta.env.VITE_COGNITO_USER_POOL_ID || 'dev-pool-id',
  COGNITO_CLIENT_ID: import.meta.env.VITE_COGNITO_CLIENT_ID || 'dev-client-id',
};
