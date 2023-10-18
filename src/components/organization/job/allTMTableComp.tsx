import { useEffect, useState } from "react";
import { Switch } from "@headlessui/react";

export default function AllTMTableComp({
	data,
	changeSwith,
	jtm,
	ujtm,
	setujtm,
	setjtm,
	setjcollaborator,
	setjrecruiter
}: any) {
	const [enabled, setEnabled] = useState(false);

	return (
		<>
			<td className="border-b px-3 py-2 text-sm">{data["name"]}</td>
			<td className="border-b px-3 py-2 text-sm">{data["dept"]}</td>
			<td className="border-b px-3 py-2 text-sm">{data["email"]}</td>
			<td className="border-b px-3 py-2 text-sm">{data["role"]}</td>
			<td className="border-b px-3 py-2 text-right">
				{/* <input
													type="checkbox"
													value={data["email"]}
													data-id={data["role"]}
													data-pk={data["id"]}
													onChange={(e) => onChnageCheck(e)}
													checked={ujtm.includes(data["id"])}
												/> */}
				<Switch
					checked={ujtm.includes(data["id"])}
					onChange={(value: Boolean) => changeSwith(value, data)}
					className={`${ujtm.includes(data["id"]) ? "bg-primary" : "bg-gray-700"}
          relative inline-flex h-[18px] w-[34px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
				>
					<span className="sr-only">Use setting</span>
					<span
						aria-hidden="true"
						className={`${ujtm.includes(data["id"]) ? "translate-x-4" : "translate-x-0"}
            pointer-events-none inline-block h-[14px] w-[14px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
					/>
				</Switch>
			</td>
		</>
	);
}
