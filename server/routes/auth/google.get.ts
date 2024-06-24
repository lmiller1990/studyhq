import { insertUser, queryCheckUserExists } from "~/src/dynamo";

export default oauth.googleEventHandler({
  config: {
    authorizationParams: {},
    scope: ["email", "profile"],
  },
  async onSuccess(event, options) {
    console.log(
      options,
      `Setting session for => ${options.user.email}, Info => ${options.user}`,
    );
    await setUserSession(event, {
      user: options.user,
    });

    if (!options.user.email) {
      throw new Error(`Expected user.email to be populated`);
    }

    console.log(`Querying for ${options.user.email}`);

    const dbuser = await queryCheckUserExists(options.user.email);

    if (dbuser) {
      console.log(`Found user with email ${options.user.email}`);
      return sendRedirect(event, "/");
    }

    console.log(`Signing up ${options.user.email}`);

    await insertUser(options.user.email);

    return sendRedirect(event, "/");
  },
  // Optional, will return a json error and 401 status code by default
  onError(event, error) {
    console.error("Google OAuth error:", error);
    return sendRedirect(event, "/");
  },
});
