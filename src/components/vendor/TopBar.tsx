import { useCarrierStore, useUserStore } from "@/utils/code";
import ThemeChange from "../ThemeChange";
import { signOut } from "next-auth/react";

export default function VendorTopBar() {
	const settype = useUserStore((state: { settype: any }) => state.settype);
	const setrole = useUserStore((state: { setrole: any }) => state.setrole);
	const setuser = useUserStore((state: { setuser: any }) => state.setuser);
	const vid = useCarrierStore((state: { vid: any }) => state.vid);
	return (
		<>
			<div
				id="topbar"
				className="fixed top-0 left-0 z-[12] flex h-[65px] w-full items-center justify-end bg-white py-3 px-6 shadow transition dark:bg-gray-800 lg:left-[270px] lg:w-[calc(100%-270px)]"
			>
				<ThemeChange />
				<button type="button" className="relative mr-6 uppercase text-darkGray dark:text-gray-400">
					<i className="fa-regular fa-bell text-[20px]"></i>
					<span className="absolute right-[-10px] top-[-7px] flex h-[20px] w-[20px] items-center justify-center rounded-full bg-primary text-[8px] text-white">
						99+
					</span>
				</button>
				<button type="button" className="mr-6 font-semibold uppercase text-darkGray dark:text-gray-400">
					Eng <i className="fa-solid fa-chevron-down text-[12px]"></i>
				</button>
				<button
					type="button"
					className="h-[30px] w-[30px] rounded bg-red-500 text-sm text-white hover:bg-red-600"
					onClick={() => {
						signOut({ callbackUrl: `/vendor/${vid}/signin` });

						settype("");
						setrole("");
						setuser([]);
					}}
				>
					<i className="fa-solid fa-right-from-bracket"></i>
				</button>
			</div>
		</>
	);
}
