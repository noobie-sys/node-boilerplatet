import { rateLimit } from 'express-rate-limit';

// Configure rate limiting middleware to prevent abuse

const limiter = rateLimit({
  windowMs: 60000, // 1-minute time window for request limitting
  limit: 60, // Allow a maxium of 60 request per window per IP
  standardHeaders: 'draft-8', // Use the latest standard rate-limit headers
  legacyHeaders: false,
  message: {
    error:
      'You have send too many requests in a given amount of time. Please try again later.',
  },
});

export default limiter;
