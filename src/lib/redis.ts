import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

redis
  .ping()
  .then((res) => console.log(' Redis connected successfully:', res))
  .catch((err) => console.error('Redis connection error:', err))

export default redis
