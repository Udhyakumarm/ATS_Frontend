import '@/styles/globals.css'
import Head from 'next/head'
import type { AppProps } from 'next/app'
import { ThemeProvider } from "next-themes";
import Header from '@/components/header';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ThemeProvider attribute="class"> 
        <Head>
          <meta name="viewport" content="viewport-fit=cover" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Header />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}
