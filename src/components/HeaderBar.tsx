export default function HeaderBar({ title, handleBack }: any) {
	return (
		<div className="bg-lightBlue dark:bg-gray-600 py-1 px-8">
			<div className="mx-auto w-full max-w-[1100px]">
				<div className="flex flex-wrap items-center justify-start py-2">
					<button onClick={handleBack} className="justify-self-start text-darkGray dark:text-gray-400 mr-5">
						<i className="fa-solid fa-arrow-left text-xl"></i>
					</button>
					<h2 className="text-lg font-bold">
						<span>{title}</span>
					</h2>
				</div>
			</div>
		</div>
	);
}
