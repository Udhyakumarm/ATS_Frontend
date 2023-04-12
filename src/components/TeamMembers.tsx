import { Menu, Transition } from "@headlessui/react";
import Image from "next/image";
import { Fragment } from "react";
import userImg from "/public/images/user-image.png";

export default function TeamMembers(props) {
    return (
        <>
            <div className="flex items-center">
                <div className="-mr-4">
                    <Image src={userImg} alt="User" width={35} className="h-[35px] rounded-full object-cover" />
                </div>
                <div className="-mr-4">
                    <Image src={userImg} alt="User" width={35} className="h-[35px] rounded-full object-cover" />
                </div>
                <Menu as="div" className="relative flex">
                    <Menu.Button className={"relative"}>
                        <Image src={userImg} alt="User" width={35} className="h-[35px] rounded-full object-cover" />
                        <span className="absolute left-0 top-0 block flex h-full w-full items-center justify-center rounded-full bg-[rgba(0,0,0,0.5)] text-sm text-white">
                            +{props.alen ? props.alen : 0}
                        </span>
                    </Menu.Button>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items
                            className={
                                "absolute right-0 top-[100%] z-20 mt-2 max-h-[400px] w-[250px] overflow-y-auto rounded-normal bg-white dark:bg-gray-700 py-2 shadow-normal"
                            }
                        >
                            <Menu.Item>
                                <div className="p-3">
                                    <h6 className="border-b pb-2 font-bold">Team Members</h6>
                                    <div>
                                        {Array(5).fill(
                                            <div className="mt-4 flex items-center">
                                                <Image
                                                    src={userImg}
                                                    alt="User"
                                                    width={40}
                                                    className="h-[40px] rounded-full object-cover"
                                                />
                                                <aside className="pl-4 text-sm">
                                                    <h5 className="font-bold">Anne Jacob</h5>
                                                    <p className="text-darkGray dark:text-gray-400">Hiring Manager</p>
                                                </aside>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Menu.Item>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
        </>
    )
}