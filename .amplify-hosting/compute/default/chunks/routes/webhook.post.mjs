import { d as defineEventHandler, q as readRawBody } from '../../index.mjs';
import { I as ImpossibleCodeError } from '../_/errors.mjs';
import { d as db } from '../_/db.mjs';
import { s as stripe } from '../_/stripe.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'requrl';
import 'node:fs';
import 'node:url';
import 'knex';
import 'stripe';

const endpointSecret = "whsec_c2ff6c274da62105ebd4c5e7e78ff293a9e3cd186d8e6bc394e9070e92919f37";
const webhook_post = defineEventHandler(async (event) => {
  var _a;
  const payload = await readRawBody(event, "utf-8");
  const sig = event.headers.get("stripe-signature");
  let stripeEvent;
  stripeEvent = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  try {
    stripeEvent = stripe.webhooks.constructEvent(
      payload,
      sig,
      endpointSecret
    );
    console.log(
      `Recevied stripe webhook ${stripeEvent.id} with event ${stripeEvent.type}`
    );
    if (stripeEvent.type === "checkout.session.completed") {
      const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
        stripeEvent.data.object.id,
        {
          expand: ["line_items"]
        }
      );
      const email = (_a = sessionWithLineItems.metadata) == null ? void 0 : _a.email;
      const amount = sessionWithLineItems.amount_total;
      if (!email || !amount) {
        throw new ImpossibleCodeError(
          `Should not be possible to have purchase without an email or an amount`
        );
      }
      const user = await db("users").where({ email }).first();
      if (!user) {
        throw new Error(`Could not find user with email ${email}`);
      }
      const newBal = (user == null ? void 0 : user.credit) + amount;
      console.log(
        `Loading ${amount} for email ${email}. Before: ${user.credit} After: ${newBal}`
      );
      await db("users").where({ email }).update({
        credit: newBal
      });
    }
  } catch (err) {
    return `Webhook Error: ${err.message}`;
  }
});

export { webhook_post as default };
//# sourceMappingURL=webhook.post.mjs.map
