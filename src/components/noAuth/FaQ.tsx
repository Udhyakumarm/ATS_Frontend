import React, { useState } from "react";

export default function Faq() {
	const [disclosures, setDisclosures] = useState([
		{
			id: "disclosure-panel-1",
			isOpen: false,
			buttonText: "Do i get charged additional for Novus ?",
			panelText:
				"Novus carefully selects and evaluates candidate applications, providing you with ranked results to help you discover the top talents of your industry."
		},
		{
			id: "disclosure-panel-2",
			isOpen: false,
			buttonText: "Can i customize somhako based on our needs ?",
			panelText:
				"Somhako directs candidates towards the job openings that closely match their strengths so that you can access a strong talent pool that has been hand-picked for your job profile."
		},
		{
			id: "disclosure-panel-3",
			isOpen: false,
			buttonText: "Can i customize somhako based on our needs ?",
			panelText:
				"Somhako provides a seamless integration of third-party tools and platforms, thereby enabling collaborations and referral."
		}
	]);

	const handleClick = (id) => {
		setDisclosures(disclosures.map((d) => (d.id === id ? { ...d, isOpen: !d.isOpen } : { ...d, isOpen: false })));
	};

	return (
		<div className="w-full space-y-3 rounded-2xl ">
			{disclosures.map(({ id, isOpen, buttonText, panelText }) => (
				<React.Fragment key={id}>
					<div className="rounded-[1vw] border-b-2 border-black p-2 text-black max-md:rounded-[2vw] max-md:p-0">
						<button
							className="flex w-full items-center justify-between rounded-lg p-2 text-left text-[1vw] font-medium text-black max-lg:py-0 max-lg:text-[1.5vw] max-md:text-[2vw]"
							onClick={() => handleClick(id)}
							aria-expanded={isOpen}
							{...(isOpen && { "aria-controls": id })}
						>
							{buttonText}
							<i className={`fa-solid text-lg ${isOpen ? "fa-power-off -rotate-90" : "fa-circle-plus"} `}></i>
						</button>
						{isOpen && (
							<div className="m-2 mt-0 border-t-2 border-cyan-500 p-2 text-left text-[1vw] font-light  max-lg:text-[1.5vw] max-md:text-[2vw]">
								{panelText}
							</div>
						)}
					</div>
				</React.Fragment>
			))}
		</div>
	);
}
