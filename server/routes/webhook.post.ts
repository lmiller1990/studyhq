import { ImpossibleCodeError } from "~/logic/errors";
import { logMessage } from "~/server/aws/cloudwatch";
import { stripe } from "~/server/stripe";
import { queryForUser, updateUserCredit } from "~/src/dynamo";

const endpointSecret = "whsec_ifFAtKKwECEb2jQ0cPNppOH3oIDeFuEN";

export default defineEventHandler(async (event) => {
  const payload = await readRawBody(event, "utf-8");
  const sig = event.headers.get("stripe-signature");

  logMessage("Receving stripe payload...");

  let stripeEvent;

  stripeEvent = stripe.webhooks.constructEvent(payload!, sig!, endpointSecret);
  try {
    logMessage("Constructing...");
    stripeEvent = stripe.webhooks.constructEvent(
      payload!,
      sig!,
      endpointSecret,
    );

    logMessage(
      `Recevied stripe webhook ${stripeEvent.id} with event ${stripeEvent.type}`,
    );

    if (stripeEvent.type === "checkout.session.completed") {
      logMessage("Processing product purchase...");

      // Retrieve the session. If you require line items in the response, you may include them by expanding line_items.
      const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
        stripeEvent.data.object.id,
        {
          expand: ["line_items"],
        },
      );

      const email = sessionWithLineItems.metadata?.email;
      const amount = sessionWithLineItems.amount_total;
      logMessage(`Email ${email} amount ${amount}`);

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

      logMessage(
        `Loading ${amount} for email ${email}. Before: ${user.credit} After: ${newBal}`,
      );

      await updateUserCredit(email, newBal);
      return {};
    }
  } catch (err) {
    logMessage(`Webhook Error: ${(err as Error).message}`);
    return `Webhook Error: ${(err as Error).message}`;
  }
});
