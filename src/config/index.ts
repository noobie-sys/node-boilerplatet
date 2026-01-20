import dotenv from 'dotenv';

dotenv.config();

const config = {
  PORT: process.env.PORT || 8080,
  NODE_ENV: process.env.NODE_ENV,
  WHITELIST_ORIGINS: ['https://docs.blog-api.codewithsadee.com'],
};

export default config;
