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
		} catch (err: any) {
			// console.log("Token refresh error, signing out");
			return [null, null];
		}
	};
}

export const authOptions: NextAuthOptions = {
	secret: process.env.SESSION_SECRET,
	session: {
		maxAge: 60 * 20 // 20 Minutes
	},
	jwt: {
		secret: process.env.JWT_SECRET
	},
	debug: process.env.NODE_ENV === "development",
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email", placeholder: "email" },
				password: { label: "Password", type: "password" },
				user_type: { type: "string" }
			},
			async authorize(credentials) {
				const userObj = await axiosInstance.api
					.post(
						credentials?.user_type === "candidate"
							? "/candidate/candidatelogin/"
							: credentials?.user_type === "vendor"
							? "/vendors/vendor_login/"
							: "/organization/login/",
						{
							email: credentials?.email,
							password: credentials?.password
						}
					)
					.then((response) => {
						// console.log({ response: response.data.userObj });
						return response;
					})
					.then((response) => ({
						...response.data.userObj[0],
						refreshToken: response.data.tokens.refresh,
						accessToken: response.data.tokens.access
					}))
					.catch((err) => {
						// console.log({ err });
						return null;
					});
				if (!userObj) return null;
				return { ...userObj, user_type: credentials?.user_type };
			}
		})
	],
	callbacks: {
		async jwt({ token, user, account, profile, isNewUser }: any) {
			if (user) {
				return { ...token, user_type: user.user_type, accessToken: user.accessToken, refreshToken: user.refreshToken };
			}

			if (JwtUtils.isJwtExpired(token.accessToken as string)) {
				const [newAccessToken, newRefreshToken] = await NextAuthUtils.refreshToken(token.refreshToken);

				// console.log(newAccessToken && newRefreshToken);
				if (newAccessToken && newRefreshToken) {
					token = {
						...token,
						accessToken: newAccessToken,
						refreshToken: newRefreshToken,
						iat: Math.floor(Date.now() / 1000),
						exp: Math.floor(Date.now() / 1000 + 2 * 60 * 60)
					};

					return { ...user, ...token };
				} else return { error: "RefreshAccessTokenError" };
			}
			return { ...token };
		},
		async session({ session, token }) {
			session["accessToken"] = token.accessToken as string;
			session["user_type"] = token.user_type as string;
			session["error"] = token.error as string;
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
