import { useCarrierStore, useUserStore } from "@/utils/code";
import ThemeChange from "../ThemeChange";
import { signOut } from "next-auth/react";

export default function VendorTopBar() {
	const settype = useUserStore((state: { settype: any }) => state.settype);
	const setrole = useUserStore((state: { setrole: any }) => state.setrole);
	const setuser = useUserStore((state: { setuser: any }) => state.setuser);
	const vid = useCarrierStore((state: { vid: any }) => state.vid);
	const type = useUserStore((state: { type: any }) => state.type);
	const role = useUserStore((state: { role: any }) => state.role);
	const user = useUserStore((state: { user: any }) => state.user);
	return (
		<>
			<div
				id="topbar"
				className="fixed left-0 top-0 z-[12] flex h-[65px] w-full items-center justify-end bg-white px-6 py-3 shadow transition dark:bg-gray-800 lg:left-[270px] lg:w-[calc(100%-270px)]"
			>
				<p className="bg-blue-500 p-1 text-white">
					{type}&nbsp;{role}
				</p>
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
