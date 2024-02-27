require('dotenv').config();
import { createClient } from 'redis';

const client = createClient({
  url: process.env.UPSTASH_REDIS_URL,
});
export default client;
