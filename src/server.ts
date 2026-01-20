import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';

/**
 * Custom modules
 */

import config from '@/config';
import limiter from '@/lib/express_rate_limits';

/**
 * Router
 */

import v1Routes from '@/routes/v1';

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

// Enable response compression to reduce payload size and improve performance
app.use(
  compression({
    threshold: 1024, // only compress responses larger than 1kb
  })
);

// Use Helmet to enhance securioty by setting various HTTP headers enhance security
app.use(helmet());

// Apply rate limitting middleware to prevent excessive requests and enhance security
app.use(limiter);

/**
 * Immediately Invoked Asynced Function Expression (IIFE) to start the server
 *
 * - Tries to conenct to the database before initializing the server.
 * - Defines the API routes (`/api/v1`)
 *  - Starts the srever on the specified PORt and logs the running URL.
 *  - If an error occurs during startup, it is logged, and the process exits with status 1
 *
 */

(async () => {
  try {
    app.use('/api/v1', v1Routes);
    app.listen(config.PORT, () => {
      console.log('server is running on port: ', config.PORT);
    });
  } catch (error) {
    console.log(`failed to start the server`, error);

    if (config.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
})();

/**
 * andler server shutdown gracefully by disconencting from the database
 *
 *  - Attempts to disconnect from the database before shutting down the srever.
 * - Logs an errro occurs during disconnectin, it is logged to the console.
 * - Exits the process with status code `0` (indicationg a successfully shutdown)
 */

const handleServerShutdown = async () => {
  try {
    console.log('Gracefully Server SHUTDOWN');
    process.exit(0);
  } catch (err) {
    console.log('Error during server shutdown', err);
  }
};

/**
 * Lissten for termination signals (`SIGTERM` and `SIGNT`)
 *
 * - `SIGTERM` is typically send when stopping a process (e.g., kill command or container shutdown)
 *
 */

process.on('SIGTERM', handleServerShutdown);
process.on('SIGINT', handleServerShutdown);
