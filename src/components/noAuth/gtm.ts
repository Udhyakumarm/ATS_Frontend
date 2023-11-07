// gtm.ts
import { useEffect } from "react";
import TagManager, { DataLayerArgs } from "react-gtm-module";

const GTM_ID = "GTM-N2H8QSRF"; // Replace this with your GTM container ID

export const initializeGTM = () => {
	useEffect(() => {
		TagManager.initialize({ gtmId: GTM_ID });

		// Track pageview on route change
		const handleRouteChange = (url: string) => {
			const dataLayerArgs: DataLayerArgs = {
				event: "pageview",
				pagePath: url
			};
			TagManager.dataLayer(dataLayerArgs);
		};

		const cleanup = () => {
			// Clean up the event listeners if necessary
		};

		handleRouteChange(window.location.pathname);

		window.addEventListener("routeChangeComplete", handleRouteChange);

		return () => {
			window.removeEventListener("routeChangeComplete", handleRouteChange);
			cleanup();
		};
	}, []);
};
