const env = process.env.NEXT_PUBLIC_ENV || 'production';

const API = env === 'development'
    ? 'http://localhost:4000'
    : env === 'staging'
        ? 'https://api.staging.upayan.dev'
        : 'https://api.upayan.dev';

console.log('API URL:', API);
export default API;
