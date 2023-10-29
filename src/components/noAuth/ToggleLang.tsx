import { Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useLangStore } from "@/utils/code";

const languages = [
	{ name: "en", locale: "en" },
	{ name: "ja", locale: "ja" }
];

{
	/* <div className="fixed right-0 top-24 z-[100]"> */
}

export default function ToggleLang() {
	const [selectedLanguages, setLanguages] = useState(languages[0]);
	const router = useRouter();

	const lang = useLangStore((state: { lang: any }) => state.lang);

	const setlang = useLangStore((state: { setlang: any }) => state.setlang);

	useEffect(() => {
		setlang(router.locale);
	}, [router]);

	const [hydrated, setHydrated] = useState(false);
	useEffect(() => {
		setHydrated(true);
	}, [setHydrated]);
	if (!hydrated) {
		return null;
	}

	return (
		<div className="fixed -right-5 top-24 z-[100] transition delay-500 duration-100 ease-in hover:right-0">
			<div className="group relative inline-block">
				<Listbox value={selectedLanguages} onChange={setLanguages}>
					<div className="relative">
						{/* <Listbox.Button className="flex w-full items-center justify-center gap-4  rounded-l-lg border-2 border-red-500 bg-white py-2 pl-3 pr-3 text-left text-sm text-black shadow-normal transition focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 group-hover:pr-6 sm:text-sm"> */}
						<Listbox.Button className="flex w-full items-center justify-center  gap-2 rounded-l-lg border-l-2 border-t-2 border-black/50 bg-white px-1 py-2 pl-4 text-sm text-black shadow-normal transition">
							<span className="uppercase">{lang}</span>
							<i className="fa-solid fa-globe text-base"></i>
						</Listbox.Button>
						<Transition
							as={Fragment}
							leave="transition ease-in duration-100"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<Listbox.Options className="absolute right-0 top-[100%] z-[20] mt-1 max-h-60 w-[150px] overflow-auto rounded-l-lg border-l-2 border-t-2 border-black/50 bg-white py-1 drop-shadow-xl">
								{languages.map((item, itemIdx) => (
									<Listbox.Option
										className={({ active }) =>
											`relative block cursor-pointer select-none py-2 pl-10 pr-4 text-left  hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-700 hover:text-white  ${
												active ? " text-black" : "text-black"
											}`
										}
										value={item}
										key={itemIdx}
										as={Link}
										href={router.asPath}
										locale={item.locale}
									>
										<span className={`block truncate uppercase ${lang === item.name ? "font-medium" : "font-normal"}`}>
											{item.name}
										</span>
										{lang === item.name ? (
											<span className={`absolute inset-y-0 left-0 flex items-center pl-3 `}>
												<i className="fa-solid fa-check"></i>
											</span>
										) : null}
									</Listbox.Option>
								))}
							</Listbox.Options>
						</Transition>
					</div>
				</Listbox>
			</div>
		</div>
	);
}
