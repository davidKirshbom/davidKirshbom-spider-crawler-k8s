const redis = require("redis");
const { promisifyAll } = require("bluebird");

promisifyAll(redis);

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});
console.log(redisClient.keys("*"));
module.exports = redisClient;
