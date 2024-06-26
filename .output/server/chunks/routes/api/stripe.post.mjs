import { d as defineEventHandler, r as readBody } from '../../runtime.mjs';
import { s as stripe } from '../../_/stripe.mjs';
import { g as getUser } from '../../_/token.mjs';
import 'node:http';
import 'node:https';
import 'node:crypto';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';
import 'stripe';
import '../../_/errors.mjs';
import '../../_/dynamo.mjs';
import '@aws-sdk/client-dynamodb';
import '@aws-sdk/util-dynamodb';

const stripe_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const user = await getUser(event);
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: "price_1PP0djAFQaD2GNpPpBnR58rZ",
        quantity: 1
      }
    ],
    mode: "payment",
    metadata: {
      email: user.email
    },
    success_url: `${body.domain}`,
    cancel_url: `${body.domain}?credits_failed`
  });
  return session.url;
});

export { stripe_post as default };
//# sourceMappingURL=stripe.post.mjs.map
