import { useCarrierStore } from "@/utils/code";

export default function Home() {
	// const cid = useCarrierStore((state: { cid: any }) => state.cid);
	return (
		<>
			<div>Home</div>
		</>
	);
}

// import { authOptions } from "./api/auth/[...nextauth]";
// import { getServerSession } from "next-auth/next";

// export async function getServerSideProps(context: any) {
// 	// const cid = useCarrierStore((state) => state.cid)

// 	const session: any = await getServerSession(context.req, context.res, authOptions);
// 	if (!session)
// 		return {
// 			redirect: {
// 				destination: "/auth/signin",
// 				permanent: false
// 			}
// 		};

// 	return {
// 		redirect: {
// 			// destination: session.user_type !== "candidate" ? "/organization" : `/organization/${cid}`,
// 			destination: session.user_type !== "candidate" ? "/organization" : `/organization/`,
// 			permanent: false
// 		}
// 	};

// 	return {
// 		props: {}
// 	};
// }
