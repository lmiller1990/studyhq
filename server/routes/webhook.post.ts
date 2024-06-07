import { ImpossibleCodeError } from "~/logic/errors";
import { db } from "~/server/db";
import { stripe } from "~/server/stripe";
import { getUser } from "~/server/token";

const endpointSecret =
  "whsec_c2ff6c274da62105ebd4c5e7e78ff293a9e3cd186d8e6bc394e9070e92919f37";

export default defineEventHandler(async (event) => {
  const payload = await readRawBody(event, "utf-8");
  const sig = event.headers.get("stripe-signature");

  let stripeEvent;

  stripeEvent = stripe.webhooks.constructEvent(payload!, sig!, endpointSecret);
  try {
    stripeEvent = stripe.webhooks.constructEvent(
      payload!,
      sig!,
      endpointSecret,
    );
    console.log("Here!", JSON.stringify(stripeEvent, null, 4));
    if (stripeEvent.type === "checkout.session.completed") {
      // Retrieve the session. If you require line items in the response, you may include them by expanding line_items.
      const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
        stripeEvent.data.object.id,
        {
          expand: ["line_items"],
        },
      );

      const email = sessionWithLineItems.metadata?.email;
      const amount = sessionWithLineItems.amount_total;

      if (!email || !amount) {
        throw new ImpossibleCodeError(
          `Should not be possible to have purchase without an email or an amount`,
        );
      }

      const user = await db("users").where({ email }).first();

      await db("users")
        .where({ email })
        .update({
          credit: user.credit + amount,
        });
    }
  } catch (err) {
    console.log("uh oh");
    return `Webhook Error: ${err.message}`;
  }
});
