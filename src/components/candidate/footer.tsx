import Image from "next/image";
import logo from '/public/images/logo.png'
import Logo from "../Logo";

export default function CandFooter() {
    return (
        <>
        <div className="w-full max-w-[500px] px-4 mx-auto text-center py-10 text-sm text-darkGray dark:text-gray-400">
            <p className="mb-4">Powered by</p>
            <hr />
            <div className="max-w-[140px] bg-lightBlue dark:bg-gray-900 mt-[-10px] mb-4 px-4 mx-auto">
            <Logo width={205} />
            </div>
            <p>&copy; 2023 Somhako, All rights reserved</p>
        </div>
        </>
    )
}