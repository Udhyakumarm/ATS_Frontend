import { useEffect, useState } from "react";

interface AutoTextareaProps {
	value: string;
	onChange: (value: string) => void;
	extra: string;
	place: string;
	disable: boolean;
}

const AutoTextarea: React.FC<AutoTextareaProps> = ({ value, onChange, extra, place, disable }) => {
	const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		onChange(event.target.value);
	};

	useEffect(() => {
		const textarea = document.getElementById("auto-textarea") as HTMLTextAreaElement;
		textarea.style.height = "auto";
		textarea.style.height = textarea.scrollHeight + "px";
	}, [value]);

	return (
		<textarea
			id="auto-textarea"
			// className={`w-full resize-none rounded-md border` + " " + extra}
			className={
				`w-full resize-none rounded-lg border border-borderColor text-base dark:border-gray-600 dark:bg-gray-700` +
				" " +
				extra
			}
			rows={1}
			style={{
				overflow: "hidden", // Hide vertical scrollbar
				minHeight: "1em", // Set a minimum height for the cursor line
				lineHeight: "1em", // Match line height with cursor height
				maxHeight: "80vh" // Optional: Set a maximum height if needed
			}}
			value={value}
			onChange={handleChange}
			placeholder={place}
			disabled={disable}
		/>
	);
};

export default AutoTextarea;
