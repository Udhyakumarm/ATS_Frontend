import { useTheme } from "next-themes";
import Logo from "@/components/logo";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";

export default function Header() {
	const router = useRouter();
	const { theme, setTheme } = useTheme();

	return (
		<>
			<header className="bg-white shadow-normal dark:bg-gray-800">
				<div className="mx-auto flex w-full max-w-[1920px] items-center justify-between py-3 px-4 md:px-10 lg:px-14">
					<Logo url="/" width={205} />
					<div className="flex items-center">
						<button
							aria-label="Toggle Dark Mode"
							type="button"
							className="mr-2 w-[35px] rounded px-2 py-1 text-black dark:text-white"
							onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
						>
							{theme === "dark" ? (
								<>
									<i className="fa-solid fa-moon"></i>
								</>
							) : (
								<>
									<i className="fa-solid fa-sun"></i>
								</>
							)}
						</button>
						<button
							type="button"
							className="h-[30px] w-[30px] rounded bg-red-500 text-sm text-white hover:bg-red-600"
							onClick={() => signOut()}
						>
							<i className="fa-solid fa-right-from-bracket"></i>
						</button>
					</div>
				</div>
			</header>
		</>
	);
}
