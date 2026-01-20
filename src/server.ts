import express from 'express';
import cors from 'cors';

/**
 * Custom modules
 */

import config from '@/config';

/**
 * Types
 */

import type { CorsOptions } from 'cors';

/**
 * Express app initial
 */

const app = express();

// Configure CORS options

const corsOptions: CorsOptions = {
  origin(requestOrigin, callback) {
    if (
      config.NODE_ENV === 'development' ||
      !requestOrigin ||
      config.WHITELIST_ORIGINS.includes(requestOrigin)
    ) {
      callback(null, true);
    } else {
      // Rejects requests from non-whitelisted origins
      callback(
        new Error(`CORS error: ${requestOrigin} is not allowed by CORS`),
        false
      );
    }
    console.log(`CORS error: ${requestOrigin} is not allowed by CORS`);
  },
};

// Apply CORS Middleware
app.use(cors({ origin: false }));

// Enable JSON parsing
app.use(express.json());

// Enabled URL-encoded request body parsing with extended mode
// `extended : true` allows rich objects and arrays via querystring library

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    message: 'Hello from backend!',
  });
});
app.listen(config.PORT, () => {
  console.log('server is running on port: ', config.PORT);
});
