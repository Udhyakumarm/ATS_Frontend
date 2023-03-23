export default function Button({ btnStyle, btnType, label, loader, disabled, full, handleClick }: any) {
	if (btnStyle === "outlined") {
		return (
			<button
				type={btnType ? btnType : "button"}
				className={
					`my-2 min-w-[60px] border border-primary rounded py-1 px-2 text-primary text-[12px] hover:bg-gradDarkBlue hover:text-white hover:border-gradDarkBlue disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-400 dark:border-gray-300 dark:text-gray-300` +
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
					`my-2 min-w-[60px] rounded py-1 px-2 text-white text-[12px] bg-gradient-to-b from-gradLightBlue to-gradDarkBlue hover:from-gradDarkBlue hover:to-gradDarkBlue disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-400` +
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
					`my-2 rounded bg-gradient-to-b from-gradLightBlue to-gradDarkBlue hover:from-gradDarkBlue hover:to-gradDarkBlue py-2 px-6 font-bold text-white disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-400` +
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
