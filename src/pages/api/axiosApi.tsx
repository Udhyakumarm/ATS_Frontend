import React from "react"
import axios from "axios"

export const axiosInstance = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_PROD_BACKEND_BASE
      : process.env.NEXT_PUBLIC_DEV_BACKEND_BASE,
  timeout: process.env.NODE_ENV === "production" ? 5000 : 10000,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
})

export const axiosInstance2 = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_PROD_BACKEND_BASE
      : process.env.NEXT_PUBLIC_DEV_BACKEND_BASE,
  timeout: process.env.NODE_ENV === "production" ? 5000 : 10000,
  headers: {
    "Content-Type": "multipart/form-data",
  },
})

export function axiosInstanceAuth(accessToken: string) {
  return axios.create({
    baseURL:
      process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_PROD_BACKEND_BASE
        : process.env.NEXT_PUBLIC_DEV_BACKEND_BASE,
    timeout: process.env.NODE_ENV === "production" ? 5000 : 10000,
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-Type": "multipart/form-data",
    },
  })
}