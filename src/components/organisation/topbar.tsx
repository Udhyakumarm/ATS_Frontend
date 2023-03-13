import ThemeChange from "../ThemeChange"
import { signOut } from "next-auth/react";
import { useState } from 'react'
import { Dialog } from '@headlessui/react'

export default function orgtopbar() {
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
            <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
                <Dialog.Panel>
                    <Dialog.Title>Deactivate account</Dialog.Title>
                    <Dialog.Description>
                    This will permanently deactivate your account
                    </Dialog.Description>

                    <p>
                    Are you sure you want to deactivate your account? All of your data
                    will be permanently removed. This action cannot be undone.
                    </p>

                    <button onClick={() => setIsOpen(false)}>Deactivate</button>
                    <button onClick={() => setIsOpen(false)}>Cancel</button>
                </Dialog.Panel>
            </Dialog>
        </>
    )
}