import { Redis } from '@upstash/redis'
import {Ratelimit} from "@upstash/ratelimit";
import { config } from 'dotenv';
config();

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100,"60 s"), //100 request in 60sec
})

export default ratelimit;