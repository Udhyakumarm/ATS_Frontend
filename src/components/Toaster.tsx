import { Toaster } from "react-hot-toast";

export default function CustomToaster() {
	return (
		<Toaster
			position="top-right"
			reverseOrder={false}
			gutter={8}
			containerClassName=""
			containerStyle={{}}
			toastOptions={{
				// Define default options
				className: "",
				duration: 5000,
				style: {
					background: "#363636",
					color: "#fff"
				}
			}}
		/>
	);
}
