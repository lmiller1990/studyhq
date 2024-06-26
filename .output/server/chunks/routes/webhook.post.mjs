import { d as defineEventHandler, m as readRawBody } from '../runtime.mjs';
import { I as ImpossibleCodeError } from '../_/errors.mjs';
import { CloudWatchLogsClient, PutLogEventsCommand } from '@aws-sdk/client-cloudwatch-logs';
import { s as stripe } from '../_/stripe.mjs';
import { f as queryForUser, j as updateUserCredit } from '../_/dynamo.mjs';
import 'node:http';
import 'node:https';
import 'node:crypto';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';
import 'stripe';
import '@aws-sdk/client-dynamodb';
import '@aws-sdk/util-dynamodb';

const client = new CloudWatchLogsClient({
  region: process.env.AWS_REGION,
  // "ap-southeast-2", // Replace with your AWS region
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ID
  }
});
const logGroupName = "studyhq";
const logStreamName = "prod";
async function logMessage(message) {
  const params = {
    logEvents: [
      {
        message,
        timestamp: Date.now()
      }
    ],
    logGroupName,
    logStreamName
  };
  await client.send(new PutLogEventsCommand(params));
}

const endpointSecret = "whsec_ifFAtKKwECEb2jQ0cPNppOH3oIDeFuEN";
const webhook_post = defineEventHandler(async (event) => {
  var _a;
  const payload = await readRawBody(event, "utf-8");
  const sig = event.headers.get("stripe-signature");
  logMessage("Receving stripe payload...");
  let stripeEvent;
  stripeEvent = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  try {
    logMessage("Constructing...");
    stripeEvent = stripe.webhooks.constructEvent(
      payload,
      sig,
      endpointSecret
    );
    logMessage(
      `Recevied stripe webhook ${stripeEvent.id} with event ${stripeEvent.type}`
    );
    if (stripeEvent.type === "checkout.session.completed") {
      logMessage("Processing product purchase...");
      const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
        stripeEvent.data.object.id,
        {
          expand: ["line_items"]
        }
      );
      const email = (_a = sessionWithLineItems.metadata) == null ? void 0 : _a.email;
      const amount = sessionWithLineItems.amount_total;
      logMessage(`Email ${email} amount ${amount}`);
      if (!email || !amount) {
        throw new ImpossibleCodeError(
          `Should not be possible to have purchase without an email or an amount`
        );
      }
      const user = await queryForUser(email);
      if (!user) {
        throw new Error(`Could not find user with email ${email}`);
      }
      const newBal = user.credit + amount;
      logMessage(
        `Loading ${amount} for email ${email}. Before: ${user.credit} After: ${newBal}`
      );
      await updateUserCredit(email, newBal);
      return {};
    }
  } catch (err) {
    logMessage(`Webhook Error: ${err.message}`);
    return `Webhook Error: ${err.message}`;
  }
});

export { webhook_post as default };
//# sourceMappingURL=webhook.post.mjs.map
