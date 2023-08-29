import { useTheme } from "next-themes";

export default function ThemeChange() {
	const { theme, setTheme } = useTheme();
	return (
		<>
			<button
				aria-label="Toggle Dark Mode"
				type="button"
				className="mr-6 flex items-center rounded text-darkGray dark:text-gray-400"
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
		</>
	);
}
