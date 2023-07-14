import toast, { Toaster } from "react-hot-toast";

export default function CustomToaster() {
	return (
		<Toaster
			position="bottom-left"
			reverseOrder={false}
			gutter={8}
			containerClassName=""
			containerStyle={{}}
			toastOptions={{
				// Define default options
				className:
					" border-t border-l-2 dark:border-lightBlue border-gray-500 text-xs bg-lightBlue dark:bg-gray-800 text-black dark:text-white capitalize",
				duration: 5000,
				style: {
					background: "#363636",
					color: "#fff"
				}
			}}
		/>
	);
}
