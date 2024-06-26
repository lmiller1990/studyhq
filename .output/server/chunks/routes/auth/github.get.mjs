import { o as oauth } from '../../_/oauth.mjs';
import { s as setUserSession, c as sendRedirect } from '../../runtime.mjs';
import 'node:crypto';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';

const github_get = oauth.githubEventHandler({
  config: {
    emailRequired: true
  },
  async onSuccess(event, { user, tokens }) {
    await setUserSession(event, {
      user: {
        githubId: user.id
      }
    });
    return sendRedirect(event, "/");
  },
  // Optional, will return a json error and 401 status code by default
  onError(event, error) {
    console.error("GitHub OAuth error:", error);
    return sendRedirect(event, "/");
  }
});

export { github_get as default };
//# sourceMappingURL=github.get.mjs.map
