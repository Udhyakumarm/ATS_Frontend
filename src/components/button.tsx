export default function Button({ btnType, label, loader, disabled, full }: any) {
	return (
		<>
			<button
				type={btnType ? btnType : "button"}
				className={
					`my-2 rounded bg-gradient-to-b from-[#9290FC] to-[#6A67EA] py-2 px-4 font-bold text-white hover:from-[#6A67EA] hover:to-[#6A67EA] disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-400` +
					" " +
					(full ? "w-full" : "w-auto")
				}
				disabled={disabled}
			>
				{label}
				{loader ? <i className="fa-solid fa-spinner fa-spin-pulse ml-2"></i> : ""}
			</button>
		</>
	);
}
