import { NuxtAuthHandler } from "#auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "~/server/db";

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
      const exists = await db("users")
        .where({ email: options.user.email })
        .first();
      if (exists) {
        console.log(`Found user with email ${options.user.email}`);
        return true;
      }

      // sign them up
      await db("users").insert({ email: options.user.email });

      return true;
    },
  },
});
