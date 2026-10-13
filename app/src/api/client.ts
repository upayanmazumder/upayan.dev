import axios from 'axios';

import { API_TIMEOUT_MS } from '@/constants';

import { toApiError } from './errors';

export function createApiClient(baseURL: string) {
  const client = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
    timeout: API_TIMEOUT_MS,
  });

  client.interceptors.response.use(
    response => response,
    error => Promise.reject(toApiError(error))
  );

  return client;
}

/** Same-origin client for the Next route handlers under /api. */
export const api = createApiClient('/api');
