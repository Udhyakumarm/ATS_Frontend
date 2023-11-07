import { useLangStore } from "@/utils/code";
import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
	const srcLang = useLangStore((state: { lang: any }) => state.lang);

	return (
		<Html lang={srcLang}>
			<Head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" />
				<link
					href="https://fonts.googleapis.com/css2?family=Lexend:wght@200;300;400;500;600;700;800;900;1000&display=swap"
					rel="stylesheet"
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Nunito:wght@200;300;400;500;600;700;800;900;1000&display=swap"
					rel="stylesheet"
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap"
					rel="stylesheet"
				></link>

				<link
					rel="stylesheet"
					href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css"
					integrity="sha512-MV7K8+y+gLIBoVD59lQIYicR65iaqukzvf/nwasF0nqhPay5w/9lJmVM2hMDcnK1OnMGCdVK+iQrJ7lzPJQd1w=="
					crossOrigin="anonymous"
					referrerPolicy="no-referrer"
				/>
				{/* <title>Somhako</title> */}

				{/* Google tag (gtag.js) */}
				<Script src="https://www.googletagmanager.com/gtag/js?id=G-CLMDJ56THX" />
				<Script id="google-analytics">
					{`
					window.dataLayer = window.dataLayer || [];
					function gtag(){
					dataLayer.push(arguments)
					}
					gtag('js', new Date());

					gtag('config', 'G-CLMDJ56THX');
					`}
				</Script>
				{/* Google Tag Manager */}
				<Script id="google-tag">
					{`
					(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
					new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
					j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
					'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
					})(window,document,'script','dataLayer','GTM-N2H8QSRF');
					`}
				</Script>
				{/* End Google Tag Manager */}
			</Head>
			<body className="bg-lightBlue text-black dark:bg-gray-900 dark:text-white">
				{/* <!-- Google Tag Manager (noscript) --> */}
				<noscript>
					<iframe
						src="https://www.googletagmanager.com/ns.html?id=GTM-N2H8QSRF"
						height="0"
						width="0"
						style={{ display: "none", visibility: "hidden" }}
					></iframe>
				</noscript>
				{/* <!-- End Google Tag Manager (noscript) --> */}
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
