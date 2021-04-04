const crawlerSpider = require("./crawler");
const { sqs } = require("./sqs/awsSqs");
const getQueueUrl = async () => {
  return (
    await sqs.createQueue({ QueueName: "crawler-spider-jobs-queue" }).promise()
  ).QueueUrl;
};
let messageSended = 0;

const handleSendPageFound = async (page, queueUrl) => {
  try {
    await sqs
      .sendMessage({
        QueueUrl: queueUrl,
        MessageAttributes: {
          "is-crawler-done": {
            DataType: "String",
            StringValue: "false",
          },
        },
        MessageGroupId: messageSended + "",
        MessageBody: JSON.stringify(page),
      })
      .promise();
    messageSended++;
  } catch (err) {
    console.log(err);
  }
};

const main = async () => {
  const queueUrl = await getQueueUrl();
  while (true) {
    const data = await sqs
      .receiveMessage({ QueueUrl: queueUrl, WaitTimeSeconds: 10 })
      .promise();
    if (data.Messages) {
      const message = JSON.parse(data.Messages[0].Body);
      console.log("🚀 ~ file: index.js ~ line 31 ~ main ~ message", message);
      try {
        sqs
          .deleteMessage({
            QueueUrl: queueUrl,
            ReceiptHandle: data.Messages[0].ReceiptHandle,
          })
          .promise();
      } catch (err) {
        console.log(
          "🚀 ~ file: crawler.js ~ line 140 ~ sqs.receiveMessage ~ err",
          err
        );
      }
      await crawlerSpider(
        message.startUrl,
        message.maxDepth,
        message.maxTotalPages,
        (page) => handleSendPageFound(page, message.resultQueueUrl)
      );

      sqs
        .sendMessage({
          QueueUrl: message.resultQueueUrl,
          MessageAttributes: {
            "is-crawler-done": {
              DataType: "String",
              StringValue: "true",
            },
          },
          MessageGroupId: messageSended + "",
          MessageBody: "none",
        })
        .promise();
      messageSended++;
    }
  }
};
main().then();
