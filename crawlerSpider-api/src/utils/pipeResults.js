const { sqs } = require("../sqs/awsSqs");
const handlePipeResultsToClient = async (client) => {
  const resultQueueUrl = client.userResultQueueUrl;
  let message;
  while (true) {
    const resultMessage = await sqs
      .receiveMessage({
        QueueUrl: resultQueueUrl,
        WaitTimeSeconds: 2,
        MessageAttributeNames: ["All"],
      })
      .promise();
    message = resultMessage.Messages ? resultMessage.Messages[0] : undefined;

    if (
      message &&
      message.MessageAttributes["is-crawler-done"].StringValue === "true"
    ) {
      sqs
        .deleteMessage({
          QueueUrl: resultQueueUrl,
          ReceiptHandle: message.ReceiptHandle,
        })
        .promise();
      console.log("done");
      client.emit("crawlerResultDone", true);
      break;
    }
    if (message) {
      client.emit("pageFound", { page: JSON.parse(message.Body) });
      sqs
        .deleteMessage({
          QueueUrl: resultQueueUrl,
          ReceiptHandle: message.ReceiptHandle,
        })
        .promise();
    }
  }
};
module.exports = handlePipeResultsToClient;
