import React, { useState } from "react";

export default function Tab2() {
	const [disclosures, setDisclosures] = useState([
		{
			id: "disclosure-panel-1",
			isOpen: false,
			buttonText: "Optimise your time",
			panelText:
				"Streamline your daily operations and automate your tasks with Novus to create an efficient and meaningful talent management system."
		},
		{
			id: "disclosure-panel-2",
			isOpen: false,
			buttonText: "Strategies better with comprehensive analytics",
			panelText:
				"Use our statistical observations and comprehensive analytics to develop talents that can promise a more fulfilling career trajectory."
		},
		{
			id: "disclosure-panel-3",
			isOpen: false,
			buttonText: "Experience seamless integration",
			panelText:
				"Seamlessly integrate your calendar with our dashboard and leverage built-in chats for an uninterrupted and streamlined recruitment experience."
		}
	]);

	const handleClick = (id) => {
		setDisclosures(disclosures.map((d) => (d.id === id ? { ...d, isOpen: !d.isOpen } : { ...d, isOpen: false })));
	};

	return (
		<div className="mx-auto w-full space-y-6 rounded-2xl max-lg:space-y-3 ">
			{disclosures.map(({ id, isOpen, buttonText, panelText }) => (
				<React.Fragment key={id}>
					<div
						className="rounded-[3vw] p-2 text-white max-md:rounded-[4vw] max-md:p-0"
						style={{
							backgroundImage: "url('images/noAuth/tabBg1.jpg')",
							backgroundRepeat: "no-repeat",
							backgroundSize: "cover",
							backgroundPosition: "center"
						}}
					>
						<button
							// className="flex w-full justify-between rounded-lg bg-gray-300 px-4 py-4 text-left text-sm font-medium text-gray-900 hover:bg-gray-500 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
							className="flex w-full items-center justify-between rounded-lg p-4 text-left text-[1vw] font-medium text-white max-lg:text-[1.5vw] max-md:text-[2vw]"
							onClick={() => handleClick(id)}
							aria-expanded={isOpen}
							{...(isOpen && { "aria-controls": id })}
						>
							{buttonText}
							<i className={`fa-solid text-lg ${isOpen ? "fa-power-off -rotate-90" : "fa-circle-plus"} `}></i>
						</button>
						{isOpen && (
							<div className="m-2 mt-0 border-t-2 border-cyan-500 p-2 text-center text-[1vw] font-light  max-lg:text-[1.5vw] max-md:text-[2vw]">
								{panelText}
							</div>
						)}
					</div>
				</React.Fragment>
			))}
		</div>
	);
}
