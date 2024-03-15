import { useCarrierStore, useUserStore } from "@/utils/code";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
	const type = useUserStore((state: { type: any }) => state.type);
	const cname = useCarrierStore((state: { cname: any }) => state.cname);
	const vid = useCarrierStore((state: { vid: any }) => state.vid);
	const router = useRouter();
	useEffect(() => {
		if (type && type.length > 0) {
			if (type === "Organization") {
				router.replace("/organization");
			}
			if (type === "Agency") {
				router.replace("/agency");
			}
			if (type === "Candidate" && cname && cname.length > 0) {
				router.replace(`/organization/${cname}/`);
			}
			if (type === "Vendor" && vid && vid.length > 0) {
				router.replace(`/vendor/${vid}/clients`);
			}
		} else {
			router.replace("/auth/signin");
		}
	}, [type, cname, vid]);
	return <></>;
}

Home.mobileEnabled = true;
