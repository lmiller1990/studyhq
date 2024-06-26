import { a as getUserSession } from '../runtime.mjs';
import { U as UnauthorizedError } from './errors.mjs';
import { f as queryForUser } from './dynamo.mjs';

async function getUser(event) {
  var _a;
  const session = await getUserSession(event);
  if (!((_a = session.user) == null ? void 0 : _a.email)) {
    throw new UnauthorizedError();
  }
  return await queryForUser(session.user.email);
}

export { getUser as g };
//# sourceMappingURL=token.mjs.map
