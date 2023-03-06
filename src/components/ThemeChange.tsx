import { useTheme } from "next-themes";

export default function themeChange() {
    const { theme, setTheme } = useTheme();
    return (
        <>
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
        </>
    )
}