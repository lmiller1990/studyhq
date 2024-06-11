import { NuxtAuthHandler } from "#auth";
import GoogleProvider from "next-auth/providers/google";
import { insertUser, queryForUser } from "~/src/dynamo";

export default NuxtAuthHandler({
  secret: process.env.SECRET,
  cookies: {
    sessionToken: {
      options: {},
      name: "studymate-auth.session-token",
    },
    callbackUrl: {
      options: {},
      name: "studymate-auth.callback-url",
    },
    csrfToken: {
      options: {},
      name: "studymate-auth.csrf-token",
    },
  },
  providers: [
    // @ts-ignore trust me
    GoogleProvider.default({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    signIn: async (options) => {
      if (!options.user.email) {
        throw new Error(`Expected user.email to be populated`);
      }

      console.log(`Querying for ${options.user.email}`);

      const dbuser = await queryForUser(options.user.email);

      if (dbuser) {
        console.log(`Found user with email ${options.user.email}`);
        return true;
      }

      console.log(`Signing up ${options.user.email}`);

      await insertUser(options.user.email);

      return true;
    },
  },
});
