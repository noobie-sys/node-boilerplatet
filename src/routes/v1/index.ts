import { Router } from 'express';

const router = Router();

/**
 * Root Routes
 */

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'API is live',
    status: 'ok',
    version: '1.0.0',
    timeStamp: new Date().toISOString(),
  });
});

export default router;
