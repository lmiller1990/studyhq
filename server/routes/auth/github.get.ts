import { insertUser, queryCheckUserExists } from "~/src/dynamo";

export default oauth.githubEventHandler({
  config: {
    emailRequired: true,
  },
  async onSuccess(event, { user, tokens }) {
    await setUserSession(event, {
      user: {
        ...user,
        githubId: user.id,
      },
    });

    if (!user.email) {
      throw new Error(`Expected user.email to be populated`);
    }

    console.log(`Querying for ${user.email}`);

    const dbuser = await queryCheckUserExists(user.email);

    if (dbuser) {
      console.log(`Found user with email ${user.email}`);
      return sendRedirect(event, "/");
    }

    console.log(`Signing up ${user.email}`);

    await insertUser(user.email);

    return sendRedirect(event, "/");
  },
  // Optional, will return a json error and 401 status code by default
  onError(event, error) {
    console.error("GitHub OAuth error:", error, event.node.req.originalUrl);
    return sendRedirect(event, "/");
  },
});
