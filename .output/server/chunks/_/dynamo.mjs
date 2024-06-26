import { DynamoDB, QueryCommand, UpdateItemCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';

let dynamo;
async function queryCheckUserExists(email) {
  var _a, _b;
  if (!dynamo) {
    dynamo = new DynamoDB({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ID
      }
    });
  }
  const result = await dynamo.send(
    new QueryCommand({
      TableName: "studyhq",
      KeyConditionExpression: "pk = :pk AND sk = :sk",
      ExpressionAttributeValues: {
        ":pk": { S: email },
        ":sk": { S: "PROFILE" }
      }
    })
  );
  return (_b = (_a = result.Items) == null ? void 0 : _a[0]) != null ? _b : null;
}
async function queryForUser(email) {
  var _a, _b, _c;
  const dbuser = await queryCheckUserExists(email);
  if (!dbuser || !((_a = dbuser.credit) == null ? void 0 : _a.N) || !((_b = dbuser.pk) == null ? void 0 : _b.S) || !((_c = dbuser.sk) == null ? void 0 : _c.S)) {
    console.log(`dbuser`, JSON.stringify(dbuser, null, 4));
    throw new Error(`User with matching email: ${email} not found`);
  }
  return {
    credit: Number(dbuser.credit.N),
    email: dbuser.pk.S,
    sk: "PROFILE"
  };
}
async function updateUserCredit(email, newBalance) {
  return await dynamo.send(
    new UpdateItemCommand({
      TableName: "studyhq",
      Key: {
        pk: {
          S: email
        },
        sk: {
          S: `PROFILE`
        }
      },
      AttributeUpdates: {
        credit: {
          Value: {
            N: newBalance.toString()
          },
          Action: "PUT"
        }
      }
    })
  );
}
async function queryForThreadsByUser(email) {
  var _a;
  const results = await dynamo.send(
    new QueryCommand({
      TableName: "studyhq",
      KeyConditionExpression: "pk = :pk AND begins_with(sk, :skPrefix)",
      ExpressionAttributeValues: {
        ":pk": { S: email },
        ":skPrefix": { S: "thread#" }
      }
    })
  );
  const threads = (_a = results == null ? void 0 : results.Items) != null ? _a : [];
  return threads.map((thread) => {
    var _a2, _b;
    return {
      email: thread.pk.S,
      openai_id: thread.openai_id.S,
      sk: thread.sk.S,
      summary: (_b = (_a2 = thread.summary) == null ? void 0 : _a2.S) != null ? _b : ""
    };
  });
}
async function queryForThreadById(email, uuid) {
  var _a, _b, _c;
  const results = await dynamo.send(
    new QueryCommand({
      TableName: "studyhq",
      KeyConditionExpression: "pk = :pk and sk = :sk",
      ExpressionAttributeValues: {
        ":pk": { S: email },
        ":sk": { S: `thread#${uuid}` }
      }
    })
  );
  const t = (_a = results == null ? void 0 : results.Items) == null ? void 0 : _a[0];
  if (!t) {
    throw new Error(`Did not find thread with uuid ${uuid}`);
  }
  return {
    email: t.pk.S,
    openai_id: t.openai_id.S,
    sk: t.sk.S,
    summary: (_c = (_b = t.summary) == null ? void 0 : _b.S) != null ? _c : ""
  };
}
async function queryForExamsByUser(email) {
  var _a;
  const results = await dynamo.send(
    new QueryCommand({
      TableName: "studyhq",
      KeyConditionExpression: "pk = :pk AND begins_with(sk, :skPrefix)",
      ExpressionAttributeValues: {
        ":pk": { S: email },
        ":skPrefix": { S: "exam#" }
      }
    })
  );
  const items = ((_a = results == null ? void 0 : results.Items) != null ? _a : []).sort(
    (x, y) => Number(x.created_at.N) < Number(y.created_at.N) ? 1 : -1
  );
  return items.map((item) => {
    var _a2, _b, _c, _d, _e, _f;
    return {
      email,
      sk: item.sk.S,
      openai_id: item.openai_id.S,
      questions: item.questions.S,
      completed: (_b = (_a2 = item.completed) == null ? void 0 : _a2.BOOL) != null ? _b : false,
      summary: item.summary.S,
      answers: (_d = (_c = item.answers) == null ? void 0 : _c.S) != null ? _d : "",
      feedback: (_f = (_e = item.feedback) == null ? void 0 : _e.S) != null ? _f : "",
      created_at: item.created_at.N
    };
  });
}
async function insertUser(email) {
  return await dynamo.send(
    new PutItemCommand({
      TableName: "studyhq",
      Item: {
        pk: {
          S: email
        },
        sk: { S: "PROFILE" },
        credit: { N: "500" }
      }
    })
  );
}
async function insertThread(email, sk, openai_id) {
  return await dynamo.send(
    new PutItemCommand({
      TableName: "studyhq",
      Item: marshall({
        pk: email,
        sk,
        created_at: Date.now(),
        openai_id
      })
    })
  );
}
async function updateThreadSummary(email, uuid, summary) {
  console.log(`Updating ${email} uuid ${uuid} summary ${summary}`);
  return await dynamo.send(
    new UpdateItemCommand({
      TableName: "studyhq",
      Key: {
        pk: {
          S: email
        },
        sk: {
          S: `thread#${uuid}`
        }
      },
      AttributeUpdates: {
        summary: {
          Value: {
            S: summary
          },
          Action: "PUT"
        }
      }
    })
  );
}
function skToId(sk) {
  if (!sk.includes("#")) {
    throw new Error(`sk should be of format blah#uuid`);
  }
  return sk.split("#")[1];
}
async function insertExam({
  questions,
  openai_id,
  summary,
  email,
  uuid
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
        summary
      })
    })
  );
}
async function queryForExamById(email, uuid) {
  const exams = await queryForExamsByUser(email);
  const e = exams.find((x) => x.sk === `exam#${uuid}`);
  if (!e) {
    throw new Error(`Could not find exam with id ${uuid}`);
  }
  return e;
}
async function updateExam(options) {
  const { email, uuid, feedback, answers } = options;
  return await dynamo.send(
    new UpdateItemCommand({
      TableName: "studyhq",
      Key: {
        pk: {
          S: email
        },
        sk: {
          S: `exam#${uuid}`
        }
      },
      AttributeUpdates: {
        feedback: {
          Value: {
            S: feedback
          },
          Action: "PUT"
        },
        completed: {
          Value: {
            BOOL: true
          },
          Action: "PUT"
        },
        answers: {
          Value: {
            S: answers
          },
          Action: "PUT"
        }
      }
    })
  );
}
async function resetExam(options) {
  const { email, uuid } = options;
  return await dynamo.send(
    new UpdateItemCommand({
      TableName: "studyhq",
      Key: {
        pk: {
          S: email
        },
        sk: {
          S: `exam#${uuid}`
        }
      },
      AttributeUpdates: {
        feedback: {
          Value: {
            S: ""
          },
          Action: "PUT"
        },
        completed: {
          Value: {
            BOOL: false
          },
          Action: "PUT"
        },
        answers: {
          Value: {
            S: ""
          },
          Action: "PUT"
        }
      }
    })
  );
}

export { queryForExamById as a, queryForThreadById as b, updateThreadSummary as c, queryForThreadsByUser as d, insertThread as e, queryForUser as f, queryCheckUserExists as g, insertUser as h, insertExam as i, updateUserCredit as j, queryForExamsByUser as q, resetExam as r, skToId as s, updateExam as u };
//# sourceMappingURL=dynamo.mjs.map
