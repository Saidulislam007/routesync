import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { database, mongoClient } from "@/lib/mongodb";

const hasGoogleCredentials =
  Boolean(process.env.GOOGLE_CLIENT_ID) &&
  Boolean(process.env.GOOGLE_CLIENT_SECRET);

export const auth = betterAuth({
  appName: "RouteSync",

  database: mongodbAdapter(database, {
    client: mongoClient,
  }),

  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,

  trustedOrigins: [
    process.env.NEXT_PUBLIC_APP_URL,
  ].filter(Boolean),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    autoSignIn: true,
  },

  user: {
  additionalFields: {
    role: {
      type: "string",
      required: false,
      defaultValue: "employee",
      input: false,
      returned: true,
    },

    company: {
      type: "string",
      required: true,
      input: true,
      returned: true,
    },

    employeeId: {
      type: "string",
      required: true,
      input: true,
      returned: true,
    },

    verificationStatus: {
      type: "string",
      required: false,
      defaultValue: "pending",
      input: false,
      returned: true,
    },
  },
},

  socialProviders: hasGoogleCredentials
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          prompt: "select_account",
        },
      }
    : {},

  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },

  experimental: {
    joins: true,
  },
});