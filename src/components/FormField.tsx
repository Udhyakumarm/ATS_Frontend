import Multiselect from "multiselect-react-dropdown";
import React, { useState } from "react";

export default function FormField({
	label,
	required,
	readOnly,
	icon,
	inputType,
	fieldType,
	handleChange,
	error,
	value,
	options,
	singleSelect,
	id,
	placeholder,
	clickevent,
	disabled
}: {
	label?: string;
	required?: boolean;
	readOnly?: boolean;
	icon?: any;
	inputType?: string;
	fieldType?: "input" | "textarea" | "select" | "addItem";
	handleChange?: any;
	error?: any;
	value?: any;
	options?: Array<any>;
	singleSelect?: boolean;
	id?: string;
	placeholder?: string;
	clickevent?: any;
	disabled?: boolean;
}) {
	const [typePass, setTypePass] = useState(false);
	const errorMessage = error ? <p className="mt-1 text-[12px] text-red-500">{error}</p> : <></>;
	if (fieldType === "input") {
		return (
			<>
				<div className="mb-4 last:mb-0">
					<div>
						{label ? (
							<label htmlFor={`field_` + label.replace(/\s+/g, "")} className="mb-1 inline-block font-bold">
								{label}
								{required ? <sup className="text-red-500">*</sup> : ""}
							</label>
						) : (
							<></>
						)}
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
												placeholder={placeholder}
												readOnly={readOnly}
												className={
													`min-h-[45px] w-full rounded-normal border-borderColor text-sm dark:bg-gray-700` +
													" " +
													(icon ? "pr-9" : "")
												}
											/>
											<button
												type="button"
												className="absolute right-3 top-[10px] text-lightGray"
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
												placeholder={placeholder}
												readOnly={readOnly}
												className={
													`min-h-[45px] w-full rounded-normal border-borderColor text-sm dark:bg-gray-700` +
													" " +
													(icon ? "pr-9" : "")
												}
											/>
											<span className="absolute right-3 top-[10px] text-lightGray">{icon}</span>
										</>
									)}
								</div>
							</>
						) : (
							<>
								<input
									type={inputType}
									id={id}
									className={`min-h-[45px] w-full rounded-normal border-borderColor text-sm dark:bg-gray-700` + " "}
									value={value}
									onChange={handleChange}
									placeholder={placeholder}
									readOnly={readOnly}
									disabled={disabled}
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
						{label ? (
							<label
								htmlFor={`field_` + label.replace(/\s+/g, "").toLowerCase()}
								className="mb-1 inline-block font-bold"
							>
								{label}
								{required ? <sup className="text-red-500">*</sup> : ""}
							</label>
						) : (
							<></>
						)}
						<textarea
							id={id}
							className={
								`min-h-[120px] min-h-[45px] w-full resize-none rounded-normal border-borderColor text-sm dark:bg-gray-700` +
								" "
							}
							value={value}
							onChange={handleChange}
							placeholder={placeholder}
						></textarea>
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
						{label ? (
							<label
								htmlFor={`field_` + label.replace(/\s+/g, "").toLowerCase()}
								className="mb-1 inline-block font-bold"
							>
								{label}
								{required ? <sup className="text-red-500">*</sup> : ""}
							</label>
						) : (
							<></>
						)}
						<Multiselect
							options={options} // Options to display in the dropdown
							selectedValues={value} // Preselected value to persist in dropdown
							singleSelect={singleSelect}
							closeOnSelect
							showArrow={true}
							placeholder={placeholder}
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
	if (fieldType === "addItem") {
		return (
			<>
				<div className="mb-4 last:mb-0">
					<div>
						{label ? (
							<label htmlFor={`field_` + label.replace(/\s+/g, "")} className="mb-1 inline-block font-bold">
								{label}
								{required ? <sup className="text-red-500">*</sup> : ""}
							</label>
						) : (
							<></>
						)}
						<div className="relative">
							<input
								type={inputType}
								id={id}
								value={value}
								onChange={handleChange}
								placeholder={placeholder}
								readOnly={readOnly}
								className={
									`min-h-[45px] w-full rounded-normal border-borderColor text-sm dark:bg-gray-700` +
									" " +
									(icon ? "pr-9" : "")
								}
							/>
							<button
								type="button"
								className="absolute right-0 top-0 h-full w-[30px] rounded-r-[12px] bg-gradDarkBlue text-white"
								onClick={clickevent}
							>
								{icon}
							</button>
						</div>
					</div>
				</div>
				{errorMessage}
			</>
		);
	}
	return (
		<>
			<p className="rounded-normal bg-violet-200 p-2 text-sm">
				Please choose some <b>type</b> to show field here.
			</p>
		</>
	);
}
