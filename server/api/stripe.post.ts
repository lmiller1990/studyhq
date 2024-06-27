import { stripe } from "~/server/stripe";
import { getUser } from "~/server/token";

const YOUR_DOMAIN = "http://localhost:3000";

export default defineEventHandler(async (event) => {
  const body = await readBody<{ amount: number; domain: string }>(event);
  const user = await getUser(event);
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: "price_1PP0djAFQaD2GNpPpBnR58rZ",
        quantity: 1,
      },
    ],
    mode: "payment",
    metadata: {
      email: user.email,
    },
    success_url: `${body.domain}`,
    cancel_url: `${body.domain}?credits_failed`,
  });

  return session.url;
});
