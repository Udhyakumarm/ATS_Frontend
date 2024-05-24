import Link from "next/link";

interface PricingCardProps {
	title: string;
	price: number;
	features: string[];
	color: string;
	planId: string; // Add planId prop
}

const PricingCard: React.FC<PricingCardProps> = ({ title, price, features, color, planId }) => {
	return (
		<div className={`rounded-lg border-2 border-gray-500 p-6 text-center ${color}`}>
			<h2 className="mb-4 text-2xl font-semibold">{title}</h2>
			<p className="mb-6 text-lg text-gray-600">¥{price}/month</p>
			<ul className="mb-8 text-gray-600">
				{features.map((feature, index) => (
					<li key={index} className="flex items-center justify-center">
						<svg className="mr-2 h-4 w-4 fill-current text-green-500" viewBox="0 0 20 20">
							<path
								fillRule="evenodd"
								d="M17.293 5.293a1 1 0 0 0-1.414 0L8 13.586l-3.293-3.293a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.414 0l9-9a1 1 0 0 0 0-1.414z"
								clipRule="evenodd"
							></path>
						</svg>
						{feature}
					</li>
				))}
			</ul>
			<Link
				href={`subscription/checkout?planId=${planId}`}
				className="inline-block rounded-full bg-white px-8 py-3 font-semibold text-gray-800 transition duration-300 hover:bg-gray-100"
				passHref
			>
				Buy Now
			</Link>
		</div>
	);
};

const Pricing: React.FC = () => {
	return (
		<div className="flex h-screen items-center justify-center text-center">
			<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
				<PricingCard
					title="Basic Plan"
					price={10000}
					features={["Feature 1", "Feature 2", "Feature 3"]}
					color="bg-blue-100"
					planId="price_1OzDl8SHBwE4Ooa9diFz5Ca5"
				/>
				<PricingCard
					title="Premium Plan"
					price={20000}
					features={["All Basic features", "Feature 4", "Feature 5"]}
					color="bg-green-100"
					planId="price_1OzDllSHBwE4Ooa93HdCGu4d"
				/>
				<PricingCard
					title="Enterprise Plan"
					price={20000}
					features={["All Basic features", "Feature 4", "Feature 5"]}
					color="bg-emrald-100"
					planId="price_1OzDm5SHBwE4Ooa9rBn3ipJR"
				/>
				{/* Add more pricing cards as needed */}
			</div>
		</div>
	);
};

export default Pricing;
