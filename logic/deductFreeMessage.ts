import type { DBUser } from "~/logic/dbTypes";
import { FreeTrialExpiredError } from "~/logic/errors";
import { db } from "~/server/db";

export async function tryDeductFreeMessage(user: DBUser) {
  const rem = Number(
    await db("users")
      .where({ id: user.id })
      .update({
        credit: user.credit - 1,
      })
      .returning(""),
  );

  if (rem < 0) {
    throw new FreeTrialExpiredError();
  }
}
