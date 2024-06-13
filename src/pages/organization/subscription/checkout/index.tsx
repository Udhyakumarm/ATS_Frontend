import { use, useEffect } from "react";
import axios from "axios";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { Router, useRouter } from "next/router";
import { axiosInstance2 } from "@/pages/api/axiosApi";
import toastcomp from "@/components/toast";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const CheckoutPage: React.FC = () => {
	const router = useRouter();
	const apiurl = "http://127.0.0.1:8000/api/subscription/create-subscription/";
    async function abs(planId:any){
        const fd = new FormData();
		fd.append("product_id", planId);
		await axiosInstance2
			.post(`/subscription/create-subscription/`,fd)
			.then((res) => {
				if(res.data.url && res.data.url.length>0){
					toastcomp("rating update","success")
					router.replace(res.data.url)
				}else{
					toastcomp("rating not update","error")}
			})
			.catch((err) => {
				// console.log("@", "rating", err);
				toastcomp("rating not update","error")
			});

    }
	useEffect(() => {
		// const redirectToCheckout = async (sessionId: string) => {
		// 	const stripe = await stripePromise;

		// 	if (stripe) {
		// 		const { error } = await stripe.redirectToCheckout({
		// 			sessionId: sessionId
		// 		});

		// 		if (error) {
		// 			console.error("Error redirecting to checkout:", error);
		// 		}
		// 	}
		// };

		const createCheckoutSession = async () => {
			try {
				const queryParams = new URLSearchParams(window.location.search);
				const planId = queryParams.get("planId");
				// console.log(typeof planId);

				if (!planId) {
					console.error("planId is not available.");
					return;
				}
                abs(planId)

			} catch (error) {
				console.error("Error creating checkout session:", error);
			}
		};
		createCheckoutSession();
	}, []);

	return <div className="m-6 justify-center text-center text-4xl text-sky-600">Redirecting to Stripe...</div>;
};

export default CheckoutPage;
