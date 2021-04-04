const awsSdk = require("aws-sdk");

awsSdk.config.update({ region: process.env.AWS_REGION });

const sqs = new awsSdk.SQS({
  region: process.env.AWS_REGION,
  apiVersion: `2012-11-05`,
});
module.exports = { sqs };
