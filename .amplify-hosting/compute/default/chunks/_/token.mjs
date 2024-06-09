import { d as db } from './db.mjs';
import { U as UnauthorizedError, I as ImpossibleCodeError } from './errors.mjs';
import { g as getToken } from './nuxtAuthHandler.mjs';

async function getUser(event) {
  const t = await getToken({
    event,
    cookieName: "studymate-auth.session-token"
  });
  if (!(t == null ? void 0 : t.email)) {
    throw new UnauthorizedError();
  }
  const exists = await db("users").where({ email: t.email }).first();
  if (exists) {
    return {
      ...exists,
      id: exists.id,
      email: exists.email,
      credit: exists.credit
    };
  }
  throw new ImpossibleCodeError(
    `User with matching email: ${t.email} not found`
  );
}

export { getUser as g };
//# sourceMappingURL=token.mjs.map
