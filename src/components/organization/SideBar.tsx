import { useState } from "react"
import Image from "next/image";
import Link from "next/link";
import Logo from "../Logo"
import Favicon from '/public/favicon.ico'
import FaviconWhite from '/public/favicon-white.ico'
import { useRouter } from "next/router";
import { useTheme } from "next-themes";
import dashboardIcon from "/public/images/icons/dashboard.png";
import interviewsIcon from "/public/images/icons/interviews.png";
import jobsIcon from "/public/images/icons/jobs.png";
import analyticsIcon from "/public/images/icons/analytics.png";
import inboxesIcon from "/public/images/icons/inboxes.png";
import applicantsIcon from "/public/images/icons/applicants.png";
import settingsIcon from "/public/images/icons/settings.png";
import dashboardIconWhite from "/public/images/icons-white/dashboard.png";
import interviewsIconWhite from "/public/images/icons-white/interviews.png";
import jobsIconWhite from "/public/images/icons-white/jobs.png";
import analyticsIconWhite from "/public/images/icons-white/analytics.png";
import inboxesIconWhite from "/public/images/icons-white/inboxes.png";
import applicantsIconWhite from "/public/images/icons-white/applicants.png";
import settingsIconWhite from "/public/images/icons-white/settings.png";
import upgradeBadge from '/public/images/upgrade-badge.png'

export default function OrgSideBar() {
    const router = useRouter()
    const { theme } = useTheme();
    const [show, setShow] = useState(false);
    function toggleSidebar() {
        document.querySelector('main')?.classList.toggle('sidebarToggled')
        setShow(!show)
    }
    
    const menu = [
        {
            title: 'Dashboard',
            url: '/organization/dashboard',
            img: dashboardIcon,
            imgWhite: dashboardIconWhite
        },
        {
            title: 'Jobs',
            url: '/organization/jobs',
            img: jobsIcon,
            imgWhite: jobsIconWhite
        },
        {
            title: 'Applicants',
            url: '/organization/applicants',
            img: applicantsIcon,
            imgWhite: applicantsIconWhite
        },
        {
            title: 'Interviews',
            url: '/organization/interviews',
            img: interviewsIcon,
            imgWhite: interviewsIconWhite
        },
        {
            title: 'Analytics',
            url: '#',
            img: analyticsIcon,
            imgWhite: analyticsIconWhite
        },
        {
            title: 'Inboxes',
            url: '#',
            img: inboxesIcon,
            imgWhite: inboxesIconWhite
        },
        {
            title: 'Settings',
            url: '/organization/settings',
            img: settingsIcon,
            imgWhite: settingsIconWhite
        }
    ]
    return (
        <>
            <div id="sidebar" className={`bg-white dark:bg-gray-800 shadow w-[270px] h-full fixed z-[13] lg:left-0 top-0 transition` + ' ' + (show ? 'left-[-50px]' : 'left-0')}>
                <div className="h-[65px] flex items-center p-3 relative">
                    <button type="button" className={`bg-white dark:bg-gray-700 shadow rounded-full w-[30px] h-[30px] absolute top-[50%] translate-y-[-50%] right-[-16px]` + ' ' + (show ? 'right-[-31px] rounded-[6px] rounded-tl-[0] rounded-bl-[0]' : <></>)} 
                    onClick={toggleSidebar}>
                        <i className={`fa-solid fa-chevron-left` + ' ' + (show ? 'fa-chevron-right' : <></>)}></i>
                    </button>
                    {
                        show
                        ?
                        <>
                        <Image src={theme === "dark" ? FaviconWhite : Favicon} alt="Somhako" />
                        </>
                        :
                        <>
                            <Logo width="188" />
                        </>
                    }
                </div>
                <div className="p-3 h-[calc(100%-65px)] overflow-y-auto">
                    <ul className={show ? '' : 'border-b pb-4'}>
                        {menu.map((menuItem, i) => (
                            <li className={`my-[12px]` + ' ' + (show ? 'my-[24px]' : '')} key={i}>
                                <Link href={menuItem.url}
                                className={`flex items-center font-semibold rounded-[8px] hover:bg-lightBlue dark:hover:bg-gray-900` + ' ' + (router.pathname == menuItem.url
                                    ? "bg-lightBlue border-r-gradDarkBlue text-primary dark:bg-gray-900 dark:text-white"
                                    : "bg-transparent border-r-transparent") + ' ' + (show ? 'justify-center bg-transparent hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent' : 'py-2 px-4 border-r-[10px]') }>
                                    <span className={`w-[20px] h-[20px] inline-block` + ' ' + (show ? 'text-center' : 'mr-4')}>
                                        <Image src={theme === "dark" ? menuItem.imgWhite : menuItem.img} alt={menuItem.title} height={20} className={show ? 'mx-auto' : ''} />
                                    </span>
                                    {
                                        show
                                        ?
                                        ''
                                        :
                                        menuItem.title
                                    }
                                </Link>
                            </li>
                        ))}
                    </ul>
                    {
                        show
                        ?
                        <></>
                        :
                        <>
                            <div className="py-4">
                                <Image src={upgradeBadge} alt="Upgrade" width={230} />
                            </div>
                        </>
                    }
                </div>
            </div>
        </>
    )
}