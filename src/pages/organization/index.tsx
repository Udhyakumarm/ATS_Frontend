//@collapse
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import dashboardIcon from "/public/images/icons/dashboard.png";
import jobsIcon from "/public/images/icons/jobs.png";
import analyticsIcon from "/public/images/icons/analytics.png";
import vendorsIcon from "/public/images/icons/vendors.png";
import applicantsIcon from "/public/images/icons/applicants.png";
import settingsIcon from "/public/images/icons/settings.png";
import offerManageIcon from "/public/images/icons/offer-manage.png";
import interviewsIcon from "/public/images/icons/interviews.png";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useLangStore, useUserStore } from "@/utils/code";
import toastcomp from "@/components/toast";
// import Joyride from 'react-joyride';
import useJoyrideStore from "@/utils/joyride";
import Joyride from "react-joyride";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { axiosInstanceAuth } from "../api/axiosApi";
import ReconnectingWebSocket from "reconnecting-websocket";

export default function Organization({ atsVersion, userRole, currentUser }: any) {
	const { t } = useTranslation("common");
	const srcLang = useLangStore((state: { lang: any }) => state.lang);
	const [runTour, setRunTour] = useState(false);
	const [tourCompleted, setTourCompleted] = useState(false);
	const [isTourOpen, setIsTourOpen] = useState(false);
	const { shouldShowJoyride, isJoyrideCompleted, showJoyride, completeJoyride } = useJoyrideStore();
	const user = useUserStore((state: { user: any }) => state.user);
	const role = useUserStore((state: { role: any }) => state.role);
	function blurOrNot(name: any) {
		if (atsVersion === "standard" || atsVersion === "starter") {
			return name === "Offer Management";
		} else {
			return false;
		}
	}

	function isExpired(name: any) {
		return name != "Settings" && currentUser.is_expired;
	}

	const quicklinks = [
		{
			name: t("Words.Dashboard"),
			// icon: dashboardIcon,
			link: "/organization/dashboard",
			blur: blurOrNot("Dashboard"),
			expired: isExpired("Dashboard"),

			icon: (
				<svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 44 47" fill="none">
					<g filter="url(#filter0_d_2512_2668)">
						<mask
							id="mask0_2512_2668"
							style={{ maskType: "alpha" }}
							maskUnits="userSpaceOnUse"
							x="2"
							y="0"
							width="40"
							height="40"
						>
							<rect x="2" y="0.316406" width="40" height="39.001" fill="#D9D9D9" />
						</mask>
						<g mask="url(#mask0_2512_2668)">
							<path
								d="M10.3333 34.4422C9.41667 34.4422 8.63194 34.1239 7.97917 33.4875C7.32639 32.851 7 32.0859 7 31.1921V8.44149C7 7.54772 7.32639 6.78259 7.97917 6.14612C8.63194 5.50964 9.41667 5.19141 10.3333 5.19141H33.6667C34.5833 5.19141 35.3681 5.50964 36.0208 6.14612C36.6736 6.78259 37 7.54772 37 8.44149V31.1921C37 32.0859 36.6736 32.851 36.0208 33.4875C35.3681 34.1239 34.5833 34.4422 33.6667 34.4422H10.3333ZM10.3333 31.1921H20.3333V8.44149H10.3333V31.1921ZM23.6667 31.1921H33.6667V19.8168H23.6667V31.1921ZM23.6667 16.5667H33.6667V8.44149H23.6667V16.5667Z"
								fill="url(#paint0_linear_2512_2668)"
							/>
						</g>
					</g>
					<defs>
						<filter
							id="filter0_d_2512_2668"
							x="0"
							y="3.19141"
							width="44"
							height="43.25"
							filterUnits="userSpaceOnUse"
							color-interpolation-filters="sRGB"
						>
							<feFlood flood-opacity="0" result="BackgroundImageFix" />
							<feColorMatrix
								in="SourceAlpha"
								type="matrix"
								values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
								result="hardAlpha"
							/>
							<feOffset dy="5" />
							<feGaussianBlur stdDeviation="3.5" />
							<feComposite in2="hardAlpha" operator="out" />
							<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
							<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2512_2668" />
							<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2512_2668" result="shape" />
						</filter>
						<linearGradient
							id="paint0_linear_2512_2668"
							x1="3.30298"
							y1="30.5414"
							x2="48.5671"
							y2="13.5081"
							gradientUnits="userSpaceOnUse"
						>
							<stop stop-color="#2D129A" />
							<stop offset="1" stop-color="#47BBFD" />
						</linearGradient>
					</defs>
				</svg>
			)
		},
		{
			name: t("Words.Jobs"),
			// icon: jobsIcon,
			link: "/organization/jobs",
			blur: blurOrNot("Jobs"),
			expired: isExpired("Jobs"),

			icon: (
				<svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 35 37" fill="none">
					<g filter="url(#filter0_d_2512_2694)">
						<mask
							id="mask0_2512_2694"
							style={{ maskType: "alpha" }}
							maskUnits="userSpaceOnUse"
							x="2"
							y="0"
							width="31"
							height="33"
						>
							<rect x="2" y="0.0820312" width="31" height="32.843" fill="#D9D9D9" />
						</mask>
						<g mask="url(#mask0_2512_2694)">
							<path
								d="M7.16634 28.821C6.45592 28.821 5.84776 28.553 5.34186 28.017C4.83596 27.481 4.58301 26.8367 4.58301 26.0841V11.0311C4.58301 10.2784 4.83596 9.63409 5.34186 9.09811C5.84776 8.56213 6.45592 8.29414 7.16634 8.29414H12.333V5.55723C12.333 4.80457 12.586 4.16026 13.0919 3.62428C13.5978 3.0883 14.2059 2.82031 14.9163 2.82031H20.083C20.7934 2.82031 21.4016 3.0883 21.9075 3.62428C22.4134 4.16026 22.6663 4.80457 22.6663 5.55723V8.29414H27.833C28.5434 8.29414 29.1516 8.56213 29.6575 9.09811C30.1634 9.63409 30.4163 10.2784 30.4163 11.0311V26.0841C30.4163 26.8367 30.1634 27.481 29.6575 28.017C29.1516 28.553 28.5434 28.821 27.833 28.821H7.16634ZM7.16634 26.0841H27.833V11.0311H7.16634V26.0841ZM14.9163 8.29414H20.083V5.55723H14.9163V8.29414Z"
								fill="url(#paint0_linear_2512_2694)"
							/>
						</g>
					</g>
					<defs>
						<filter
							id="filter0_d_2512_2694"
							x="0.583008"
							y="2.82031"
							width="33.833"
							height="34"
							filterUnits="userSpaceOnUse"
							color-interpolation-filters="sRGB"
						>
							<feFlood flood-opacity="0" result="BackgroundImageFix" />
							<feColorMatrix
								in="SourceAlpha"
								type="matrix"
								values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
								result="hardAlpha"
							/>
							<feOffset dy="4" />
							<feGaussianBlur stdDeviation="2" />
							<feComposite in2="hardAlpha" operator="out" />
							<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
							<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2512_2694" />
							<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2512_2694" result="shape" />
						</filter>
						<linearGradient
							id="paint0_linear_2512_2694"
							x1="1.39946"
							y1="25.3536"
							x2="40.6766"
							y2="11.0352"
							gradientUnits="userSpaceOnUse"
						>
							<stop stop-color="#2D129A" />
							<stop offset="1" stop-color="#47BBFD" />
						</linearGradient>
					</defs>
				</svg>
			)
		},
		{
			name: t("Words.Applicants"),
			// icon: applicantsIcon,
			link: "/organization/applicants",
			blur: blurOrNot("Applicants"),
			expired: isExpired("Applicants"),

			icon: (
				<svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 39 42" fill="none">
					<g filter="url(#filter0_d_2512_2674)">
						<mask
							id="mask0_2512_2674"
							style={{ maskType: "alpha" }}
							maskUnits="userSpaceOnUse"
							x="1"
							y="0"
							width="37"
							height="38"
						>
							<rect x="1" y="0.109375" width="37" height="36.9483" fill="#D9D9D9" />
						</mask>
						<g mask="url(#mask0_2512_2674)">
							<path
								d="M10.0194 26.4342C11.3298 25.4335 12.7944 24.6445 14.4132 24.0672C16.0319 23.4898 17.7277 23.2012 19.5007 23.2012C21.2736 23.2012 22.9694 23.4898 24.5882 24.0672C26.2069 24.6445 27.6715 25.4335 28.9819 26.4342C29.8812 25.3822 30.5814 24.189 31.0824 22.8548C31.5835 21.5205 31.834 20.0965 31.834 18.5826C31.834 15.17 30.6328 12.2642 28.2303 9.86514C25.8279 7.46607 22.918 6.26653 19.5007 6.26653C16.0833 6.26653 13.1734 7.46607 10.771 9.86514C8.36853 12.2642 7.16732 15.17 7.16732 18.5826C7.16732 20.0965 7.41784 21.5205 7.91888 22.8548C8.41992 24.189 9.1201 25.3822 10.0194 26.4342ZM19.5007 20.1222C17.9847 20.1222 16.7064 19.6026 15.6658 18.5634C14.6251 17.5242 14.1048 16.2477 14.1048 14.7339C14.1048 13.22 14.6251 11.9435 15.6658 10.9043C16.7064 9.86514 17.9847 9.34555 19.5007 9.34555C21.0166 9.34555 22.2949 9.86514 23.3355 10.9043C24.3762 11.9435 24.8965 13.22 24.8965 14.7339C24.8965 16.2477 24.3762 17.5242 23.3355 18.5634C22.2949 19.6026 21.0166 20.1222 19.5007 20.1222ZM19.5007 33.9778C17.368 33.9778 15.3638 33.5737 13.4882 32.7654C11.6125 31.9572 9.98086 30.8603 8.59336 29.4747C7.20586 28.0891 6.10742 26.4598 5.29805 24.5867C4.48867 22.7137 4.08398 20.7123 4.08398 18.5826C4.08398 16.453 4.48867 14.4516 5.29805 12.5785C6.10742 10.7055 7.20586 9.07614 8.59336 7.69058C9.98086 6.30502 11.6125 5.20811 13.4882 4.39987C15.3638 3.59162 17.368 3.1875 19.5007 3.1875C21.6333 3.1875 23.6375 3.59162 25.5132 4.39987C27.3888 5.20811 29.0204 6.30502 30.4079 7.69058C31.7954 9.07614 32.8939 10.7055 33.7033 12.5785C34.5126 14.4516 34.9173 16.453 34.9173 18.5826C34.9173 20.7123 34.5126 22.7137 33.7033 24.5867C32.8939 26.4598 31.7954 28.0891 30.4079 29.4747C29.0204 30.8603 27.3888 31.9572 25.5132 32.7654C23.6375 33.5737 21.6333 33.9778 19.5007 33.9778ZM19.5007 30.8987C20.8625 30.8987 22.1472 30.6999 23.3548 30.3022C24.5625 29.9045 25.6673 29.3336 26.6694 28.5895C25.6673 27.8454 24.5625 27.2745 23.3548 26.8768C22.1472 26.4791 20.8625 26.2802 19.5007 26.2802C18.1388 26.2802 16.8541 26.4791 15.6465 26.8768C14.4388 27.2745 13.334 27.8454 12.3319 28.5895C13.334 29.3336 14.4388 29.9045 15.6465 30.3022C16.8541 30.6999 18.1388 30.8987 19.5007 30.8987ZM19.5007 17.0431C20.1687 17.0431 20.7211 16.825 21.1579 16.3888C21.5947 15.9526 21.8132 15.401 21.8132 14.7339C21.8132 14.0667 21.5947 13.5151 21.1579 13.0789C20.7211 12.6427 20.1687 12.4246 19.5007 12.4246C18.8326 12.4246 18.2802 12.6427 17.8434 13.0789C17.4066 13.5151 17.1882 14.0667 17.1882 14.7339C17.1882 15.401 17.4066 15.9526 17.8434 16.3888C18.2802 16.825 18.8326 17.0431 19.5007 17.0431Z"
								fill="url(#paint0_linear_2512_2674)"
							/>
						</g>
					</g>
					<defs>
						<filter
							id="filter0_d_2512_2674"
							x="0.0839844"
							y="3.1875"
							width="38.833"
							height="38.7891"
							filterUnits="userSpaceOnUse"
							color-interpolation-filters="sRGB"
						>
							<feFlood flood-opacity="0" result="BackgroundImageFix" />
							<feColorMatrix
								in="SourceAlpha"
								type="matrix"
								values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
								result="hardAlpha"
							/>
							<feOffset dy="4" />
							<feGaussianBlur stdDeviation="2" />
							<feComposite in2="hardAlpha" operator="out" />
							<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
							<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2512_2674" />
							<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2512_2674" result="shape" />
						</filter>
						<linearGradient
							id="paint0_linear_2512_2674"
							x1="0.284271"
							y1="29.8717"
							x2="47.0765"
							y2="12.6791"
							gradientUnits="userSpaceOnUse"
						>
							<stop stop-color="#2D129A" />
							<stop offset="1" stop-color="#47BBFD" />
						</linearGradient>
					</defs>
				</svg>
			)
		},
		{
			name: t("Words.OfferManagement"),
			// icon: offerManageIcon,
			link: "/organization/offer-management",
			blur: blurOrNot("Offer Management"),
			expired: isExpired("Offer Management"),

			icon: (
				<svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 39 46" fill="none">
					<g filter="url(#filter0_d_2512_2700)">
						<mask
							id="mask0_2512_2700"
							style={{ maskType: "alpha" }}
							maskUnits="userSpaceOnUse"
							x="0"
							y="0"
							width="39"
							height="42"
						>
							<rect y="0.957031" width="38.0312" height="40.1877" fill="#D9D9D9" />
						</mask>
						<g mask="url(#mask0_2512_2700)">
							<path
								d="M9.50781 37.7945C8.18728 37.7945 7.06483 37.3061 6.14046 36.3293C5.21609 35.3525 4.75391 34.1664 4.75391 32.771V27.7475H9.50781V4.30469H33.2773V32.771C33.2773 34.1664 32.8152 35.3525 31.8908 36.3293C30.9664 37.3061 29.844 37.7945 28.5234 37.7945H9.50781ZM28.5234 34.4455C28.9724 34.4455 29.3488 34.285 29.6525 33.9641C29.9562 33.6431 30.1081 33.2454 30.1081 32.771V7.65366H12.6771V27.7475H26.9388V32.771C26.9388 33.2454 27.0907 33.6431 27.3944 33.9641C27.6981 34.285 28.0745 34.4455 28.5234 34.4455ZM14.2617 16.0261V12.6771H28.5234V16.0261H14.2617ZM14.2617 21.0496V17.7006H28.5234V21.0496H14.2617ZM9.50781 34.4455H23.7695V31.0965H7.92318V32.771C7.92318 33.2454 8.07504 33.6431 8.37876 33.9641C8.68248 34.285 9.05883 34.4455 9.50781 34.4455ZM9.50781 34.4455H7.92318H23.7695H9.50781Z"
								fill="url(#paint0_linear_2512_2700)"
							/>
						</g>
					</g>
					<defs>
						<filter
							id="filter0_d_2512_2700"
							x="0.753906"
							y="4.30469"
							width="36.5234"
							height="41.4883"
							filterUnits="userSpaceOnUse"
							color-interpolation-filters="sRGB"
						>
							<feFlood flood-opacity="0" result="BackgroundImageFix" />
							<feColorMatrix
								in="SourceAlpha"
								type="matrix"
								values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
								result="hardAlpha"
							/>
							<feOffset dy="4" />
							<feGaussianBlur stdDeviation="2" />
							<feComposite in2="hardAlpha" operator="out" />
							<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
							<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2512_2700" />
							<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2512_2700" result="shape" />
						</filter>
						<linearGradient
							id="paint0_linear_2512_2700"
							x1="1.23885"
							y1="33.3284"
							x2="45.9983"
							y2="19.341"
							gradientUnits="userSpaceOnUse"
						>
							<stop stop-color="#2D129A" />
							<stop offset="1" stop-color="#47BBFD" />
						</linearGradient>
					</defs>
				</svg>
			)
		},
		{
			name: t("Words.Interviews"),
			// icon: interviewsIcon,
			link: "/organization/interviews",
			blur: blurOrNot("Interviews"),
			expired: isExpired("Interviews"),

			icon: (
				<svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 54 53" fill="none">
					<g filter="url(#filter0_d_2512_2734)">
						<mask
							id="mask0_2512_2734"
							style={{ maskType: "alpha" }}
							maskUnits="userSpaceOnUse"
							x="4"
							y="0"
							width="46"
							height="53"
						>
							<rect x="4" y="0.386719" width="45.3125" height="52.568" fill="#D9D9D9" />
						</mask>
						<g mask="url(#mask0_2512_2734)">
							<path
								d="M23.3994 26.6693C22.5183 26.6693 21.7946 26.286 21.2282 25.5194C20.6618 24.7528 20.4572 23.8584 20.6146 22.8363L21.181 18.8937C21.4327 17.3239 22.0699 16.0371 23.0926 15.0332C24.1153 14.0293 25.3032 13.5273 26.6562 13.5273C28.0408 13.5273 29.2444 14.0293 30.2671 15.0332C31.2898 16.0371 31.927 17.3239 32.1787 18.8937L32.7451 22.8363C32.9025 23.8584 32.6979 24.7528 32.1315 25.5194C31.5651 26.286 30.8414 26.6693 29.9603 26.6693H23.3994ZM24.5322 22.2887H28.8275L28.4499 19.6055C28.3869 19.0944 28.1824 18.6838 27.8363 18.3735C27.4901 18.0632 27.0968 17.908 26.6562 17.908C26.2157 17.908 25.8302 18.0632 25.4998 18.3735C25.1694 18.6838 24.9728 19.0944 24.9098 19.6055L24.5322 22.2887ZM9.85286 28.8049C9.12912 28.8414 8.50765 28.6771 7.98844 28.3121C7.46924 27.947 7.13097 27.3812 6.97363 26.6146C6.9107 26.286 6.89497 25.9575 6.92643 25.6289C6.9579 25.3004 7.03657 24.9901 7.16244 24.698C7.16244 24.7345 7.1467 24.6615 7.11523 24.479C7.0523 24.406 6.89497 23.9679 6.64323 23.1648C6.5803 22.7267 6.6275 22.3069 6.78483 21.9054C6.94217 21.5038 7.1467 21.157 7.39844 20.865L7.49284 20.7554C7.55577 20.0618 7.79964 19.4777 8.22445 19.0032C8.64925 18.5286 9.17632 18.2913 9.80566 18.2913C9.90007 18.2913 10.199 18.3643 10.7025 18.5104L10.8441 18.4556C11.0014 18.2731 11.2059 18.1362 11.4577 18.0449C11.7094 17.9536 11.9769 17.908 12.2601 17.908C12.6062 17.908 12.913 17.9719 13.1805 18.0997C13.448 18.2274 13.6604 18.4191 13.8177 18.6746C13.8492 18.6746 13.8728 18.6838 13.8885 18.702C13.9042 18.7203 13.9278 18.7294 13.9593 18.7294C14.3998 18.7659 14.7853 18.921 15.1157 19.1948C15.4461 19.4686 15.69 19.8428 15.8473 20.3174C15.9103 20.5729 15.9339 20.8193 15.9181 21.0566C15.9024 21.2939 15.8631 21.5221 15.8001 21.7411C15.8001 21.7776 15.8159 21.8506 15.8473 21.9601C16.0676 22.2157 16.2407 22.4986 16.3665 22.8089C16.4924 23.1192 16.5553 23.4386 16.5553 23.7671C16.5553 23.9132 16.4609 24.2965 16.2721 24.9171C16.2407 24.9901 16.2407 25.0631 16.2721 25.1361L16.3665 26.0122C16.3665 26.7789 16.0912 27.436 15.5405 27.9835C14.9899 28.5311 14.3212 28.8049 13.5345 28.8049H9.85286ZM41.7604 28.8597C40.722 28.8597 39.8331 28.4307 39.0936 27.5729C38.3541 26.715 37.9844 25.6837 37.9844 24.479C37.9844 24.0409 38.0394 23.6303 38.1496 23.2469C38.2597 22.8636 38.4092 22.4895 38.598 22.1244L37.2764 20.7554C36.9617 20.4634 36.9066 20.0983 37.1112 19.6603C37.3157 19.2222 37.6068 19.0032 37.9844 19.0032H41.7604C42.7988 19.0032 43.6878 19.4321 44.4272 20.29C45.1667 21.1479 45.5365 22.1792 45.5365 23.3838V24.479C45.5365 25.6837 45.1667 26.715 44.4272 27.5729C43.6878 28.4307 42.7988 28.8597 41.7604 28.8597ZM4 39.8113V36.3616C4 34.7553 4.70014 33.4685 6.10042 32.5011C7.50071 31.5337 9.31793 31.05 11.5521 31.05C11.9612 31.05 12.3545 31.0591 12.7321 31.0774C13.1097 31.0956 13.4716 31.1413 13.8177 31.2143C13.3772 31.9444 13.0468 32.7293 12.8265 33.5689C12.6062 34.4085 12.4961 35.3029 12.4961 36.252V39.8113H4ZM15.3281 39.8113V36.252C15.3281 33.8792 16.3744 31.9626 18.467 30.5024C20.5595 29.0422 23.2893 28.3121 26.6562 28.3121C30.0547 28.3121 32.7923 29.0422 34.8691 30.5024C36.946 31.9626 37.9844 33.8792 37.9844 36.252V39.8113H15.3281ZM41.7604 31.05C44.026 31.05 45.8511 31.5337 47.2357 32.5011C48.6202 33.4685 49.3125 34.7553 49.3125 36.3616V39.8113H40.8164V36.252C40.8164 35.3029 40.7141 34.4085 40.5096 33.5689C40.3051 32.7293 39.9983 31.9444 39.5892 31.2143C39.9353 31.1413 40.2893 31.0956 40.6512 31.0774C41.0131 31.0591 41.3828 31.05 41.7604 31.05ZM26.6562 32.6928C24.8626 32.6928 23.2578 32.9665 21.8418 33.5141C20.4258 34.0617 19.5919 34.7006 19.3402 35.4307H34.0195C33.7363 34.7006 32.8946 34.0617 31.4943 33.5141C30.094 32.9665 28.4813 32.6928 26.6562 32.6928Z"
								fill="url(#paint0_linear_2512_2734)"
							/>
						</g>
					</g>
					<defs>
						<filter
							id="filter0_d_2512_2734"
							x="0"
							y="13.5273"
							width="53.3125"
							height="34.2852"
							filterUnits="userSpaceOnUse"
							color-interpolation-filters="sRGB"
						>
							<feFlood flood-opacity="0" result="BackgroundImageFix" />
							<feColorMatrix
								in="SourceAlpha"
								type="matrix"
								values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
								result="hardAlpha"
							/>
							<feOffset dy="4" />
							<feGaussianBlur stdDeviation="2" />
							<feComposite in2="hardAlpha" operator="out" />
							<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
							<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2512_2734" />
							<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2512_2734" result="shape" />
						</filter>
						<linearGradient
							id="paint0_linear_2512_2734"
							x1="-1.58404"
							y1="36.3062"
							x2="54.1611"
							y2="1.04521"
							gradientUnits="userSpaceOnUse"
						>
							<stop stop-color="#2D129A" />
							<stop offset="1" stop-color="#47BBFD" />
						</linearGradient>
					</defs>
				</svg>
			)
		},
		{
			name: t("Words.Analytics"),
			// icon: analyticsIcon,
			link: "/organization/analytics",
			blur: blurOrNot("Analytics"),
			expired: isExpired("Analytics"),

			icon: (
				<svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 41 41" fill="none">
					<g filter="url(#filter0_d_2512_2718)">
						<mask
							id="mask0_2512_2718"
							style={{ maskType: "alpha" }}
							maskUnits="userSpaceOnUse"
							x="0"
							y="0"
							width="41"
							height="39"
						>
							<rect y="0.382812" width="40.6875" height="38.56" fill="#D9D9D9" />
						</mask>
						<g mask="url(#mask0_2512_2718)">
							<path
								d="M27.125 32.5153V21.2686H33.9062V32.5153H27.125ZM16.9531 32.5153V6.80859H23.7344V32.5153H16.9531ZM6.78125 32.5153V14.8419H13.5625V32.5153H6.78125Z"
								fill="url(#paint0_linear_2512_2718)"
							/>
						</g>
					</g>
					<defs>
						<filter
							id="filter0_d_2512_2718"
							x="2.78125"
							y="6.80859"
							width="35.125"
							height="33.707"
							filterUnits="userSpaceOnUse"
							color-interpolation-filters="sRGB"
						>
							<feFlood flood-opacity="0" result="BackgroundImageFix" />
							<feColorMatrix
								in="SourceAlpha"
								type="matrix"
								values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
								result="hardAlpha"
							/>
							<feOffset dy="4" />
							<feGaussianBlur stdDeviation="2" />
							<feComposite in2="hardAlpha" operator="out" />
							<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
							<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2512_2718" />
							<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2512_2718" result="shape" />
						</filter>
						<linearGradient
							id="paint0_linear_2512_2718"
							x1="3.43853"
							y1="29.0871"
							x2="44.0701"
							y2="13.3564"
							gradientUnits="userSpaceOnUse"
						>
							<stop stop-color="#2D129A" />
							<stop offset="1" stop-color="#47BBFD" />
						</linearGradient>
					</defs>
				</svg>
			)
		},
		{
			name: t("Words.Vendors"),
			// icon: vendorsIcon,
			link: "/organization/settings/vendors",
			blur: blurOrNot("Vendors"),
			expired: isExpired("Vendors"),

			icon: (
				<svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 54 53" fill="none">
					<g filter="url(#filter0_d_2512_2734)">
						<mask
							id="mask0_2512_2734"
							style={{ maskType: "alpha" }}
							maskUnits="userSpaceOnUse"
							x="4"
							y="0"
							width="46"
							height="53"
						>
							<rect x="4" y="0.386719" width="45.3125" height="52.568" fill="#D9D9D9" />
						</mask>
						<g mask="url(#mask0_2512_2734)">
							<path
								d="M23.3994 26.6693C22.5183 26.6693 21.7946 26.286 21.2282 25.5194C20.6618 24.7528 20.4572 23.8584 20.6146 22.8363L21.181 18.8937C21.4327 17.3239 22.0699 16.0371 23.0926 15.0332C24.1153 14.0293 25.3032 13.5273 26.6562 13.5273C28.0408 13.5273 29.2444 14.0293 30.2671 15.0332C31.2898 16.0371 31.927 17.3239 32.1787 18.8937L32.7451 22.8363C32.9025 23.8584 32.6979 24.7528 32.1315 25.5194C31.5651 26.286 30.8414 26.6693 29.9603 26.6693H23.3994ZM24.5322 22.2887H28.8275L28.4499 19.6055C28.3869 19.0944 28.1824 18.6838 27.8363 18.3735C27.4901 18.0632 27.0968 17.908 26.6562 17.908C26.2157 17.908 25.8302 18.0632 25.4998 18.3735C25.1694 18.6838 24.9728 19.0944 24.9098 19.6055L24.5322 22.2887ZM9.85286 28.8049C9.12912 28.8414 8.50765 28.6771 7.98844 28.3121C7.46924 27.947 7.13097 27.3812 6.97363 26.6146C6.9107 26.286 6.89497 25.9575 6.92643 25.6289C6.9579 25.3004 7.03657 24.9901 7.16244 24.698C7.16244 24.7345 7.1467 24.6615 7.11523 24.479C7.0523 24.406 6.89497 23.9679 6.64323 23.1648C6.5803 22.7267 6.6275 22.3069 6.78483 21.9054C6.94217 21.5038 7.1467 21.157 7.39844 20.865L7.49284 20.7554C7.55577 20.0618 7.79964 19.4777 8.22445 19.0032C8.64925 18.5286 9.17632 18.2913 9.80566 18.2913C9.90007 18.2913 10.199 18.3643 10.7025 18.5104L10.8441 18.4556C11.0014 18.2731 11.2059 18.1362 11.4577 18.0449C11.7094 17.9536 11.9769 17.908 12.2601 17.908C12.6062 17.908 12.913 17.9719 13.1805 18.0997C13.448 18.2274 13.6604 18.4191 13.8177 18.6746C13.8492 18.6746 13.8728 18.6838 13.8885 18.702C13.9042 18.7203 13.9278 18.7294 13.9593 18.7294C14.3998 18.7659 14.7853 18.921 15.1157 19.1948C15.4461 19.4686 15.69 19.8428 15.8473 20.3174C15.9103 20.5729 15.9339 20.8193 15.9181 21.0566C15.9024 21.2939 15.8631 21.5221 15.8001 21.7411C15.8001 21.7776 15.8159 21.8506 15.8473 21.9601C16.0676 22.2157 16.2407 22.4986 16.3665 22.8089C16.4924 23.1192 16.5553 23.4386 16.5553 23.7671C16.5553 23.9132 16.4609 24.2965 16.2721 24.9171C16.2407 24.9901 16.2407 25.0631 16.2721 25.1361L16.3665 26.0122C16.3665 26.7789 16.0912 27.436 15.5405 27.9835C14.9899 28.5311 14.3212 28.8049 13.5345 28.8049H9.85286ZM41.7604 28.8597C40.722 28.8597 39.8331 28.4307 39.0936 27.5729C38.3541 26.715 37.9844 25.6837 37.9844 24.479C37.9844 24.0409 38.0394 23.6303 38.1496 23.2469C38.2597 22.8636 38.4092 22.4895 38.598 22.1244L37.2764 20.7554C36.9617 20.4634 36.9066 20.0983 37.1112 19.6603C37.3157 19.2222 37.6068 19.0032 37.9844 19.0032H41.7604C42.7988 19.0032 43.6878 19.4321 44.4272 20.29C45.1667 21.1479 45.5365 22.1792 45.5365 23.3838V24.479C45.5365 25.6837 45.1667 26.715 44.4272 27.5729C43.6878 28.4307 42.7988 28.8597 41.7604 28.8597ZM4 39.8113V36.3616C4 34.7553 4.70014 33.4685 6.10042 32.5011C7.50071 31.5337 9.31793 31.05 11.5521 31.05C11.9612 31.05 12.3545 31.0591 12.7321 31.0774C13.1097 31.0956 13.4716 31.1413 13.8177 31.2143C13.3772 31.9444 13.0468 32.7293 12.8265 33.5689C12.6062 34.4085 12.4961 35.3029 12.4961 36.252V39.8113H4ZM15.3281 39.8113V36.252C15.3281 33.8792 16.3744 31.9626 18.467 30.5024C20.5595 29.0422 23.2893 28.3121 26.6562 28.3121C30.0547 28.3121 32.7923 29.0422 34.8691 30.5024C36.946 31.9626 37.9844 33.8792 37.9844 36.252V39.8113H15.3281ZM41.7604 31.05C44.026 31.05 45.8511 31.5337 47.2357 32.5011C48.6202 33.4685 49.3125 34.7553 49.3125 36.3616V39.8113H40.8164V36.252C40.8164 35.3029 40.7141 34.4085 40.5096 33.5689C40.3051 32.7293 39.9983 31.9444 39.5892 31.2143C39.9353 31.1413 40.2893 31.0956 40.6512 31.0774C41.0131 31.0591 41.3828 31.05 41.7604 31.05ZM26.6562 32.6928C24.8626 32.6928 23.2578 32.9665 21.8418 33.5141C20.4258 34.0617 19.5919 34.7006 19.3402 35.4307H34.0195C33.7363 34.7006 32.8946 34.0617 31.4943 33.5141C30.094 32.9665 28.4813 32.6928 26.6562 32.6928Z"
								fill="url(#paint0_linear_2512_2734)"
							/>
						</g>
					</g>
					<defs>
						<filter
							id="filter0_d_2512_2734"
							x="0"
							y="13.5273"
							width="53.3125"
							height="34.2852"
							filterUnits="userSpaceOnUse"
							color-interpolation-filters="sRGB"
						>
							<feFlood flood-opacity="0" result="BackgroundImageFix" />
							<feColorMatrix
								in="SourceAlpha"
								type="matrix"
								values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
								result="hardAlpha"
							/>
							<feOffset dy="4" />
							<feGaussianBlur stdDeviation="2" />
							<feComposite in2="hardAlpha" operator="out" />
							<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
							<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2512_2734" />
							<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2512_2734" result="shape" />
						</filter>
						<linearGradient
							id="paint0_linear_2512_2734"
							x1="-1.58404"
							y1="36.3062"
							x2="54.1611"
							y2="1.04521"
							gradientUnits="userSpaceOnUse"
						>
							<stop stop-color="#2D129A" />
							<stop offset="1" stop-color="#47BBFD" />
						</linearGradient>
					</defs>
				</svg>
			)
		},
		{
			name: t("Words.Settings"),
			// icon: settingsIcon,
			link: "/organization/settings",
			blur: blurOrNot("Settings"),
			expired: isExpired("Settings"),

			icon: (
				<svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 44 46" fill="none">
					<g filter="url(#filter0_d_2512_2712)">
						<mask
							id="mask0_2512_2712"
							style={{ maskType: "alpha" }}
							maskUnits="userSpaceOnUse"
							x="1"
							y="0"
							width="42"
							height="42"
						>
							<rect x="1" y="0.0664062" width="42" height="41.0537" fill="#D9D9D9" />
						</mask>
						<g mask="url(#mask0_2512_2712)">
							<path
								d="M17.1881 37.6958L16.4881 32.222C16.1089 32.0794 15.7516 31.9084 15.4162 31.7088C15.0808 31.5092 14.7527 31.2954 14.4318 31.0673L9.22559 33.2055L4.41309 25.0803L8.91934 21.7447C8.89017 21.5452 8.87559 21.3527 8.87559 21.1674V20.0128C8.87559 19.8275 8.89017 19.635 8.91934 19.4354L4.41309 16.0998L9.22559 7.97462L14.4318 10.1128C14.7527 9.88476 15.0881 9.67094 15.4381 9.47137C15.7881 9.27181 16.1381 9.10075 16.4881 8.9582L17.1881 3.48438H26.8131L27.5131 8.9582C27.8923 9.10075 28.2495 9.27181 28.585 9.47137C28.9204 9.67094 29.2485 9.88476 29.5693 10.1128L34.7756 7.97462L39.5881 16.0998L35.0818 19.4354C35.111 19.635 35.1256 19.8275 35.1256 20.0128V21.1674C35.1256 21.3527 35.0964 21.5452 35.0381 21.7447L39.5443 25.0803L34.7318 33.2055L29.5693 31.0673C29.2485 31.2954 28.9131 31.5092 28.5631 31.7088C28.2131 31.9084 27.8631 32.0794 27.5131 32.222L26.8131 37.6958H17.1881ZM20.2506 34.2746H23.7068L24.3193 29.7416C25.2235 29.5136 26.062 29.1786 26.835 28.7367C27.6079 28.2948 28.3152 27.7602 28.9568 27.133L33.2881 28.8864L34.9943 25.9784L31.2318 23.1987C31.3777 22.7996 31.4798 22.3791 31.5381 21.9372C31.5964 21.4953 31.6256 21.0462 31.6256 20.5901C31.6256 20.1339 31.5964 19.6849 31.5381 19.243C31.4798 18.8011 31.3777 18.3806 31.2318 17.9815L34.9943 15.2018L33.2881 12.2938L28.9568 14.0899C28.3152 13.4342 27.6079 12.8854 26.835 12.4435C26.062 12.0016 25.2235 11.6666 24.3193 11.4385L23.7506 6.90552H20.2943L19.6818 11.4385C18.7777 11.6666 17.9391 12.0016 17.1662 12.4435C16.3933 12.8854 15.686 13.4199 15.0443 14.0471L10.7131 12.2938L9.00684 15.2018L12.7693 17.9387C12.6235 18.3663 12.5214 18.794 12.4631 19.2216C12.4048 19.6493 12.3756 20.1054 12.3756 20.5901C12.3756 21.0462 12.4048 21.4881 12.4631 21.9158C12.5214 22.3434 12.6235 22.7711 12.7693 23.1987L9.00684 25.9784L10.7131 28.8864L15.0443 27.0903C15.686 27.746 16.3933 28.2948 17.1662 28.7367C17.9391 29.1786 18.7777 29.5136 19.6818 29.7416L20.2506 34.2746ZM22.0006 27.4324C22.4964 27.4324 22.912 27.2684 23.2475 26.9406C23.5829 26.6127 23.7506 26.2065 23.7506 25.7218C23.7506 25.2371 23.5829 24.8309 23.2475 24.503C22.912 24.1752 22.4964 24.0112 22.0006 24.0112C21.5048 24.0112 21.0891 24.1752 20.7537 24.503C20.4183 24.8309 20.2506 25.2371 20.2506 25.7218C20.2506 26.2065 20.4183 26.6127 20.7537 26.9406C21.0891 27.2684 21.5048 27.4324 22.0006 27.4324ZM20.2506 22.3007H23.7506V13.7478H20.2506V22.3007Z"
								fill="url(#paint0_linear_2512_2712)"
							/>
						</g>
					</g>
					<defs>
						<filter
							id="filter0_d_2512_2712"
							x="0.413086"
							y="3.48438"
							width="43.1748"
							height="42.2109"
							filterUnits="userSpaceOnUse"
							color-interpolation-filters="sRGB"
						>
							<feFlood flood-opacity="0" result="BackgroundImageFix" />
							<feColorMatrix
								in="SourceAlpha"
								type="matrix"
								values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
								result="hardAlpha"
							/>
							<feOffset dy="4" />
							<feGaussianBlur stdDeviation="2" />
							<feComposite in2="hardAlpha" operator="out" />
							<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
							<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2512_2712" />
							<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2512_2712" result="shape" />
						</filter>
						<linearGradient
							id="paint0_linear_2512_2712"
							x1="0.0783315"
							y1="33.1335"
							x2="53.1177"
							y2="13.1246"
							gradientUnits="userSpaceOnUse"
						>
							<stop stop-color="#2D129A" />
							<stop offset="1" stop-color="#47BBFD" />
						</linearGradient>
					</defs>
				</svg>
			)
		}
	];
	const firstQuickLink = quicklinks[0];
	const joyrideSteps = [
		{
			target: `.quicklink-${firstQuickLink.name.toLowerCase()}`, // Assuming each link has a unique name
			content: (
				<div>
					<h1 className="mb-2 text-2xl font-bold">Welcome to Somhako!</h1>
					<p>
						{srcLang === "ja"
							? "このツアーでは、Somhakoの使い方を紹介します。"
							: "This tour will guide you through how to use Somhako."}
					</p>
				</div>
			),
			placement: "bottom",
			disableBeacon: true,
			hideCloseButton: true,
			hideFooter: true,
			title: "Dashboard",
			spotlightClicks: true
		}
		// Add more steps as needed
	];
	useEffect(()=>{
		console.log(user[0]["intro"])
		console.log(role)
		if(user && user.length>0 ){
			console.log("ye hai itnro ki value",user[0]["intro"]);
			if(!user[0]["intro"] && isJoyrideCompleted){
				console.log("The intro is alreay completed!!","success")
			}
			else if(!user[0]["intro"] && !isJoyrideCompleted){
				completeJoyride();
				console.log("The intro is alreay completed but the store value was different!!","success")
			}
			else{
				showJoyride();
				console.log("Intro Starting","success")
			}
		}
		else{
			console.log("Something went wrong!!")
		}
	},[user])

	useEffect(() => {
		console.log("!!!", "cuser", currentUser);
	}, [currentUser]);
	// useEffect(() => {
	// 	if (!isJoyrideCompleted) {
	// 		showJoyride();
	// 	}
	// }, [isJoyrideCompleted, showJoyride]);
	console.log(isJoyrideCompleted)



	//inbox
	
	const router = useRouter();
	const { data: session } = useSession();
	const [token, settoken] = useState("");

	useEffect(() => {
		if (session) {
			settoken(session.accessToken as string);
		} else if (!session) {
			settoken("");
		}
	}, [session]);

	const axiosInstanceAuth2 = axiosInstanceAuth(token);

	useEffect(() => {
		if (token && token.length > 0 && !currentUser.is_expired) {
			console.log("&&&", "token", token);
			const rws = new ReconnectingWebSocket(
				process.env.NODE_ENV === "production"
					? `wss://atsapi2.somhako.com/ws/chat/?access_token=${token}`
					: `ws://127.0.0.1:8000/ws/chat/?access_token=${token}`
			);

			rws.addEventListener("open", () => {
				toastcomp("Login success", "success");
			});


		}
	}, [token]);



	return (
		<>
			<Head>
				<title>{srcLang === "ja" ? "ショートカット" : "Quicklinks"}</title>
			</Head>
			<main className="py-4">
				<div className="md:px-26 mx-auto w-full max-w-[1920px] px-4 lg:px-40">
					<div className="rounded-normal bg-white p-6 dark:bg-gray-800">
						<div className="mx-auto w-full max-w-[1100px]">
							<div className="-mx-4 flex flex-wrap items-center">
								{quicklinks.map((links, i) => (
									<div
										key={i}
										className={`mb-8 w-full px-4 md:max-w-[50%] xl:max-w-[33.3333%] quicklink-${links.name.toLowerCase()}`}
									>
										<Link
											href={links.blur || links.expired ? "/organization/settings/pricing" : links.link}
											className="relative flex w-full items-center overflow-hidden rounded-normal bg-white p-6 shadow-normal hover:bg-lightBlue dark:bg-gray-700 dark:hover:bg-gray-600"
										>
											<div className="mr-4 flex h-[45px] w-[45px] items-center justify-center rounded bg-[#1D8AAD26] p-2">
												{links.icon}
												{/* <Image src={links.icon} alt={links.name} width={30} height={30} /> */}
											</div>
											<span className="text-lg font-bold">{links.name}</span>
											{links.expired && (
												<>
													<div className="group absolute left-0 top-0 flex h-full w-full items-center justify-center bg-red-400/[0.1] backdrop-blur-[0.8px] transition hover:bg-red-300/[0.2] hover:backdrop-blur-[2px]">
														<span className="hidden cursor-pointer items-center gap-2 rounded-md bg-red-200 p-2 duration-100 group-hover:flex">
															<i className="fa-solid fa-business-time text-red-900"></i>
															<span className="pr-1 text-sm font-bold text-red-900">
																{srcLang === "ja" ? "プランを購入する" : "Buy Plan"}
															</span>
														</span>
														{/* <div className="mx-auto w-max max-w-[400px] rounded-normal px-6 py-2 text-center text-white transition hover:scale-[1.05]">
															<h3 className="mb-1 text-lg font-extrabold text-white">
																{srcLang === "ja" ? "プラン失効" : "Plan Expired"}
															</h3>
															<Link
																href={"/organization/settings/pricing"}
																className="inline-block rounded bg-gradient-to-b from-gradLightBlue to-gradDarkBlue p-1 text-[10px] text-white hover:from-gradDarkBlue hover:to-gradDarkBlue"
															>
																{srcLang === "ja" ? "購入" : "Purchase"}
															</Link>
														</div> */}
													</div>
												</>
											)}
											{links.blur && !links.expired && (
												<>
													<div className="group absolute left-0 top-0 flex h-full w-full items-center justify-center bg-blue-200/[0.3] backdrop-blur-[0.8px] transition hover:bg-blue-300/[0.2] hover:backdrop-blur-[2px]">
														<span className="hidden cursor-pointer items-center gap-2 rounded-md bg-gradLightBlue p-2 duration-100 group-hover:flex">
															<i className="fa-solid fa-business-time text-blue-900"></i>
															<span className="pr-1 text-sm font-bold text-blue-900">
																{srcLang === "ja" ? "プランを購入する" : "Upgrade Plan"}
															</span>
														</span>
													</div>
													{/* <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center bg-[rgba(0,0,0,0.3)] backdrop-blur-sm">
														<div className="mx-auto w-max max-w-[400px] rounded-normal px-6 py-2 text-center text-white transition hover:scale-[1.05]">
															<h3 className="mb-1 text-lg font-extrabold text-white">
																{srcLang === "ja" ? "プランをアップグレード" : "Go Premium"}
															</h3>
															<Link
																href={"/organization/settings/pricing"}
																className="inline-block rounded bg-gradient-to-b from-gradLightBlue to-gradDarkBlue p-1 text-[10px] text-white hover:from-gradDarkBlue hover:to-gradDarkBlue"
															>
																{srcLang === "ja" ? "アップグレード" : "Upgrade"}
															</Link>
														</div>
													</div> */}
												</>
											)}
										</Link>
									</div>
								))}
							</div>
							{/* <button onClick={() => toastcomp("Test12", "success")}>Toast Check</button> */}
						</div>
					</div>
				</div>
				<Joyride
					steps={joyrideSteps}
					run={shouldShowJoyride}
					continuous={true}
					styles={{
						options: {
							arrowColor: "#0066ff", // Set to primary color
							backgroundColor: "#F5F8FA", // Set to lightBlue
							overlayColor: "rgba(0, 0, 0, 0.4)", // Adjusted to match your styling
							primaryColor: "#0066ff", // Set to primary color
							textColor: "#3358c5", // Set to secondary color
							// width: 100, // Adjust as needed
							zIndex: 1000 // Set as needed
						}
					}}
					showProgress={true}
					showSkipButton={false}
					callback={(data: any) => {
						const { action } = data;
						if (action === "close") {
							completeJoyride(); // Mark the tour as completed when the user closes it
						}
					}}
				/>
			
			</main>
		</>
	);
}

export async function getStaticProps({ context, locale }: any) {
	const translations = await serverSideTranslations(locale, ["common"]);
	return {
		props: {
			...translations
		}
	};
}
