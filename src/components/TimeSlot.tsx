import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import userImg from "/public/images/user-image.png";
import FormField from "./FormField";
import Button from "./Button";
import moment from "moment";
import { useCalStore } from "@/utils/code";
import { axiosInstance } from "@/utils";
import toastcomp from "./toast";

export default function TImeSlot({ cardarefid, axiosInstanceAuth2, setIsCalendarOpen }: any) {
	const [eventList, setEventList] = useState<Array<any>>([]);
	const [currentDayEvents, setCurrentDayEvents] = useState<Array<any>>([]);
	const integration = useCalStore((state: { integration: any }) => state.integration);
	const setIntegration = useCalStore((state: { setIntegration: any }) => state.setIntegration);

	const getEventsList = useCallback(
		async () =>
			await axiosInstance.next_api
				.post("/api/integrations/gcal/getEvents", {
					googleCalendarIntegration: integration[0]
				})
				.then((response) => response.data)
				.then((data) => {
					setEventList(data.items);
					// console.log("$", data.items);
				})
				.catch((err) => {
					// console.log("$", err);
				}),
		[integration]
	);

	useEffect(() => {
		integration && getEventsList();
		if (integration && integration.length > 0) {
			getEventsList();
		}
	}, [getEventsList, integration]);

	const [date1, setdate1] = useState("");
	const [time1, settime1] = useState("");
	const [date2, setdate2] = useState("");
	const [time2, settime2] = useState("");
	const [date3, setdate3] = useState("");
	const [time3, settime3] = useState("");
	const [date4, setdate4] = useState("");
	const [time4, settime4] = useState("");
	const [date5, setdate5] = useState("");
	const [time5, settime5] = useState("");
	const [interDuration, setInterDuration] = useState("15");

	function checkDis() {
		return (
			date1.length > 0 &&
			time1.length > 0 &&
			date2.length > 0 &&
			time2.length > 0 &&
			date3.length > 0 &&
			time3.length > 0 &&
			date4.length > 0 &&
			time4.length > 0 &&
			date5.length > 0 &&
			time5.length > 0 &&
			interDuration.length > 0
		);
	}

	const options = [
		"00:00",
		"01:00",
		"02:00",
		"03:00",
		"04:00",
		"05:00",
		"06:00",
		"07:00",
		"08:00",
		"09:00",
		"10:00",
		"11:00",
		"12:00",
		"13:00",
		"14:00",
		"15:00",
		"16:00",
		"17:00",
		"18:00",
		"19:00",
		"20:00",
		"21:00",
		"22:00",
		"23:00"
	];

	function disCheckTime(param1: any) {
		return param1.length > 0;
	}

	async function createSlot() {
		const fd = new FormData();
		fd.append("slot1", moment(date1 + " " + time1).format("YYYY-MM-DD HH:mm"));
		fd.append("slot2", moment(date2 + " " + time2).format("YYYY-MM-DD HH:mm"));
		fd.append("slot3", moment(date3 + " " + time3).format("YYYY-MM-DD HH:mm"));
		fd.append("slot4", moment(date4 + " " + time4).format("YYYY-MM-DD HH:mm"));
		fd.append("slot5", moment(date5 + " " + time5).format("YYYY-MM-DD HH:mm"));
		fd.append("duration", interDuration);
		axiosInstanceAuth2
			.post(`/job/slot/create/${cardarefid}/`, fd)
			.then((res) => {
				toastcomp("Slot Created Successfully", "success");
				setIsCalendarOpen(false);
			})
			.catch((err) => {
				toastcomp("Slot Not Created", "error");
				console.log("$", "slot error", err);
				setIsCalendarOpen(false);
			});
	}

	function giveTimeOptions(dateParam: any) {
		let basearr = [
			"00:00",
			"01:00",
			"02:00",
			"03:00",
			"04:00",
			"05:00",
			"06:00",
			"07:00",
			"08:00",
			"09:00",
			"10:00",
			"11:00",
			"12:00",
			"13:00",
			"14:00",
			"15:00",
			"16:00",
			"17:00",
			"18:00",
			"19:00",
			"20:00",
			"21:00",
			"22:00",
			"23:00"
		];

		if (dateParam && dateParam.length > 0) {
			let currentdayEvent = [];
			let dateParam2 = moment(dateParam);
			for (let i = 0; i < eventList.length; i++) {
				if (
					dateParam2.isSame(moment(eventList[i]["start"]["dateTime"]), "day") &&
					dateParam2.isSame(moment(eventList[i]["end"]["dateTime"]), "day")
				) {
					currentdayEvent.push(eventList[i]);
				}
			}
			// console.log("currentdayEvent", "$", currentdayEvent);

			let timeSlots = [];
			for (let i = 0; i < currentdayEvent.length; i++) {
				const startMoment = moment(currentdayEvent[i]["start"]["dateTime"]);
				const endMoment = moment(currentdayEvent[i]["end"]["dateTime"]);

				// console.log("MatchDay T1:1", "$", startMoment.format("HH:mm A"));

				// Round the start time down to the nearest hour
				startMoment.startOf("hour");

				// console.log("MatchDay T1:1", "$", startMoment.startOf("hour").format("HH:mm A"));

				// Round the end time up to the nearest hour
				endMoment.endOf("hour");

				// Generate time slots
				while (startMoment.isBefore(endMoment)) {
					const timeSlot = startMoment.format("HH:mm");
					timeSlots.push(timeSlot);

					// Add 1 hour to the current time slot
					startMoment.add(1, "hour");
				}
			}

			// console.log(
			// 	"$",
			// 	"final",
			// 	basearr.filter((element) => !timeSlots.includes(element))
			// );
			return basearr.filter((element) => !timeSlots.includes(element));
		}
		return basearr;
	}

	return (
		<>
			<div>
				<div className="flex gap-2 pt-5">
					<div className="w-[50%]">
						<h2 className="font-bold">Slot 1 Date</h2>
						<input
							type="date"
							value={date1}
							onChange={(e) => setdate1(e.target.value)}
							className={
								`min-h-[45px] w-full rounded-normal border border-borderColor p-3 text-sm dark:border-gray-600 dark:bg-gray-700` +
								" "
							}
							min={moment().format("YYYY-MM-DD")}
						/>
					</div>
					<div className="w-[50%]">
						<h2 className="font-bold">Slot 1 Time</h2>
						<FormField
							fieldType="select2"
							options={giveTimeOptions(date1)}
							value={time1}
							handleChange={settime1}
							singleSelect
							placeholder="Start Time"
							readOnly={!disCheckTime(date1)}
						/>
					</div>
				</div>
				<div className="flex  gap-2 pt-5">
					<div className="w-[50%]">
						<h2 className="font-bold">Slot 2 Date</h2>
						<input
							type="date"
							value={date2}
							onChange={(e) => setdate2(e.target.value)}
							className={
								`min-h-[45px] w-full rounded-normal border border-borderColor p-3 text-sm dark:border-gray-600 dark:bg-gray-700` +
								" "
							}
							min={moment().format("YYYY-MM-DD")}
						/>
					</div>
					<div className="w-[50%]">
						<h2 className="font-bold">Slot 2 Time</h2>
						<FormField
							fieldType="select2"
							options={options}
							value={time2}
							handleChange={settime2}
							singleSelect
							placeholder="Start Time"
							readOnly={!disCheckTime(date2)}
						/>
					</div>
				</div>
				<div className="flex  gap-2 pt-5">
					<div className="w-[50%]">
						<h2 className="font-bold">Slot 3 Date</h2>
						<input
							type="date"
							value={date3}
							onChange={(e) => setdate3(e.target.value)}
							className={
								`min-h-[45px] w-full rounded-normal border border-borderColor p-3 text-sm dark:border-gray-600 dark:bg-gray-700` +
								" "
							}
							min={moment().format("YYYY-MM-DD")}
						/>
					</div>
					<div className="w-[50%]">
						<h2 className="font-bold">Slot 3 Time</h2>
						<FormField
							fieldType="select2"
							options={options}
							value={time3}
							handleChange={settime3}
							singleSelect
							placeholder="Start Time"
							readOnly={!disCheckTime(date3)}
						/>
					</div>
				</div>
				<div className="flex  gap-2 pt-5">
					<div className="w-[50%]">
						<h2 className="font-bold">Slot 4 Date</h2>
						<input
							type="date"
							value={date4}
							onChange={(e) => setdate4(e.target.value)}
							className={
								`min-h-[45px] w-full rounded-normal border border-borderColor p-3 text-sm dark:border-gray-600 dark:bg-gray-700` +
								" "
							}
							min={moment().format("YYYY-MM-DD")}
						/>
					</div>
					<div className="w-[50%]">
						<h2 className="font-bold">Slot 4 Time</h2>
						<FormField
							fieldType="select2"
							options={options}
							value={time4}
							handleChange={settime4}
							singleSelect
							placeholder="Start Time"
							readOnly={!disCheckTime(date4)}
						/>
					</div>
				</div>
				<div className="flex  gap-2 pt-5">
					<div className="w-[50%]">
						<h2 className="font-bold">Slot 5 Date</h2>
						<input
							type="date"
							value={date5}
							onChange={(e) => setdate5(e.target.value)}
							className={
								`min-h-[45px] w-full rounded-normal border border-borderColor p-3 text-sm dark:border-gray-600 dark:bg-gray-700` +
								" "
							}
							min={moment().format("YYYY-MM-DD")}
						/>
					</div>
					<div className="w-[50%]">
						<h2 className="font-bold">Slot 5 Time</h2>
						<FormField
							fieldType="select2"
							options={options}
							value={time5}
							handleChange={settime5}
							singleSelect
							placeholder="Start Time"
							readOnly={!disCheckTime(date5)}
						/>
					</div>
				</div>
			</div>

			<div className="mx-[-10px] flex flex-wrap pt-5">
				<div className="mb-4 w-full px-[10px]">
					<label className="mb-1 inline-block font-bold">Interview Duration</label>
					<div className="relative flex w-[100%] overflow-hidden rounded-normal border dark:border-gray-600">
						<label
							htmlFor="min15"
							className={
								"w-full cursor-pointer border-r  py-3 text-center  text-sm text-darkGray last:border-r-0 dark:border-gray-600 dark:text-gray-400" +
								" " +
								(interDuration == "15" ? "bg-gradDarkBlue text-white dark:text-white" : "")
							}
						>
							15 min
							<input
								type="radio"
								name="interDuration"
								id="min15"
								className="hidden"
								value={"15"}
								onChange={(e) => setInterDuration(e.target.value)}
							/>
						</label>
						<label
							htmlFor="min30"
							className={
								"w-full cursor-pointer border-r  py-3 text-center  text-sm text-darkGray last:border-r-0 dark:border-gray-600 dark:text-gray-400" +
								" " +
								(interDuration == "30" ? "bg-gradDarkBlue text-white dark:text-white" : "")
							}
						>
							30 min
							<input
								type="radio"
								name="interDuration"
								id="min30"
								className="hidden"
								value={"30"}
								onChange={(e) => setInterDuration(e.target.value)}
							/>
						</label>
						<label
							htmlFor="min45"
							className={
								"w-full cursor-pointer border-r py-3 text-center  text-sm text-darkGray last:border-r-0 dark:border-gray-600 dark:text-gray-400" +
								" " +
								(interDuration == "45" ? "bg-gradDarkBlue text-white dark:text-white" : "")
							}
						>
							45 min
							<input
								type="radio"
								name="interDuration"
								id="min45"
								className="hidden"
								value={"45"}
								onChange={(e) => setInterDuration(e.target.value)}
							/>
						</label>
						<label
							htmlFor="min60"
							className={
								"w-full cursor-pointer border-r py-3 text-center text-sm text-darkGray last:border-r-0 dark:border-gray-600 dark:text-gray-400" +
								" " +
								(interDuration == "60" ? "bg-gradDarkBlue text-white dark:text-white" : "")
							}
						>
							60 min
							<input
								type="radio"
								name="interDuration"
								id="min60"
								className="hidden"
								value={"60"}
								onChange={(e) => setInterDuration(e.target.value)}
							/>
						</label>
					</div>
				</div>
			</div>

			{/* <br /> */}
			<div className="pt-5 text-center">
				<Button
					btnStyle=""
					btnType="button"
					label="Generate Interview Call"
					disabled={!checkDis()}
					handleClick={createSlot}
				/>
			</div>
			{/* <div>
				{availableTimeSlots.map((timeSlot) => (
					<label key={timeSlot}>
						<input
							type="checkbox"
							checked={selectedTimeSlots.includes(timeSlot)}
							onChange={() => handleTimeSlotSelection(timeSlot)}
						/>
						{timeSlot}
					</label>
				))}
			</div>
			<div>
				<label>
					Time Duration:
					<input type="text" value={timeDuration} onChange={handleTimeDurationChange} />
				</label>
			</div>
			<button disabled={selectedTimeSlots.length !== 5 || timeDuration === ""} onClick={handleSubmit}>
				Submit
			</button> */}
		</>
	);
}
