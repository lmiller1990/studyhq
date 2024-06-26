import {
  DynamoDB,
  PutItemCommand,
  QueryCommand,
  UpdateItemCommand,
  UpdateTimeToLiveCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import type { DynamoSchema } from "~/src/dbTypes";

let dynamo: DynamoDB;

export async function queryCheckUserExists(email: string) {
  if (!dynamo) {
    dynamo = new DynamoDB({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ID!,
      },
    });
  }

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

  return result.Items?.[0] ?? null;
}

export async function queryForUser(
  email: string,
): Promise<DynamoSchema["User"]> {
  const dbuser = await queryCheckUserExists(email);

  if (!dbuser || !dbuser.credit?.N || !dbuser.pk?.S || !dbuser.sk?.S) {
    console.log(`dbuser`, JSON.stringify(dbuser, null, 4));
    throw new Error(`User with matching email: ${email} not found`);
  }

  return {
    credit: Number(dbuser.credit.N),
    email: dbuser.pk.S,
    sk: "PROFILE",
  };
}

export async function updateUserCredit(email: string, newBalance: number) {
  return await dynamo.send(
    new UpdateItemCommand({
      TableName: "studyhq",
      Key: {
        pk: {
          S: email,
        },
        sk: {
          S: `PROFILE`,
        },
      },
      AttributeUpdates: {
        credit: {
          Value: {
            N: newBalance.toString(),
          },
          Action: "PUT",
        },
      },
    }),
  );
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

  const threads = results?.Items ?? []; // .filter((x) => x.summary?.S);

  return threads.map<DynamoSchema["Thread"]>((thread) => {
    return {
      email: thread.pk.S!,
      openai_id: thread.openai_id.S!,
      sk: thread.sk.S!,
      summary: thread.summary?.S ?? "",
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
      completed: item.completed?.BOOL ?? false,
      summary: item.summary.S,
      answers: item.answers?.S ?? "",
      feedback: item.feedback?.S ?? "",
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

export async function insertExam({
  questions,
  openai_id,
  summary,
  email,
  uuid,
}: {
  email: string;
  uuid: string;
  openai_id: string;
  questions: string;
  summary: string;
}) {
  return await dynamo.send(
    new PutItemCommand({
      TableName: "studyhq",
      Item: marshall({
        pk: email,
        sk: `exam#${uuid}`,
        questions,
        created_at: Date.now(),
        openai_id,
        summary,
      }),
    }),
  );
}

export async function queryForExamById(email: string, uuid: string) {
  const exams = await queryForExamsByUser(email);
  const e = exams.find((x) => x.sk === `exam#${uuid}`);
  if (!e) {
    throw new Error(`Could not find exam with id ${uuid}`);
  }
  return e;
}

export async function updateExam(options: {
  email: string;
  uuid: string;
  feedback: string;
  answers: string;
}) {
  const { email, uuid, feedback, answers } = options;

  return await dynamo.send(
    new UpdateItemCommand({
      TableName: "studyhq",
      Key: {
        pk: {
          S: email,
        },
        sk: {
          S: `exam#${uuid}`,
        },
      },
      AttributeUpdates: {
        feedback: {
          Value: {
            S: feedback,
          },
          Action: "PUT",
        },
        completed: {
          Value: {
            BOOL: true,
          },
          Action: "PUT",
        },
        answers: {
          Value: {
            S: answers,
          },
          Action: "PUT",
        },
      },
    }),
  );
}

export async function resetExam(options: { email: string; uuid: string }) {
  const { email, uuid } = options;

  return await dynamo.send(
    new UpdateItemCommand({
      TableName: "studyhq",
      Key: {
        pk: {
          S: email,
        },
        sk: {
          S: `exam#${uuid}`,
        },
      },
      AttributeUpdates: {
        feedback: {
          Value: {
            S: "",
          },
          Action: "PUT",
        },
        completed: {
          Value: {
            BOOL: false,
          },
          Action: "PUT",
        },
        answers: {
          Value: {
            S: "",
          },
          Action: "PUT",
        },
      },
    }),
  );
}
