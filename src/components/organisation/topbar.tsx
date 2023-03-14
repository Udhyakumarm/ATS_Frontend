import ThemeChange from "../ThemeChange"
import { signOut } from "next-auth/react";
import { useState, Fragment, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import Image from "next/image";
import Link from "next/link";
import userImg from '/public/images/user-image.png'

export default function orgtopbar() {
    const cancelButtonRef = useRef(null)
    const [isOpen, setIsOpen] = useState(false)
    return (
        <>
            <div id="topbar" className="bg-white dark:bg-gray-800 shadow h-[65px] py-3 px-6 flex items-center justify-end fixed z-[12] top-0 left-0 lg:left-[270px] w-full lg:w-[calc(100%-270px)] transition">
                <ThemeChange />
                <button type="button" className="mr-6 text-darkGray dark:text-white">
                    <i className="fa-regular fa-clipboard text-[20px]"></i>
                </button>
                <button type="button" className="mr-6 text-darkGray dark:text-white" onClick={() => setIsOpen(true)}>
                    <i className="fa-regular fa-calendar-days text-[20px]"></i>
                </button>
                <button type="button" className="mr-6 text-darkGray dark:text-white uppercase relative">
                    <i className="fa-regular fa-bell text-[20px]"></i>
                    <span className="flex items-center justify-center w-[20px] h-[20px] rounded-full bg-primary text-white text-[8px] absolute right-[-10px] top-[-7px]">99+</span>
                </button>
                <button type="button" className="mr-6 text-darkGray dark:text-white font-semibold uppercase">
                    Eng <i className="fa-solid fa-chevron-down text-[12px]"></i>
                </button>
                <button
                    type="button"
                    className="h-[30px] w-[30px] rounded bg-red-500 text-sm text-white hover:bg-red-600"
                    onClick={() => signOut()}
                >
                    <i className="fa-solid fa-right-from-bracket"></i>
                </button>
            </div>
            <Transition.Root show={isOpen} as={Fragment}>
                <Dialog
                as="div"
                className="relative z-40"
                initialFocus={cancelButtonRef}
                onClose={setIsOpen}
                >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <Dialog.Panel className="relative transform overflow-hidden rounded-[30px] bg-[#FBF9FF] dark:bg-gray-800 text-black dark:text-white text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-5xl">
                            <div className="flex">
                                <div className="w-[75%] bg-white">
                                    <div className="flex items-center justify-between px-6 py-4">
                                        <h6 className="font-bold">January 19, 2023</h6>
                                        <aside className="flex items-center">
                                            <button type="button" className="hover:text-gray-600">
                                                <i className="fa-solid fa-circle-chevron-left"></i>
                                            </button>
                                            <button type="button" className="hover:text-gray-600 ml-2">
                                                <i className="fa-solid fa-circle-chevron-right"></i>
                                            </button>
                                        </aside>
                                    </div>
                                    <div className="flex p-3 pb-0 text-sm">
                                        <div className="w-[calc(100%/6)] h-[60px] p-2 flex items-center justify-center">
                                            <p className="font-bold">Sun</p>
                                        </div>
                                        <div className="w-[calc(100%/6)] h-[60px] p-2 flex items-center justify-center">
                                            <p className="font-bold">Mon</p>
                                        </div>
                                        <div className="w-[calc(100%/6)] h-[60px] p-2 flex items-center justify-center">
                                            <p className="font-bold">Tue</p>
                                        </div>
                                        <div className="w-[calc(100%/6)] h-[60px] p-2 flex items-center justify-center">
                                            <p className="font-bold">Wed</p>
                                        </div>
                                        <div className="w-[calc(100%/6)] h-[60px] p-2 flex items-center justify-center">
                                            <p className="font-bold">Thu</p>
                                        </div>
                                        <div className="w-[calc(100%/6)] h-[60px] p-2 flex items-center justify-center">
                                            <p className="font-bold">Fri</p>
                                        </div>
                                        <div className="w-[calc(100%/6)] h-[60px] p-2 flex items-center justify-center">
                                            <p className="font-bold">Sat</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap p-3 pt-0">
                                    {Array(30).fill(
                                        <div className="w-[calc(100%/7)] border border-slate-100 h-[100px] cursor-pointer group">
                                            <div className="font-semibold text-lg w-full h-full flex items-center justify-center rounded-[35px] p-2 group-hover:bg-primary group-hover:text-white">01</div>
                                        </div>
                                    )}
                                    </div>
                                </div>
                                <div className="w-[25%] bg-lightBlue">
                                    <div className="p-4">
                                        <h6 className="font-bold">Events</h6>
                                    </div>
                                    <div className="p-4 pt-0 overflow-y-auto max-h-[580px]">
                                        <div className="rounded-[10px] overflow-hidden mb-4 shadow">
                                            <div className="flex bg-gradient-to-b from-gradLightBlue to-gradDarkBlue text-white p-3">
                                                <div className="w-[50%] pr-2">
                                                    <h5 className="text-sm font-semibold">Software Developer</h5>
                                                </div>
                                                <div className="w-[50%]">
                                                    <p className="text-sm mb-1 font-semibold">ID-573219</p>
                                                    <span className="rounded w-[16px] h-[16px] border border-violet-400 bg-gradient-to-b from-gradLightBlue to-gradDarkBlue text-white flex items-center justify-center text-[8px]">
                                                        <i className="fa-solid fa-phone"></i>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-3 bg-white">
                                                <div className="mb-3">
                                                    {Array(2).fill(
                                                    <div className="flex items-center last:border-b py-3">
                                                        <Image src={userImg} alt="User" width={40} height={40} className="rounded-full h-[40px] object-cover" />
                                                        <div className="pl-3 w-[calc(100%-40px)] text-sm">
                                                            <h6 className="font-semibold">Bethany Jackson</h6>
                                                            <p className="text-darkGray">Interviewer</p>
                                                        </div>
                                                    </div>
                                                    )}
                                                </div>
                                                <h4 className="font-bold mb-1">Platform</h4>
                                                <div className="flex">
                                                    <span className="mt-1 rounded w-[16px] h-[16px] border border-violet-400 bg-gradient-to-b from-gradLightBlue to-gradDarkBlue text-white flex items-center justify-center text-[8px]">
                                                        <i className="fa-solid fa-phone"></i>
                                                    </span>
                                                    <div className="w-[calc(100%-16px)] pl-2 text-darkGray">
                                                        <h6 className="font-semibold">Telephonic</h6>
                                                        <p className="text-sm my-1">20-Jan-2023, 10:00 AM</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="rounded-[10px] overflow-hidden mb-4 shadow">
                                            <div className="flex bg-gradient-to-b from-gradLightBlue to-gradDarkBlue text-white p-3">
                                                <div className="w-[50%] pr-2">
                                                    <h5 className="text-sm font-semibold">Software Developer</h5>
                                                </div>
                                                <div className="w-[50%]">
                                                    <p className="text-sm mb-1 font-semibold">ID-573219</p>
                                                    <span className="rounded w-[16px] h-[16px] border border-violet-400 bg-gradient-to-b from-gradLightBlue to-gradDarkBlue text-white flex items-center justify-center text-[8px]">
                                                        <i className="fa-solid fa-video"></i>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-3 bg-white">
                                                <div className="mb-3">
                                                    {Array(2).fill(
                                                    <div className="flex items-center last:border-b py-3">
                                                        <Image src={userImg} alt="User" width={40} height={40} className="rounded-full h-[40px] object-cover" />
                                                        <div className="pl-3 w-[calc(100%-40px)] text-sm">
                                                            <h6 className="font-semibold">Bethany Jackson</h6>
                                                            <p className="text-darkGray">Interviewer</p>
                                                        </div>
                                                    </div>
                                                    )}
                                                </div>
                                                <h4 className="font-bold mb-1">Platform</h4>
                                                <div className="flex">
                                                    <span className="mt-1 rounded w-[16px] h-[16px] border border-violet-400 bg-gradient-to-b from-gradLightBlue to-gradDarkBlue text-white flex items-center justify-center text-[8px]">
                                                        <i className="fa-solid fa-video"></i>
                                                    </span>
                                                    <div className="w-[calc(100%-16px)] pl-2 text-darkGray">
                                                        <h6 className="font-semibold">Google Meet</h6>
                                                        <p className="text-sm my-1">20-Jan-2023, 10:00 AM</p>
                                                        <Link href="https://meet.google.com/ytk-jphs-dug" target="_blank" className="text-primary text-[12px] leading-normal inline-block text-white py-[3px] px-3 rounded bg-gradient-to-b from-gradLightBlue to-gradDarkBlue">
                                                            Meet
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                    </div>
                </div>
                </Dialog>
            </Transition.Root>
        </>
    )
}