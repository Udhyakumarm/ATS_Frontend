import "@/styles/globals.css";
import Head from "next/head";
import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import Header from "@/components/header";
import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import "nprogress/nprogress.css";
import Router from "next/router";
import NProgress from "nprogress";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
	const router = useRouter();
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
					<Header session={session}/>
					<Component {...pageProps} />
				</SessionProvider>
			</ThemeProvider>
		</>
	);
}
