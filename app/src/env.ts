import { createEnv } from '@t3-oss/env-nextjs';
import * as z from 'zod';

export const env = createEnv({
  server: {
    /** Base URL of the Rust stats API. Optional: live sections show "unavailable" without it. */
    API_URL: z.url().optional(),
  },
  client: {
    NEXT_PUBLIC_SITE_URL: z.url(),
  },
  experimental__runtimeEnv: {
    // Default lives here, not in zod, so it also applies when SKIP_ENV_VALIDATION is set (CI).
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://upayan.dev',
  },
  emptyStringAsUndefined: true,
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
