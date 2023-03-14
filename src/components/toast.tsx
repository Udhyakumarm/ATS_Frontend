//@ts-nocheck
import React from "react";
import toast, { Toaster } from "react-hot-toast";

export default function toastcomp(title, type) {
  toast(title, {
    type: type,
    duration: 5000,
    position: "top-right",
    // reverseOrder=false

    // Styling
    // style: {
    //     background: "#363636",
	// 	color: "#fff"
    // },
    className: '',
  });
}