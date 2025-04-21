const isDevelopment = process.env.NODE_ENV === 'development';

export const api = isDevelopment
    ? 'http://localhost:4000'
    : 'https://api.upayan.dev';