import React, { useState } from "react";
// Require Editor CSS files.
import dynamic from "next/dynamic";
import Multiselect from "multiselect-react-dropdown";

const ReactQuill = dynamic(() => import("react-quill"), {
	ssr: false
});
// import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function JobFormField({
	label,
	required,
	icon,
	options,
	inputType,
	fieldType,
	handleChange,
	error,
	value,
	singleSelect,
	id
}: any) {
	const errorMessage = error ? <p className="mt-1 text-[12px] text-red-500">{error}</p> : <></>;
	if (fieldType === "input") {
		return (
			<>
				<div className="mb-4 last:mb-0">
					<div>
						<label htmlFor={id} className="mb-1 inline-block font-light text-gray-700">
							{label}
							{required ? <sup className="text-red-500">*</sup> : ""}
						</label>

						<input
							type={inputType}
							id={id}
							className="w-full rounded-xl border-lightGray font-light shadow-sm shadow-slate-300 dark:bg-gray-700"
							value={value}
							onChange={handleChange}
						/>
					</div>
					{errorMessage}
				</div>
			</>
		);
	}
	if (fieldType === "textarea") {
		return (
			<>
				<div className="mb-4 last:mb-0">
					<div>
						<label htmlFor={id} className="mb-1 inline-block font-light text-gray-700">
							{label}
							{required ? <sup className="text-red-500">*</sup> : ""}
						</label>
						<ReactQuill
							defaultValue={"\n\n\n\n\n"}
							value={value}
							onChange={(value: string) => handleChange({ target: { id, value } })}
						/>
					</div>
					{errorMessage}
				</div>
			</>
		);
	}
	if (fieldType === "select") {
		return (
			<>
				<div className="mb-4 last:mb-0">
					<div>
						<label htmlFor={id} className="mb-1 inline-block font-light text-gray-700">
							{label}
							{required ? <sup className="text-red-500">*</sup> : ""}
						</label>

						<Multiselect
							options={options} // Options to display in the dropdown
							selectedValues={value} // Preselected value to persist in dropdown
							singleSelect={singleSelect}
							onSelect={(selected) =>
								singleSelect
									? handleChange({ target: { id, value: selected } })
									: handleChange({ target: { id, value: selected } })
							} // Function will trigger on select event
							onRemove={(selected) => handleChange({ target: { id, value: selected } })} // Function will trigger on remove event
							displayValue="name" // Property name to display in the dropdown options
						/>
					</div>
					{errorMessage}
				</div>
			</>
		);
	}
	return (
		<>
			<p className="rounded-xl bg-violet-200 p-2 text-sm">
				Please choose some <b>type</b> to show field here.
			</p>
		</>
	);
}
