import React, { useState } from "react";

export default function FormField({
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
	const [typePass, setTypePass] = useState(false);
	const errorMessage = error ? <p className="mt-1 text-[12px] text-red-500">{error}</p> : <></>;
	if (fieldType === "input") {
		return (
			<>
				<div className="mb-4 last:mb-0">
					<div>
						<label htmlFor={`field_` + label.replace(/\s+/g, "")} className="mb-1 inline-block font-bold">
							{label}
							{required ? <sup className="text-red-500">*</sup> : ""}
						</label>
						{icon || inputType === "password" ? (
							<>
								<div className="relative">
									{inputType === "password" ? (
										<>
											<input
												type={typePass == true ? "text" : inputType}
												id={id}
												value={value}
												onChange={handleChange}
												className={`w-full rounded border-lightGray dark:bg-gray-700` + " " + (icon ? "pr-9" : "")}
											/>
											<button
												type="button"
												className="absolute right-3 top-2 text-lightGray"
												onClick={() => setTypePass(!typePass)}
											>
												<i className={`fa-regular` + " " + (typePass == true ? "fa-eye-slash" : "fa-eye")}></i>
											</button>
										</>
									) : (
										<>
											<input
												type={inputType}
												id={id}
												value={value}
												onChange={handleChange}
												className={`w-full rounded border-lightGray dark:bg-gray-700` + " " + (icon ? "pr-9" : "")}
											/>
											<span className="absolute right-3 top-2 text-lightGray">{icon}</span>
										</>
									)}
								</div>
							</>
						) : (
							<>
								<input
									type={inputType}
									id={id}
									className="w-full rounded border-lightGray dark:bg-gray-700"
									value={value}
									onChange={handleChange}
								/>
							</>
						)}
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
						<label htmlFor={`field_` + label.replace(/\s+/g, "").toLowerCase()} className="mb-1 inline-block font-bold">
							{label}
							{required ? <sup className="text-red-500">*</sup> : ""}
						</label>
						<textarea
							id={id}
							className="min-h-[100px] w-full resize-none rounded border-lightGray dark:bg-gray-700"
							value={value}
							onChange={handleChange}
						></textarea>
					</div>
					{errorMessage}
				</div>
			</>
		);
	}
	return (
		<>
			<p className="rounded bg-violet-200 p-2 text-sm">
				Please choose some <b>type</b> to show field here.
			</p>
		</>
	);
}
