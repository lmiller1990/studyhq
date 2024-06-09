import GoogleProvider from 'next-auth/providers/google';
import { d as db } from '../../../_/db.mjs';
import { N as NuxtAuthHandler } from '../../../_/nuxtAuthHandler.mjs';
import 'knex';
import '../../../../index.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'requrl';
import 'node:fs';
import 'node:url';
import 'next-auth/core';
import 'next-auth/jwt';

const _____ = NuxtAuthHandler({
  secret: process.env.SECRET,
  cookies: {
    sessionToken: {
      options: {},
      name: "studymate-auth.session-token"
    },
    callbackUrl: {
      options: {},
      name: "studymate-auth.callback-url"
    },
    csrfToken: {
      options: {},
      name: "studymate-auth.csrf-token"
    }
  },
  providers: [
    // @ts-ignore trust me
    GoogleProvider.default({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],
  callbacks: {
    signIn: async (options) => {
      const exists = await db("users").where({ email: options.user.email }).first();
      if (exists) {
        console.log(`Found user with email ${options.user.email}`);
        return true;
      }
      await db("users").insert({ email: options.user.email });
      return true;
    }
  }
});

export { _____ as default };
//# sourceMappingURL=_..._.mjs.map
