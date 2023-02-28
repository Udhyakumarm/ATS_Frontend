import React, { useState } from "react";
// Require Editor CSS files.
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), {
	ssr: false
});
// import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function JobFormField({
	label,
	required,
	icon,
	inputType,
	fieldType,
	handleChange,
	error,
	value,
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
						;
					</div>
					{errorMessage}
				</div>
			</>
		);
	}
	if (fieldType === "select") {
	}
	return (
		<>
			<p className="rounded-xl bg-violet-200 p-2 text-sm">
				Please choose some <b>type</b> to show field here.
			</p>
		</>
	);
}
