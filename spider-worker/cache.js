const redisClient = require("./redis/redis");
const setUrlData = async (url, linksList) => {
  console.log(
    "🚀 ~ file: cache.js ~ line 3 ~ setUrlData ~ linksList",
    linksList
  );

  redisClient.setex(url, 60 * 60 * 24, JSON.stringify(linksList));
};
const getUrlData = async (url) => {
  const data = await redisClient.getAsync(url);

  return JSON.parse(data);
};

module.exports = { getUrlData, setUrlData };
