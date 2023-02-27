import axios from "axios";
import jwt from "jsonwebtoken";

export namespace JwtUtils {
	export const isJwtExpired = (token: string) => {
		// offset by 60 seconds, so we will check if the token is "almost expired".
		const currentTime = Math.round(Date.now() / 1000 + 60);
		const decoded: any = jwt.decode(token);

		if (!decoded) return false;

		console.log(`Current time + 60 seconds: ${new Date(currentTime * 1000)}`);
		console.log(`Token lifetime: ${new Date(decoded["exp"] * 1000)}`);

		if (decoded["exp"]) {
			const adjustedExpiry = decoded["exp"];

			if (adjustedExpiry < currentTime) {
				console.log("Token expired");
				return true;
			}

			console.log("Token has not expired yet");
			return false;
		}

		console.log('Token["exp"] does not exist');
		return true;
	};
}

export namespace UrlUtils {
	export const makeUrl = (...endpoints: string[]) => {
		let url = endpoints.reduce((prevUrl, currentPath) => {
			if (prevUrl.length === 0) {
				return prevUrl + currentPath;
			}

			return prevUrl.endsWith("/") ? prevUrl + currentPath + "/" : prevUrl + "/" + currentPath + "/";
		}, "");
		return url;
	};
}

export namespace axiosInstance {
	export const api = axios.create({
		baseURL:
			process.env.NODE_ENV === "production"
				? process.env.NEXT_PUBLIC_PROD_BACKEND_BASE
				: process.env.NEXT_PUBLIC_DEV_BACKEND_BASE,
		timeout: process.env.NODE_ENV === "production" ? 5000 : 10000,
		headers: {
			"Content-Type": "multipart/form-data"
		}
	});
}
