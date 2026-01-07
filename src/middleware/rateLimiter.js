import redisClient from "../config/redis.js";

const rateLimiter = async (req, res, next) => {
  const key = `rate:${req.ip}`;

  const count = await redisClient.incr(key);

  if (count === 1) {
    await redisClient.expire(key, 60);
  }

  if (count > 5) {
    return res.status(429).json({
      message: "Too many requests",
    });
  }

  next();
};

export default rateLimiter;
