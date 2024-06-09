import { F as FreeTrialExpiredError } from './errors.mjs';
import { d as db } from './db.mjs';

async function tryDeductFreeMessage(user) {
  const rem = Number(
    await db("users").where({ id: user.id }).update({
      credit: user.credit - 1
    }).returning("")
  );
  if (rem < 0) {
    throw new FreeTrialExpiredError();
  }
}

export { tryDeductFreeMessage as t };
//# sourceMappingURL=deductFreeMessage.mjs.map
