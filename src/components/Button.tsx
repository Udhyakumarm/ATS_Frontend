export default function Button({ btnStyle, btnType, label, loader, disabled, full, handleClick, iconLeft }: any) {
	if (btnStyle === "outlined") {
		return (
			<button
				type={btnType ? btnType : "button"}
				className={
					`my-2 min-w-[60px] border border-primary rounded py-1 px-2 text-primary text-[12px] hover:bg-gradDarkBlue hover:text-white hover:border-gradDarkBlue dark:border-gray-300 dark:text-gray-300 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-400` +
					" " +
					(full ? "w-full" : "w-auto")
				}
				disabled={disabled}
				onClick={btnType && handleClick}
			>
				{label}
				{loader ? <i className="fa-solid fa-spinner fa-spin-pulse mx-2"></i> : ""}
			</button>
		)
	}
	if (btnStyle === "sm") {
		return (
			<button
				type={btnType ? btnType : "button"}
				className={
					`my-2 min-w-[60px] rounded py-1 px-2 text-white text-[12px] bg-gradient-to-b from-gradLightBlue to-gradDarkBlue hover:from-gradDarkBlue hover:to-gradDarkBlue disabled:cursor-not-allowed disabled:text-gray-500 disabled:bg-slate-200` +
					" " +
					(full ? "w-full" : "w-auto")
				}
				disabled={disabled}
				onClick={btnType && handleClick}
			>
				{label}
				{loader ? <i className="fa-solid fa-spinner fa-spin-pulse mx-2"></i> : ""}
			</button>
		)
	}
	if (btnStyle === "iconLeftBtn") {
		return (
			<button
				type={btnType ? btnType : "button"}
				className={
					`my-2 rounded bg-gradient-to-b from-gradLightBlue to-gradDarkBlue hover:from-gradDarkBlue hover:to-gradDarkBlue py-2 px-3 font-semibold text-white text-sm disabled:cursor-not-allowed disabled:text-gray-500 disabled:bg-slate-200` +
					" " +
					(full ? "w-full" : "w-auto")
				}
				disabled={disabled}
				onClick={btnType && handleClick}
			>
				<span className="mr-2">
					{iconLeft}
				</span>
				{label}
			</button>
		)
	}
	if (btnStyle === "success") {
		return (
			<button
				type={btnType ? btnType : "button"}
				className={
					`my-2 rounded text-green-600 bg-green-200 hover:bg-green-600 hover:text-white py-2 px-6 font-bold disabled:cursor-not-allowed disabled:text-gray-500 disabled:bg-slate-200` +
					" " +
					(full ? "w-full" : "w-auto")
				}
				disabled={disabled}
				onClick={btnType && handleClick}
			>
				{label}
				{loader ? <i className="fa-solid fa-spinner fa-spin-pulse mx-2"></i> : ""}
			</button>
		)
	}
	if (btnStyle === "danger") {
		return (
			<button
				type={btnType ? btnType : "button"}
				className={
					`my-2 rounded text-red-600 bg-red-200 hover:bg-red-600 hover:text-white py-2 px-6 font-bold disabled:cursor-not-allowed disabled:text-gray-500 disabled:bg-slate-200` +
					" " +
					(full ? "w-full" : "w-auto")
				}
				disabled={disabled}
				onClick={btnType && handleClick}
			>
				{label}
				{loader ? <i className="fa-solid fa-spinner fa-spin-pulse mx-2"></i> : ""}
			</button>
		)
	}
	return (
		<>
			<button
				type={btnType ? btnType : "button"}
				className={
					`my-2 rounded bg-gradient-to-b from-gradLightBlue to-gradDarkBlue hover:from-gradDarkBlue hover:to-gradDarkBlue py-2 px-6 font-bold text-white disabled:cursor-not-allowed disabled:text-gray-500 disabled:bg-slate-200` +
					" " +
					(full ? "w-full" : "w-auto")
				}
				disabled={disabled}
				onClick={btnType && handleClick}
			>
				{label}
				{loader ? <i className="fa-solid fa-spinner fa-spin-pulse mx-2"></i> : ""}
			</button>
		</>
	);
}
