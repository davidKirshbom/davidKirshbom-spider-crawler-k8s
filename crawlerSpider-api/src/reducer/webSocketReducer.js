const { sqs } = require("../sqs/awsSqs");
const handlePipeResultsToClient = require("../utils/pipeResults");

const getJobsQueue = async () => {
  return (
    await sqs.createQueue({ QueueName: "crawler-spider-jobs-queue" }).promise()
  ).QueueUrl;
};

module.exports = async (action) => {
  switch (action.type) {
    case "client_connected":
      const userResultQueue = await sqs
        .createQueue({
          QueueName: `crawlerResults${action.client.id}.fifo`,
          Attributes: { FifoQueue: "true", ContentBasedDeduplication: "true" },
        })
        .promise();
      action.client.userResultQueueUrl = userResultQueue.QueueUrl;
      break;
    case "request_crawling":
      const requestData = await sqs
        .sendMessage({
          QueueUrl: await getJobsQueue(),
          MessageBody: JSON.stringify(action.requestParams),
        })
        .promise();
      break;
    case "pipe_crawling_results":
      await handlePipeResultsToClient(action.client);
      break;
    case "client_disconnected":
      await sqs
        .deleteQueue({
          QueueUrl: action.userResultQueueUrl,
        })
        .promise();
      break;
    default:
      throw new Error("No such action type!");
  }
};
