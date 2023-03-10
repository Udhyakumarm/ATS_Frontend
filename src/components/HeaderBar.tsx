export default function HeaderBar({ icon, title, handleBack }: any) {
	return (
		<div className="bg-lightBlue py-1 px-8">
			<div className="mx-auto w-full max-w-[1100px]">
				<div className="flex flex-wrap items-center justify-start py-2 ">
					<button onClick={handleBack} className="justify-self-start text-darkGray">
						<i className="fa-solid fa-arrow-left text-2xl"></i>
					</button>
					<div className="ml-20 text-2xl font-normal ">
						<span>{title}</span>
					</div>
				</div>
			</div>
		</div>
	);
}
