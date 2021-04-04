const awsSdk = require("aws-sdk");

// awsSdk.config.update({ region: process.env.AWS_REGION });

const sqs = new awsSdk.SQS({ region: process.env.AWS_REGION });
module.exports = { sqs };
