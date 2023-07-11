import Image from "next/image";
import logo from '/public/images/logo.png'

export default function CandFooter() {
    return (
        <>
        <div className="w-full max-w-[500px] px-4 mx-auto text-center py-10 text-sm text-darkGray dark:text-gray-400">
            <p className="mb-4">Powered by</p>
            <hr />
            <Image src={logo} alt="Somhako" width={300} height={75} className="max-w-[140px] bg-lightBlue mt-[-10px] mb-4 px-4 mx-auto" />
            <p>&copy; 2023 Somhako, All rights reserved</p>
        </div>
        </>
    )
}