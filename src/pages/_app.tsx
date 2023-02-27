import "@/styles/globals.css";
import Head from "next/head";
import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import Header from "@/components/header";
import { SessionProvider } from "next-auth/react";

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <>
      <ThemeProvider attribute="class">
        <SessionProvider session={session}>
          <Head>
            <meta name="viewport" content="viewport-fit=cover" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <Header />
          <Component {...pageProps} />
        </SessionProvider>
      </ThemeProvider>
    </>
  );
}
