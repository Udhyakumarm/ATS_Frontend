import { useTheme } from "next-themes";
import Logo from '@/components/logo'
import { useRouter } from "next/router";

export default function Header() {
    const router = useRouter();    
    const { theme, setTheme } = useTheme();

    if (router.asPath === '/') {
        return (
            <>
            <header className="bg-white dark:bg-gray-800 shadow-normal">
                <div className="py-3 lg:px-14 md:px-10 px-4 w-full max-w-[1920px] mx-auto flex items-center justify-between">
                    <Logo url="/" width={205} />
                    <div className="flex items-center">
                        <button
                            aria-label="Toggle Dark Mode"
                            type="button"
                            className="w-[35px] text-black dark:text-white px-2 py-1 rounded mr-2"
                            onClick={() =>
                                setTheme(theme === "dark" ? "light" : "dark")
                            }
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
                        <button type="button" className="rounded w-[30px] h-[30px] text-sm text-white bg-red-500 hover:bg-red-600">
                            <i className="fa-solid fa-right-from-bracket"></i>
                        </button>
                    </div>
                </div>
            </header>
            </>
        )
    }
    return (
        <>
            
        </>
    )
}