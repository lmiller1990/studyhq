import {
  CloudWatchLogsClient,
  PutLogEventsCommand,
} from "@aws-sdk/client-cloudwatch-logs";

const client = new CloudWatchLogsClient({
  region: process.env.AWS_DEFAULT_REGION, // "ap-southeast-2", // Replace with your AWS region
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const logGroupName = "studyhq";
const logStreamName = "prod";

export async function logMessage(message: string) {
  const params = {
    logEvents: [
      {
        message,
        timestamp: Date.now(),
      },
    ],
    logGroupName,
    logStreamName,
  };

  await client.send(new PutLogEventsCommand(params));
}
