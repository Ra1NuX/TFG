import { updateEmail, updatePhoneNumber, updateProfile } from "firebase/auth";
import { ErrorMessage, useField } from "formik"
import React, { forwardRef, Fragment, useEffect, useRef, useState } from "react";
import { BsCheck, BsCheckCircleFill, BsChevronExpand, BsPencilFill } from "react-icons/bs";
import { auth } from "../firebase";
import es from "date-fns/locale/es";

import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Listbox, Transition } from "@headlessui/react";
import { setHours, setMinutes } from "date-fns";

registerLocale("es", es)


interface InputProps extends React.ComponentPropsWithRef<"input"> {
	label?: string;
	type?: string;
	onEdit?: (value: any) => void;
	children?: React.ReactNode
	value?: string;
	dateValue?: Date;
	items?: Array<{ name: string }>;
	ref?: React.Ref<HTMLInputElement>;
}


export default function Input({ name, label, placeholder, required, ...props }: InputProps) {
	if (typeof name !== "string") throw new Error("Input expects a name property")
	const [field, meta, helpers] = useField(name);
	return <>
		<label>
			{typeof label === "string" && <>
				<span className="ml-3 text-sm md:hidden">{label}{required && <span className="text-red-700 font-bold"> *</span>}</span>
			</>}
			<input {...props}  {...field} placeholder={label} className={`focus:scale-105 focus:shadow-[0 0 10px 10px black] ease-in-out duration-200 shadow-md border-b-4 w-full h-full p-2 rounded py-2 focus-within:outline-none ${meta.touched && meta.error ?
				"border-red-600 text-red-600" : "text-neutral-700 text-bold border-blue-mid"}`} />
		</label>
		<div className="min-h-[24px]">
			<ErrorMessage name={name}>
				{msg => <span className="text-red-600 text-sm">{msg}</span>}
			</ErrorMessage>
		</div>
	</>
}

Input.TextArea = function ({ name, label, placeholder, required, ...props }: InputProps) {
	if (typeof name !== "string") throw new Error("Input expects a name property")
	const [field, meta, helpers] = useField(name);
	return <>
		<label>
			{typeof label === "string" && <>
				<span className="ml-3 text-sm md:hidden">{label}{required && <span className="text-red-700 font-bold"> *</span>}</span>
			</>}
			<textarea {...field} placeholder={label} className={`focus:scale-105 focus:shadow-[0 0 10px 10px black] ease-in-out duration-200 shadow-md border-b-4 w-full p-2 rounded py-2 focus-within:outline-none ${meta.touched && meta.error ?
				"border-red-600 text-red-600" : "text-neutral-700 text-bold border-blue-mid"}`} />
		</label>
		<div className="min-h-[24px]">
			<ErrorMessage name={name}>
				{msg => <span className="text-red-600 text-sm">{msg}</span>}
			</ErrorMessage>
		</div>
	</>
}

Input.Date = function Date2({ name, label, placeholder, required, ...props }: InputProps) {
	if (typeof name !== "string") throw new Error("Input expects a name property")
	const [field, meta, helpers] = useField(name);

	const [startDate, setStartDate] = useState(
		setHours(setMinutes(new Date(field.value!), 0), 0)
	);

	const handleChange = (date: any) => {
		setStartDate(date);
		helpers.setValue(date)
	}

	return <>
		<label>
			{typeof label === "string" && <>
				<span className="ml-3 text-sm md:hidden">{label}{required && <span className="text-red-700 font-bold"> *</span>}</span>
			</>}
			<DatePicker
				locale='es'
				showTimeSelect
				dateFormat={"MMMM d, yyyy h:mm aa"}
				className={`!bg-white w-full dark: pr-8 shadow-md border-b-4 border-blue-mid h-full p-2 rounded py-2 focus-within:outline-none overflow-y-clip focus-within:text-black ${meta.touched && meta.error ?
					"border-red-600 text-red-600" : "text-neutral-700 text-bold border-blue-mid"}`}
				selected={startDate}
				onChange={(date: Date) => handleChange(date)} />
		</label>
		<div className="min-h-[24px]">
			<ErrorMessage name={name}>
				{msg => <span className="text-red-600 text-sm">{msg}</span>}
			</ErrorMessage>
		</div>
	</>
}

Input.Simple = React.forwardRef(({label, ...props}:InputProps , ref:any) => {
	return <div className="relative my-2">
		<div className="flex flex-col relative h-full">
			{typeof label === "string" && <>
				<span className={`absolute top-[50%] -translate-y-[150%] transition-transform  ease-linear ml-3 text-sm text-ellipsis overflow-hidden whitespace-nowrap`}>{label}</span>
			</>}
			<input ref={ref} className="disabled:bg-white pr-8 shadow-md border-b-2 border-blue-mid h-full p-2 rounded pt-2 pb-1 focus-within:outline-none overflow-y-clip focus-within:text-black" disabled {...props} />
		</div>
	</div>
})

