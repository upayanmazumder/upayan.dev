const isDevelopment = process.env.NEXT_PUBLIC_ENV === 'development';

const API = isDevelopment
    ? 'http://localhost:4000'
    : 'https://api.upayan.dev';

export default API;
