import { useCarrierStore, useUserStore } from "@/utils/code";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
	const type = useUserStore((state: { type: any }) => state.type);
	const cname = useCarrierStore((state: { cname: any }) => state.cname);
	const router = useRouter();
	useEffect(() => {
		if (type && type.length > 0) {
			if (type === "Organization") {
				router.replace("/organization");
			}
			if (type === "Candidate" && cname && cname.length > 0) {
				router.replace(`/organization/${cname}/`);
			}
		} else {
			router.replace("/auth/signin");
		}
	}, [type, cname]);
	return <></>;
}
