import React from "react";

interface ButtonProps {
	btnStyle?:
		| "primary"
		| "secondary"
		| "outlined"
		| "ghost"
		| "sm"
		| "iconLeftBtn"
		| "iconRightBtn"
		| "success"
		| "danger"
		| "gray"
		| "link";
	btnType?: "button" | "submit" | "reset" | "link";
	label: string;
	loader?: boolean;
	disabled?: boolean;
	full?: boolean;
	handleClick?: () => void;
	iconLeft?: React.ReactNode;
	iconRight?: React.ReactNode;
	small?: boolean;
	transitionClass?: string;
}

const Button2: React.FC<ButtonProps> = ({
	btnStyle = "primary",
	btnType,
	label,
	loader,
	disabled,
	full,
	handleClick,
	iconLeft,
	iconRight,
	small,
	transitionClass
}) => {
	const baseStyles =
		"leading-pro ease-soft-in tracking-tight-soft shadow-soft-md active:opacity-85 font-base my-2  inline-block cursor-pointer rounded-md text-sm  transition-all duration-300 font-semibold  ";

	const primaryStyles =
		"bg-gradient-to-tr from-blue-700 to-sky-400 text-white hover:from-sky-600 hover:to-blue-500 disabled:from-slate-200 disabled:to-slate-200 disabled:text-gray-400 px-3 py-2";

	const secondaryStyles =
		"text-white bg-gradient-to-bl from-gradLightBlue to-gradDarkBlue hover:from-gradDarkBlue hover:to-gradDarkBlue hover:text-white disabled:text-gray-400 disabled:bg-slate-200 disabled:border-slate-200 px-3 py-2";

	const outlinedStyles =
		"text-gradDarkBlue border-2 border-gradDarkBlue hover:bg-gradient-to-tr from-blue-800 to-sky-400 hover:text-white dark:text-white disabled:text-gray-400 disabled:bg-slate-200 disabled:border-slate-200 px-3 py-2";

	const ghostStyles =
		"text-gradDarkBlue hover:bg-gradient-to-tr from-blue-800 to-sky-400 hover:text-white dark:text-white  disabled:text-gray-400 disabled:bg-slate-200 px-3 py-2";

	const linkStyles =
		"text-gradDarkBlue font-semibold hover:underline hover:text-gradDarkBlue dark:text-white disabled:text-gray-400 px-3 py-2";

	const smStyles = "text-xs py-1 px-2";

	const iconBtnStyles =
		"bg-gradient-to-tr from-blue-800 to-sky-400 text-white hover:from-sky-700 hover:to-blue-400 my-2  rounded-md py-2 px-3 font-semibold text-white text-sm disabled:from-slate-200 disabled:to-slate-200 ";

	const successStyles =
		"text-green-600 bg-green-200 hover:bg-gradient-to-tr from-green-800 to-emerald-400 hover:text-white py-2 px-3 font-semibold text-sm disabled:text-gray-500 disabled:bg-slate-200";

	const dangerStyles =
		"text-red-600 bg-red-200 hover:bg-gradient-to-tl from-red-800 to-rose-400 hover:text-white py-2 px-3 font-semibold text-sm disabled:text-gray-500 disabled:bg-slate-200";

	const grayStyles =
		"bg-gradient-to-tr from-gray-800 to-gray-400 text-white hover:bg-gray-800 hover:text-slate-300 py-2 px-3 font-semibold text-sm disabled:text-gray-500 disabled:bg-slate-200";

	const getButtonStyles = () => {
		switch (btnStyle) {
			case "primary":
				return `${baseStyles} ${primaryStyles} ${full ? "w-full" : "w-auto"} ${small ? smStyles : ""}`; // Apply small button styles if small prop is true
			case "secondary":
				return `${baseStyles} ${secondaryStyles} ${full ? "w-full" : "w-auto"} ${small ? smStyles : ""}`;
			case "outlined":
				return `${baseStyles} ${outlinedStyles} ${full ? "w-full" : "w-auto"} ${small ? smStyles : ""}`;
			case "ghost":
				return `${baseStyles} ${ghostStyles} ${full ? "w-full" : "w-auto"} ${small ? smStyles : ""}`;
			case "link":
				return `${baseStyles} ${linkStyles}`;
			// case "sm":
			// 	return `${baseStyles} ${smStyles} ${full ? "w-full" : "w-auto"}`;
			case "iconLeftBtn":
				return `${iconBtnStyles} ${full ? "w-full" : "w-auto"} ${small ? smStyles : ""}`;
			case "iconRightBtn":
				return `${iconBtnStyles} ${full ? "w-full" : "w-auto"} ${small ? smStyles : ""}`;
			case "success":
				return `${baseStyles} ${successStyles} ${full ? "w-full" : "w-auto"} ${small ? smStyles : ""}`;
			case "danger":
				return `${baseStyles} ${dangerStyles} ${full ? "w-full" : "w-auto"} ${small ? smStyles : ""}`;
			case "gray":
				return `${baseStyles} ${grayStyles} ${full ? "w-full" : "w-auto"} ${small ? smStyles : ""}`;
			default:
				return `${baseStyles} ${primaryStyles} ${full ? "w-full" : "w-auto"} ${small ? smStyles : ""}`;
		}
	};

	const buttonStyles = getButtonStyles();

	const renderButton = () => {
		if (btnType === "link") {
			return (
				<a href="#" className={buttonStyles} onClick={handleClick} style={{ textDecoration: "none" }}>
					{iconLeft && <span className="mr-2">{iconLeft}</span>}
					{label}
					{iconRight && <span className="ml-2">{iconRight}</span>}
					{loader && <i className="fa-solid fa-spinner fa-spin-pulse mx-2"></i>}
				</a>
			);
		}

		return (
			<button type={btnType || "button"} className={`${buttonStyles} ${transitionClass}`} disabled={disabled} onClick={handleClick}>
				{iconLeft && <span className="mr-2">{iconLeft}</span>}
				{label}
				{iconRight && <span className="ml-2">{iconRight}</span>}
				{loader && <i className="fa-solid fa-spinner fa-spin-pulse py-auto mx-2 my-auto h-full"></i>}
			</button>
		);
	};

	return renderButton();
};

export default Button2;
