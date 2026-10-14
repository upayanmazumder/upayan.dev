import { env } from '@/env';

import { createStatsApi } from './stats-api';

/** The Rust stats API at `API_URL`. Server only: `env.API_URL` is not exposed to the browser. */
export const statsApi = createStatsApi(env.API_URL);
