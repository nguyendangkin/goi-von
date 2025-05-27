import { IUser } from "@/types/next-auth";
import {
    InactiveAccountError,
    InvalidEmailPasswordError,
} from "@/utils/authError";
import { sendRequest } from "@/utils/fetch";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials) => {
                const data = await sendRequest<IBackendRes<ILogin>>({
                    method: "POST",
                    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/login`,
                    body: {
                        email: credentials.email,
                        password: credentials.password,
                    },
                });

                if (+data.statusCode === 201) {
                    return {
                        id: data.data?.user.id,
                        fullName: data.data?.user.fullName,
                        email: data.data?.user.email,
                        access_token: data.data?.access_token,
                    };
                } else if (+data.statusCode === 401) {
                    throw new InvalidEmailPasswordError();
                } else if (+data.statusCode === 400) {
                    throw new InactiveAccountError();
                } else {
                    throw new Error(data.message);
                }
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                // User is available during sign-in
                token.user = user as IUser;
            }
            return token;
        },
        session({ session, token }) {
            (session.user as IUser) = token.user;
            return session;
        },

        authorized: async ({ auth }) => {
            // Logged in users are authenticated,
            //otherwise redirect to login page
            return !!auth;
        },
    },
});