Input.ListBox = function ListBox({ label, required, items = [] }: InputProps) {
	const [selected, setSelected] = useState(items[0])
	console.log(selected)
	return (
		<div className="relative">
			<Listbox value={selected} onChange={setSelected}>
				<div className="relative mt-1">
					<Listbox.Button className="relative w-full border-b-4 border-blue-mid cursor-default rounded bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-blue-mid focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-light sm:text-sm">
						<span className="block truncate">{selected.name}</span>
						<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
							<BsChevronExpand />
						</span>
					</Listbox.Button>
					<Transition
						as={Fragment}
						leave="transition ease-in duration-100"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<Listbox.Options className="mt-1 max-h-60 rounded rounded-t-none bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm absolute w-full z-50">
							{items.map((item, id) => (
								<Listbox.Option
									key={id}
									className={({ active }) =>
										`${active ? "bg-blue-light" : "bg-white"} text-blue-dark hover:bg-blue-light hover:text-white py-2 relative cursor-pointer`
									}
									value={item}
								>
									{({ selected }) => (
										<>
											<span
												className={`block truncate pl-8 ${selected ? 'font-medium' : 'font-normal'
													}`}
											>
												{item.name}
											</span>
											{selected && (
												<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-dark">
													<BsCheck size={12} />
												</span>
											)}
										</>
									)}
								</Listbox.Option>
							))}
						</Listbox.Options>
					</Transition>
				</div>
			</Listbox>
		</div>
	)
}

Input.DropDown = function DropDown({ label, required, items = [], name, }: InputProps) {
	const [selected, setSelected] = useState({ name: label })
	if (typeof name !== "string") throw new Error("Input expects a name property")
	const [field, meta, helpers] = useField(name);

	const handleChange = (e: any) => {
		setSelected(e)
		helpers.setValue(e)
	}


	return (<>
		<div className="relative">
			<Listbox value={selected} onChange={handleChange}>
				<div className="relative mt-1">
					<Listbox.Button onClick={() => helpers.setTouched(true)} className={`relative w-full border-b-4 border-blue-mid cursor-default rounded bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-blue-mid focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-light sm:text-sm ${meta.touched && meta.error ?
				"border-red-600 text-red-600" : "text-neutral-700 text-bold border-blue-mid"}`}>
						<span className="block truncate">{selected.name}</span>
						<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
							<BsChevronExpand />
						</span>
					</Listbox.Button>
					<Transition
						as={Fragment}
						leave="transition ease-in duration-100"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<Listbox.Options className="mt-1 max-h-60 rounded rounded-t-none bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm absolute w-full z-50">
							{items.map((item, id) => (
								<Listbox.Option
									key={id}
									className={({ active }) =>
										`${active ? "bg-blue-light" : "bg-white"} text-blue-dark hover:bg-blue-light hover:text-white py-2 relative cursor-pointer`
									}
									value={item}
								>
									{({ selected }) => (
										<>
											<span
												className={`block truncate pl-8 ${selected ? 'font-medium' : 'font-normal'
													}`}
											>
												{item.name}
											</span>
											{selected && (
												<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-dark">
													<BsCheck size={12} />
												</span>
											)}
										</>
									)}
								</Listbox.Option>
							))}
						</Listbox.Options>
					</Transition>
				</div>
			</Listbox>
		</div>
		<div className="min-h-[24px]">
			<ErrorMessage name={name}>
				{msg => <span className="text-red-600 text-sm">{msg}</span>}
			</ErrorMessage>
		</div>
	</>
	)
}


Input.Editable = function Editable({ label, type, placeholder, onEdit = () => null, value, dateValue, ...props }: InputProps) {
	const inputRef = useRef<HTMLInputElement>(null)
	const [isEditing, setIsEditing] = useState(false)

	const [currentValue, setValue] = useState<string | undefined>(value)
	const [startDate, setStartDate] = useState<Date | undefined>(dateValue);


	const handleOnClickBtn = () => {
		setIsEditing(true)
	}

	const handleBlur = () => {

		onEdit(inputRef!.current!.value);
		setIsEditing(false)

	}

	const handleDateChange = (date: Date) => {
		onEdit(date)
		setStartDate(date)
	}


	useEffect(() => {
		if (!inputRef.current) return
		if (!isEditing) {
			inputRef.current.disabled = true;
		}
		else {
			inputRef.current.disabled = false;
			inputRef.current.focus()
		}
	}, [isEditing])



	return type == "date" ?
		<div className="relative my-2">
			<div className="flex flex-col relative h-full">
				{typeof label === "string" && <>
					<span className={`absolute z-[100] top-[50%] ${(!isEditing && !startDate) ? "-translate-y-1/2" : "-translate-y-[150%]"}  transition-transform  ease-linear ml-3 text-sm text-ellipsis overflow-hidden whitespace-nowrap`}>{label}</span>
				</>}
				<DatePicker locale='es' dateFormat={"dd/MM/yyyy"} className="disabled:bg-white dark:!bg-gray-500 w-full pr-8 shadow-md border-b-2 border-blue-mid h-full p-2 rounded py-2 focus-within:outline-none overflow-y-clip focus-within:text-black" selected={startDate} onChange={(date: Date) => handleDateChange(date)} />
			</div>
		</div>
		:
		<div className="relative my-2">
			<div className="flex flex-col relative h-full">
				{typeof label === "string" && <>
					<span className={`absolute top-[50%] ${(!isEditing && !currentValue) ? "-translate-y-1/2" : "-translate-y-[150%]"}  transition-transform  ease-linear ml-3 text-sm text-ellipsis overflow-hidden whitespace-nowrap`}>{label}</span>
				</>}
				<button onClick={() => handleOnClickBtn()} className="border-red-500 absolute inline right-2 bottom-4"><BsPencilFill size={13} className={isEditing ? "hidden" : "block"} /></button>
				<input ref={inputRef} value={currentValue} onChange={(e) => setValue(e.currentTarget.value)} onBlur={() => handleBlur()} className="disabled:bg-white pr-8 shadow-md border-b-2 border-blue-mid h-full p-2 rounded py-2 focus-within:outline-none overflow-y-clip focus-within:text-black truncate overflow-hidden" disabled {...props} />
			</div>
		</div>
}