import { d as defineEventHandler, r as readBody } from '../../../index.mjs';
import { s as stripe } from '../../_/stripe.mjs';
import { g as getUser } from '../../_/token.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'requrl';
import 'node:fs';
import 'node:url';
import 'stripe';
import '../../_/db.mjs';
import 'knex';
import '../../_/errors.mjs';
import '../../_/nuxtAuthHandler.mjs';
import 'next-auth/core';
import 'next-auth/jwt';

const YOUR_DOMAIN = "http://localhost:3000";
const stripe_post = defineEventHandler(async (event) => {
  await readBody(event);
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
    success_url: `${YOUR_DOMAIN}`,
    cancel_url: `${YOUR_DOMAIN}?credits_failed`
  });
  return session.url;
});

export { stripe_post as default };
//# sourceMappingURL=stripe.post.mjs.map
