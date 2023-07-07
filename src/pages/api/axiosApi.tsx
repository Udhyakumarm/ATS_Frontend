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
	timeout: process.env.NODE_ENV === "production" ? 15000 : 15000,
	headers: {
		"Content-Type": "multipart/form-data"
	}
});

export const axiosInstanceOCR = axios.create({
	baseURL:
		process.env.NODE_ENV === "production"
			? process.env.NEXT_PUBLIC_PROD_BACKEND_BASE
			: process.env.NEXT_PUBLIC_DEV_BACKEND_BASE,
	// timeout: process.env.NODE_ENV === "production" ? 15000 : 15000,
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
		timeout: process.env.NODE_ENV === "production" ? 50000 : 50000,
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
		timeout: process.env.NODE_ENV === "production" ? 100000 : 100000,
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

export async function addNotifyLog(axiosInstanceAuth2: any, title: any, type: any) {
	const fd = new FormData();
	fd.append("title", title);
	fd.append("notification_type", type);
	await axiosInstanceAuth2
		.post(`/chatbot/notification/`, fd)
		.then((res: any) => {
			toastcomp("Notify Add", "success");
		})
		.catch((err: any) => {
			toastcomp("Notify Not Add", "error");
		});
}

export async function addNotifyJobLog(axiosInstanceAuth2: any, title: any, type: any, refid: any) {
	const fd = new FormData();
	fd.append("title", title);
	fd.append("notification_type", type);
	fd.append("refid", refid);
	await axiosInstanceAuth2
		.post(`/chatbot/notification/`, fd)
		.then((res: any) => {
			toastcomp("Notify Add", "success");
		})
		.catch((err: any) => {
			toastcomp("Notify Not Add", "error");
		});
}

export async function addNotifyApplicantLog(axiosInstanceAuth2: any, title: any, type: any, arefid: any) {
	const fd = new FormData();
	fd.append("title", title);
	fd.append("notification_type", type);
	fd.append("arefid", arefid);
	await axiosInstanceAuth2
		.post(`/chatbot/notification/`, fd)
		.then((res: any) => {
			toastcomp("Notify Add", "success");
		})
		.catch((err: any) => {
			toastcomp("Notify Not Add", "error");
		});
}

export async function addNotifyInterviewLog(axiosInstanceAuth2: any, title: any, type: any, irefid: any) {
	const fd = new FormData();
	fd.append("title", title);
	fd.append("notification_type", type);
	fd.append("irefid", irefid);
	await axiosInstanceAuth2
		.post(`/chatbot/notification/`, fd)
		.then((res: any) => {
			toastcomp("Notify Add", "success");
		})
		.catch((err: any) => {
			toastcomp("Notify Not Add", "error");
		});
}

export async function addExternalNotifyLog(axiosInstanceAuth2: any, title: any) {
	const fd = new FormData();
	fd.append("title", title);
	await axiosInstanceAuth2
		.post(`/chatbot/external-notification/`, fd)
		.then((res: any) => {
			toastcomp("External Notify Add", "success");
		})
		.catch((err: any) => {
			toastcomp("External Notify Not Add", "error");
		});
}
