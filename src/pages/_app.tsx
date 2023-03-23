import "@/styles/globals.css";
import Head from "next/head";
import { ThemeProvider } from "next-themes";
import Header from "@/components/Header";
import { SessionProvider, signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import "nprogress/nprogress.css";
import Router from "next/router";
import NProgress from "nprogress";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";

export default function App({ Component, pageProps: { session, ...pageProps } }: any) {
	useEffect(() => {
		const handleRouteStart = () => NProgress.start();
		const handleRouteDone = () => NProgress.done();

		Router.events.on("routeChangeStart", handleRouteStart);
		Router.events.on("routeChangeComplete", handleRouteDone);
		Router.events.on("routeChangeError", handleRouteDone);

		return () => {
			// Make sure to remove the event handler on unmount!
			Router.events.off("routeChangeStart", handleRouteStart);
			Router.events.off("routeChangeComplete", handleRouteDone);
			Router.events.off("routeChangeError", handleRouteDone);
		};
	}, []);

	return (
		<>
			<Toaster />
			<ThemeProvider attribute="class">
				<SessionProvider session={session}>
					<Head>
						<meta name="viewport" content="viewport-fit=cover" />
						<meta name="viewport" content="width=device-width, initial-scale=1" />
						<link rel="icon" href="/favicon.ico" />
					</Head>
					<Header />
					{Component.noAuth ? (
						<Component {...pageProps} />
					) : (
						<Auth>
							<Component {...pageProps} />
						</Auth>
					)}
				</SessionProvider>
			</ThemeProvider>
			<Analytics />
		</>
	);
}

function Auth({ children }: any) {
	const { data: session, status } = useSession();
	const isUser = !!session?.user;
	useEffect(() => {
		if (status == "loading") return; // Do nothing while loading
		if (!isUser) signIn(); // If not authenticated, force log in
	}, [isUser, status]);

	if (isUser) {
		return children;
	}

	return <></>;
}
