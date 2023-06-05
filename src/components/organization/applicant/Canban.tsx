import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import React from "react";
import { Board } from "./Board";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { addActivityLog, addNotifyApplicantLog, addNotifyLog, axiosInstanceAuth } from "@/pages/api/axiosApi";
import toastcomp from "@/components/toast";
import { useLangStore, useNotificationStore, useUserStore } from "@/utils/code";
import moment from "moment";

function Canban(props: any) {
	const srcLang = useLangStore((state: { lang: any }) => state.lang);
	const router = useRouter();
	let _columnId = 0;
	let _cardId = 0;
	var initialColumns = [
		srcLang === 'ja' ? '応募前' : 'Sourced',
		srcLang === 'ja' ? 'レビュー' : 'Review',
		srcLang === 'ja' ? '面接' : 'Interview',
		srcLang === 'ja' ? '面接通過' : 'Shortlisted',
		srcLang === 'ja' ? 'オファー' : 'Offer',
		srcLang === 'ja' ? '入社' : 'Hired',
		'Rejected',
	].map(
		(title, i) => ({
			id: _columnId++,
			title,
			cardIds: []
		})
	);

	const [columns, setcolumns] = useState([]);
	const [cards, setcards] = useState([]);
	const [r, setr] = useState(0);
	const { applicantlist } = props;
	const { setcardarefid } = props;
	const { setcardstatus } = props;

	const toggleLoadMode = useNotificationStore((state: { toggleLoadMode: any }) => state.toggleLoadMode);

	useEffect(() => {
		let arr = cards;
		for (let i = 0; i < applicantlist.length; i++) {
			const abc = arr.some((item) => item.arefid === applicantlist[i]["arefid"]);
			if (abc === false) {
				let dic = {
					id: ++_cardId,
					title: `Card ${_cardId}`,
					arefid: `${applicantlist[i]["arefid"]}`,
					type: `${applicantlist[i]["type"]}`
				};
				arr.push(dic);
				for (let j = 0; j < initialColumns.length; j++) {
					if (initialColumns[j]["title"] === applicantlist[i]["status"]) {
						initialColumns[j]["cardIds"].push(_cardId);
					}
				}
			}
		}
		setcards(arr);
		setcolumns(initialColumns);
		setr(1);
	}, [applicantlist]);

	useEffect(() => {
		console.log("------------");
		console.log("applicantlist", applicantlist);
		console.log("cards", cards);
		console.log("columns", columns);
	}, [cards, columns]);

	const userState = useUserStore((state: { user: any }) => state.user);

	const axiosInstanceAuth2 = axiosInstanceAuth(props.token);
	async function chnageStatus(status: string | Blob, arefid: any, type: any) {
		const fdata = new FormData();
		fdata.append("status", status);
		let url = "";
		if (type === "carrier") {
			url = `/job/applicant/${arefid}/update/`;
		}
		if (type === "vendor") {
			url = `/job/vapplicant/${arefid}/update/`;
		}
		await axiosInstanceAuth2
			.put(url, fdata)
			.then((res) => {
				toastcomp("Status Changed", "success");
				let aname = `Applicant ${arefid} status is change to ${status} by ${userState[0]["name"]} (${
					userState[0]["email"]
				}) at ${moment().format("MMMM Do YYYY, h:mm:ss a")}`;

				addActivityLog(axiosInstanceAuth2, aname);

				let title = `Applicant has been shifted to ${status} By ${userState[0]["name"]} (${userState[0]["email"]})`;

				if (type === "carrier") {
					addNotifyApplicantLog(axiosInstanceAuth2, title, "Applicant", arefid);
				}
				if (type === "vendor") {
					addNotifyLog(axiosInstanceAuth2, title, "Vendor Applicant");
				}

				toggleLoadMode(true);

				setcardarefid(arefid);
				setcardstatus(status);
				// setrefersh1(1);
			})
			.catch((err) => {
				console.log(err);
				toastcomp("Status Not Change", "error");
				setcardarefid("");
				setcardstatus("");
				// setrefersh1(1);
			});
	}

	const moveCard = (cardId, destColumnId, index) => {
		setcolumns((prevColumns) => {
			const newColumns = prevColumns.map((column) => ({
				...column,
				cardIds: _.flowRight(
					// 2) If this is the destination column, insert the cardId.
					(ids) => (column.id === destColumnId ? [...ids.slice(0, index), cardId, ...ids.slice(index)] : ids),
					// 1) Remove the cardId for all columns
					(ids) => ids.filter((id) => id !== cardId)
				)(column.cardIds)
			}));
			return newColumns;
		});

		for (let i = 0; i < columns.length; i++) {
			if (columns[i]["cardIds"].includes(cardId)) {
				if (columns[i]["id"] !== destColumnId) {
					for (let k = 0; k < columns.length; k++) {
						if (columns[k]["id"] === destColumnId) {
							for (let j = 0; j < cards.length; j++) {
								if (cards[j]["id"] === cardId) {
									console.log("*", "arefid", cards[j]["arefid"]);
									chnageStatus(columns[k]["title"], cards[j]["arefid"], cards[j]["type"]);
								}
							}
						}
					}
					console.log("*", "column change");
				} else {
					console.log("*", "column not change");
				}
			}
		}
	};

	return <>{r > 0 && <Board columns={columns} cards={cards} applicantlist={applicantlist} moveCard={moveCard} />}</>;
}

export default DragDropContext(HTML5Backend)(Canban);
