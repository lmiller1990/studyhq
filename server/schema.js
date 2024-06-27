import {
  CreateTableCommand,
  DeleteTableCommand,
  DynamoDB,
  GetItemCommand,
  PutItemCommand,
  QueryCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";

const dynamo = new DynamoDB();

async function createSchema() {
  // delete old one
  try {
    await dynamo.send(
      new DeleteTableCommand({
        TableName: "studyhq",
      }),
    );
    console.log("🧨 deleted table");
  } catch (e) {
    console.log("❌ Could not delete table", e);
  }

  // table with attrs
  try {
    await dynamo.send(
      new CreateTableCommand({
        TableName: "studyhq",
        AttributeDefinitions: [
          { AttributeName: "pk", AttributeType: "S" },
          { AttributeName: "sk", AttributeType: "S" },
        ],
        KeySchema: [
          { AttributeName: "pk", KeyType: "HASH" },
          { AttributeName: "sk", KeyType: "RANGE" },
        ],
        ProvisionedThroughput: {
          WriteCapacityUnits: 5,
          ReadCapacityUnits: 5,
        },
      }),
    );

    console.log("⭐ ️created table");
  } catch (e) {
    console.log("❌ Could not create table", e);
  }
}

await createSchema();
