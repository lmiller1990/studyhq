import {
  DynamoDB,
  PutItemCommand,
  QueryCommand,
  UpdateItemCommand,
  UpdateTimeToLiveCommand,
} from "@aws-sdk/client-dynamodb";
import crypto from "node:crypto";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import type { DynamoSchema } from "~/logic/dbTypes";

const dynamo = new DynamoDB();

export async function queryForUser(email: string) {
  const result = await dynamo.send(
    new QueryCommand({
      TableName: "studyhq",
      KeyConditionExpression: "pk = :pk AND sk = :sk",
      ExpressionAttributeValues: {
        ":pk": { S: email },
        ":sk": { S: "PROFILE" },
      },
    }),
  );

  const dbuser = result.Items?.[0];

  return dbuser;
}

export async function queryForThreadsByUser(email: string) {
  const results = await dynamo.send(
    new QueryCommand({
      TableName: "studyhq",
      KeyConditionExpression: "pk = :pk AND begins_with(sk, :skPrefix)",
      ExpressionAttributeValues: {
        ":pk": { S: email },
        ":skPrefix": { S: "thread#" },
      },
    }),
  );

  const threads = (results?.Items ?? []).filter((x) => x.summary?.S);

  return threads.map<DynamoSchema["Thread"]>((thread) => {
    return {
      email: thread.pk.S!,
      openai_id: thread.openai_id.S!,
      sk: thread.sk.S!,
      summary: thread.summary.S,
    };
  });
}

export async function queryForThreadById(email: string, uuid: string) {
  const results = await dynamo.send(
    new QueryCommand({
      TableName: "studyhq",
      KeyConditionExpression: "pk = :pk and sk = :sk",
      ExpressionAttributeValues: {
        ":pk": { S: email },
        ":sk": { S: `thread#${uuid}` },
      },
    }),
  );

  const t = results?.Items?.[0];

  if (!t) {
    throw new Error(`Did not find thread with uuid ${uuid}`);
  }

  return {
    email: t.pk.S!,
    openai_id: t.openai_id.S!,
    sk: t.sk.S!,
    summary: t.summary?.S ?? "",
  };
}

export async function queryForExamsByUser(email: string) {
  const results = await dynamo.send(
    new QueryCommand({
      TableName: "studyhq",
      KeyConditionExpression: "pk = :pk AND begins_with(sk, :skPrefix)",
      ExpressionAttributeValues: {
        ":pk": { S: email },
        ":skPrefix": { S: "exam#" },
      },
    }),
  );

  const items = (results?.Items ?? []).sort((x, y) =>
    Number(x.created_at.N) < Number(y.created_at.N) ? 1 : -1,
  );

  return items.map<DynamoSchema["Exam"]>((item) => {
    return {
      email,
      sk: item.sk.S!,
      openai_id: item.openai_id.S!,
      questions: item.questions.S!,
      completed: item.completed.BOOL!,
      summary: item.summary.S,
      answers: item.answers.S,
      feedback: item.feedback.S,
      created_at: item.created_at.N!,
    };
  });
}

export async function insertUser(email: string) {
  return await dynamo.send(
    new PutItemCommand({
      TableName: "studyhq",
      Item: {
        pk: {
          S: email,
        },
        sk: { S: "PROFILE" },
        credit: { N: "500" },
      },
    }),
  );
}

export async function insertThread(
  email: string,
  sk: string,
  openai_id: string,
) {
  return await dynamo.send(
    new PutItemCommand({
      TableName: "studyhq",
      Item: marshall({
        pk: email,
        sk,
        created_at: Date.now(),
        openai_id,
      }),
    }),
  );
}

export async function updateThreadSummary(
  email: string,
  uuid: string,
  summary: string,
) {
  console.log(`Updating ${email} uuid ${uuid} summary ${summary}`);

  return await dynamo.send(
    new UpdateItemCommand({
      TableName: "studyhq",
      Key: {
        pk: {
          S: email,
        },
        sk: {
          S: `thread#${uuid}`,
        },
      },
      AttributeUpdates: {
        summary: {
          Value: {
            S: summary,
          },
          Action: "PUT",
        },
      },
    }),
  );
}

/**
 * Extract uuid from `exam#{some uuid}
 */
export function skToId(sk: string) {
  if (!sk.includes("#")) {
    throw new Error(`sk should be of format blah#uuid`);
  }
  return sk.split("#")[1];
}
