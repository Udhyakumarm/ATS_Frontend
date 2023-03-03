import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import { NextAuthOptions } from "next-auth";
import axios from "axios";
import { JwtUtils, axiosInstance } from "../../../utils";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

namespace NextAuthUtils {
	export const refreshToken = async function (refreshToken: unknown) {
		try {
			const response = await axios.post(
				process.env.NODE_ENV === "production"
					? `${process.env.NEXT_PUBLIC_PROD_BACKEND_BASE}djrestauth/token/refresh/`
					: `${process.env.NEXT_PUBLIC_DEV_BACKEND_BASE}djrestauth/token/refresh/`,
				// UrlUtils.makeUrl(
				//   process.env.BACKEND_API_BASE,
				//   "djrestauth",
				//   "token",
				//   "refresh",
				// ),
				{
					refresh: refreshToken
				}
			);
			if (response.data.refresh) {
				const { access, refresh } = response.data;
				return [access, refresh];
			} else {
				const { access } = response.data;
				return [access, refreshToken];
			}
		} catch (err) {
			return [null, null];
		}
	};
}

export const authOptions: NextAuthOptions = {
	secret: process.env.SESSION_SECRET,
	session: {
		maxAge: 24 * 60 * 60 // 24 hours
	},
	jwt: {
		secret: process.env.JWT_SECRET
	},
	debug: process.env.NODE_ENV === "development",
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
		}),
		LinkedInProvider({
			clientId: process.env.LINKEDIN_CLIENT_ID as string,
			clientSecret: process.env.LINKEDIN_CLIENT_SECRET as string
		}),
		GitHubProvider({
			clientId:
				process.env.NODE_ENV === "production"
					? (process.env.GITHUB_CLIENT_PROD_ID as string)
					: (process.env.GITHUB_CLIENT_DEV_ID as string),
			clientSecret:
				process.env.NODE_ENV === "production"
					? (process.env.GITHUB_CLIENT_PROD_SECRET as string)
					: (process.env.GITHUB_CLIENT_DEV_SECRET as string)
		}),
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email", placeholder: "email" },
				password: { label: "Password", type: "password" },
				user_type: { type: "string" }
			},
			async authorize(credentials) {
				const userObj = await axiosInstance.api
					.post(credentials?.user_type === "candidate" ? "/candidate/candidatelogin/" : "/organization/login/", {
						email: credentials?.email,
						password: credentials?.password
					})
					.then((response) => {
						console.log({ response: response.data.userObj });
						return response;
					})
					.then((response) => ({
						...response.data.userObj[0],
						token: {
							refreshToken: response.data.tokens.refresh,
							accessToken: response.data.tokens.access
						}
					}))
					.catch((err) => {
						console.log({ err });
						return null;
					});

				return { ...userObj, user_type: credentials?.user_type };
			}
		})
	],
	callbacks: {
		async jwt({ token, user, account, profile, isNewUser }: any) {
			if (user) {
				return { ...token, user_type: user.user_type, ...user.token };
			}

			if (JwtUtils.isJwtExpired(token.accessToken as string)) {
				const [newAccessToken, newRefreshToken] = await NextAuthUtils.refreshToken(token.refreshToken);

				if (newAccessToken && newRefreshToken) {
					token = {
						...token,
						accessToken: newAccessToken,
						refreshToken: newRefreshToken,
						iat: Math.floor(Date.now() / 1000),
						exp: Math.floor(Date.now() / 1000 + 2 * 60 * 60)
					};

					return { ...user, token };
				}

				return {
					...user,
					...token,
					exp: 0
				};
			}
			return token;
		},
		async session({ session, token }) {
			session["accessToken"] = token.accessToken as string;
			session["user_type"] = token.user_type as string;
			return session;
		},
		async redirect({ url, baseUrl }) {
			// Allows relative callback URLs
			if (url.startsWith("/")) return `${baseUrl}${url}`;
			// Allows callback URLs on the same origin
			return baseUrl;
		}
	},
	pages: {
		signIn: "/auth/signin",
		error: "/auth/signin"
	}
};

const NextAuthWrapper = (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, authOptions);
export default NextAuthWrapper;
