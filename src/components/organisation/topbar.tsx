import ThemeChange from "../ThemeChange"
import { signOut } from "next-auth/react";

export default function orgtopbar() {
    return (
        <>
            <div id="topbar" className="bg-white dark:bg-gray-800 h-[65px] py-3 px-6 flex items-center justify-end fixed z-[9] top-0 left-0 lg:left-[270px] w-full lg:w-[calc(100%-270px)] transition">
                <ThemeChange />
                <button
                    type="button"
                    className="h-[30px] w-[30px] rounded bg-red-500 text-sm text-white hover:bg-red-600"
                    onClick={() => signOut()}
                >
                    <i className="fa-solid fa-right-from-bracket"></i>
                </button>
            </div>
        </>
    )
}