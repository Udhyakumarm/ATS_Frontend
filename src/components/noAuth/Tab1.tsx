import React, { useState } from "react";

export default function Tab1() {
	const [disclosures, setDisclosures] = useState([
		{
			id: "disclosure-panel-1",
			isOpen: false,
			buttonText: "Review only the most relevant results",
			panelText:
				"Novus carefully selects and evaluates candidate applications, providing you with ranked results to help you discover the top talents of your industry."
		},
		{
			id: "disclosure-panel-2",
			isOpen: false,
			buttonText: "Experience an elite talent pool",
			panelText:
				"Somhako directs candidates towards the job openings that closely match their strengths so that you can access a strong talent pool that has been hand-picked for your job profile."
		},
		{
			id: "disclosure-panel-3",
			isOpen: false,
			buttonText: "Broaden your network pool",
			panelText:
				"Somhako provides a seamless integration of third-party tools and platforms, thereby enabling collaborations and referral."
		}
	]);

	const handleClick = (id) => {
		setDisclosures(disclosures.map((d) => (d.id === id ? { ...d, isOpen: !d.isOpen } : { ...d, isOpen: false })));
	};

	return (
		<div className="mx-auto w-full  space-y-6 rounded-2xl max-lg:space-y-3">
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
							className="flex w-full items-center gap-4 rounded-lg p-4 text-left text-[1vw] font-medium text-white max-lg:text-[1.5vw] max-md:text-[2vw]"
							onClick={() => handleClick(id)}
							aria-expanded={isOpen}
							{...(isOpen && { "aria-controls": id })}
						>
							<span className="w-full text-center">{buttonText}</span>
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
