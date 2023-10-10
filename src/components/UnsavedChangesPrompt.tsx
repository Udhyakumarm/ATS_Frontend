// UnsavedChangesPrompt.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useLangStore } from "@/utils/code";

const UnsavedChangesPrompt = () => {
	const router = useRouter();
	const [confirmedToLeave, setConfirmedToLeave] = useState(false);
	const srcLang = useLangStore((state: { lang: any }) => state.lang);

	useEffect(() => {
		const handleBeforeUnload = (event) => {
			if (!confirmedToLeave) {
				const message = "You have unsaved changes. Are you sure you want to leave?";
				event.returnValue = message; // Standard for most browsers
				return message; // For some older browsers
			}
		};

		const handleRouteChange = (url) => {
			if (
				!confirmedToLeave &&
				!window.confirm(
					srcLang === "ja"
						? "AIの仕事の説明生成プロセスは現在実行中です。本当に移動しますか？"
						: "The AI job description generation process is currently running. Are you certain you want to navigate away?"
				)
			) {
				// Prevent route change
				router.events.emit("routeChangeError");
				throw "routeChange aborted.";
			}
		};

		window.addEventListener("beforeunload", handleBeforeUnload);
		router.events.on("routeChangeStart", handleRouteChange);

		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload);
			router.events.off("routeChangeStart", handleRouteChange);
		};
	}, [confirmedToLeave, router]);

	// Set confirmedToLeave to true when user clicks "OK" in the confirmation dialog
	const handleConfirmLeave = () => {
		setConfirmedToLeave(true);
	};

	return null;
};

export default UnsavedChangesPrompt;
