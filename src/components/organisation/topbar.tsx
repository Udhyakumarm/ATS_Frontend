import ThemeChange from "../ThemeChange"
import { signOut } from "next-auth/react";
import { useEffect } from "react";

export default function orgtopbar() {
    useEffect( () => { 
        document.querySelector('main')?.classList.add('test')
    } );

    return (
        <>
            <div className="bg-white dark:bg-gray-800 h-[65px] py-3 px-6 flex items-center justify-between fixed z-[9] top-0 left-[270px] w-[calc(100%-270px)]">
                <button type="button" className="bg-white dark:bg-gray-700 shadow rounded-full w-[30px] h-[30px]">
                    <i className="fa-solid fa-chevron-left"></i>
                </button>
                <div>
                    <ThemeChange />
                    <button
                        type="button"
                        className="h-[30px] w-[30px] rounded bg-red-500 text-sm text-white hover:bg-red-600"
                        onClick={() => signOut()}
                    >
                        <i className="fa-solid fa-right-from-bracket"></i>
                    </button>
                </div>
            </div>
        </>
    )
}