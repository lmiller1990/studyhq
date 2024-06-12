import { ImpossibleCodeError } from "~/logic/errors";
import { stripe } from "~/server/stripe";
import { queryForUser, updateUserCredit } from "~/src/dynamo";

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

    console.log(
      `Recevied stripe webhook ${stripeEvent.id} with event ${stripeEvent.type}`,
    );

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

      const user = await queryForUser(email);

      if (!user) {
        throw new Error(`Could not find user with email ${email}`);
      }

      const newBal = user.credit + amount;

      console.log(
        `Loading ${amount} for email ${email}. Before: ${user.credit} After: ${newBal}`,
      );

      await updateUserCredit(email, newBal);
    }
  } catch (err) {
    return `Webhook Error: ${(err as Error).message}`;
  }
});
