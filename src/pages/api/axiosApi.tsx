import React from "react";
import axios from "axios";
import toastcomp from "@/components/toast";

export const axiosInstance = axios.create({
	baseURL:
		process.env.NODE_ENV === "production"
			? process.env.NEXT_PUBLIC_PROD_BACKEND_BASE
			: process.env.NEXT_PUBLIC_DEV_BACKEND_BASE,
	timeout: process.env.NODE_ENV === "production" ? 5000 : 10000,
	headers: {
		"Content-Type": "application/json",
		accept: "application/json"
	}
});

export const axiosInstance2 = axios.create({
	baseURL:
		process.env.NODE_ENV === "production"
			? process.env.NEXT_PUBLIC_PROD_BACKEND_BASE
			: process.env.NEXT_PUBLIC_DEV_BACKEND_BASE,
	timeout: process.env.NODE_ENV === "production" ? 5000 : 15000,
	headers: {
		"Content-Type": "multipart/form-data"
	}
});

export function axiosInstanceAuth(accessToken: string) {
	return axios.create({
		baseURL:
			process.env.NODE_ENV === "production"
				? process.env.NEXT_PUBLIC_PROD_BACKEND_BASE
				: process.env.NEXT_PUBLIC_DEV_BACKEND_BASE,
		timeout: process.env.NODE_ENV === "production" ? 5000 : 10000,
		headers: {
			Authorization: "Bearer " + accessToken,
			"Content-Type": "multipart/form-data"
		}
	});
}

export function axiosInstanceAuth22(accessToken: string) {
	return axios.create({
		baseURL:
			process.env.NODE_ENV === "production"
				? process.env.NEXT_PUBLIC_PROD_BACKEND_BASE
				: process.env.NEXT_PUBLIC_DEV_BACKEND_BASE,
		timeout: process.env.NODE_ENV === "production" ? 50000 : 100000,
		headers: {
			Authorization: "Bearer " + accessToken,
			"Content-Type": "multipart/form-data"
		}
	});
}

export async function addActivityLog(axiosInstanceAuth2: any, aname: any) {
	const fd = new FormData();
	fd.append("aname", aname);
	await axiosInstanceAuth2
		.post(`/organization/activity-log/`, fd)
		.then((res: any) => {
			toastcomp("Log Add", "success");
		})
		.catch((err: any) => {
			toastcomp("Log Not Add", "error");
		});
}
