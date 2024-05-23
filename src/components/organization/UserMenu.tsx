import React, { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";

interface UserMenuProps {
	version: string;
	role: string;
	type: string;
}

const UserMenu: React.FC<UserMenuProps> = ({ version, role, type }) => {
	return (
		<Menu as="div" className="relative mr-3 inline-block text-left">
			<Menu.Button className="inline-flex items-center justify-center rounded-full bg-white dark:bg-inherit px-2 py-1 text-xl font-medium text-gray-500 hover:text-gray-800  dark:hover:text-slate-200">
				<i className="fas fa-user-circle mr-2 h-5 w-5" aria-hidden="true"></i>
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
				<Menu.Items className="absolute right-0 z-10 mt-2 w-auto origin-top-right rounded-md bg-white shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
					<div className="py-1  ">
						<Menu.Item>
							<div className="flex justify-start px-4 py-2 text-sm text-gray-700 transition-colors duration-200 hover:bg-gray-100">
								<span className="font-extrabold  ">Version:</span>
								<span className=" px-2 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent font-extrabold capitalize">{version}</span>
							</div>
						</Menu.Item>
						<Menu.Item>
							<div className="flex justify-start px-4 py-2 text-sm text-gray-700 transition-colors duration-200 hover:bg-gray-100 ">
								<span className="font-extrabold">Role:</span>
								<span className="px-3 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent font-extrabold whitespace-nowrap capitalize">{role}</span>
							</div>
						</Menu.Item>
						<Menu.Item>
							<div className="flex justify-start px-4 py-2 text-sm text-gray-700 transition-colors duration-200 hover:bg-gray-100">
								<span className="font-extrabold">Type:</span>
								<span className="px-2 bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent font-extrabold capitalize">{type}</span>
							</div>
						</Menu.Item>
					</div>
				</Menu.Items>
			</Transition>
		</Menu>
	);
};

export default UserMenu;
