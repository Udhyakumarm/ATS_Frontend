import { useState } from "react"
import Image from "next/image";
import Logo from "../logo"
import Favicon from '/public/favicon.ico'

export default function orgsidebar() {
    const [show, setShow] = useState(false);
    function toggleSidebar() {
        document.querySelector('main')?.classList.toggle('sidebarToggled')
        setShow(!show)
    }
    return (
        <>
            <div id="sidebar" className={`bg-white dark:bg-gray-800 shadow w-[270px] h-full fixed z-[10] lg:left-0 top-0 transition` + ' ' + (show ? 'left-[-50px]' : 'left-0')}>
                <div className="h-[65px] flex items-center p-3 relative">
                    <button type="button" className={`bg-white dark:bg-gray-700 shadow rounded-full w-[30px] h-[30px] absolute top-[50%] translate-y-[-50%] right-[-16px]` + ' ' + (show ? 'right-[-31px] rounded-[6px] rounded-tl-[0] rounded-bl-[0]' : <></>)} 
                    onClick={toggleSidebar}>
                        <i className={`fa-solid fa-chevron-left` + ' ' + (show ? 'fa-chevron-right' : <></>)}></i>
                    </button>
                    {
                        show
                        ?
                        <>
                        <Image src={Favicon} alt="Somhako" />
                        </>
                        :
                        <>
                            <Logo width="188" />
                        </>
                    }
                </div>
                <div className="p-3 overflow-y-auto">
List
                </div>
            </div>
        </>
    )
}