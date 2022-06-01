import { updateEmail, updatePhoneNumber, updateProfile } from "firebase/auth";
import { ErrorMessage, useField } from "formik"
import { useEffect, useRef, useState } from "react";
import { BsPencilFill } from "react-icons/bs";
import { auth } from "../firebase";

enum InputType {
	email = "email",
	username = "displayName",
}

interface InputProps extends React.ComponentPropsWithoutRef<"input"> {
	label?: string;
	type?: InputType;
	children?: React.ReactNode
}


export default function Input({ name, label, placeholder, required, ...props }: InputProps) {
	if (typeof name !== "string") throw new Error("Input expects a name property")
	const [field, meta, helpers] = useField(name);
	return <>
		<label>
			{typeof label === "string" && <>
				<span className="ml-3 text-sm md:hidden">{label}{required && <span className="text-red-700 font-bold"> *</span>}</span>
			</>}
			<input {...props} {...field} placeholder={label} className={`focus:scale-105 focus:shadow-[0 0 10px 10px black] ease-in-out duration-200 shadow-md border-b-4 w-full h-full p-2 rounded py-2 focus-within:outline-none ${meta.touched && meta.error ?
				"border-red-600 text-red-600" : "text-neutral-700 text-bold border-blue-mid"}`} />
		</label>
		<div className="min-h-[24px]">
			<ErrorMessage name={name}>
				{msg => <span className="text-red-600 text-sm">{msg}</span>}
			</ErrorMessage>
		</div>
	</>
}

Input.Editable = function Editable({ label, type, placeholder, ...props }: InputProps) {

	const inputRef = useRef<HTMLInputElement>(null)
	const [isEditing, setIsEditing] = useState(false)
	const [value, setValue] = useState(props.value)

	const handleOnClickBtn = () => {
		setIsEditing(true)
	}

	const handleBlur = () => {
		setValue(inputRef!.current!.value)
		setIsEditing(false)
	}


	useEffect(() => {
		if (!inputRef.current) return
		if (!isEditing) {
			console.log('no is edditing')
			inputRef.current.disabled = true;
		}
		else {
			console.log("focus")
			inputRef.current.disabled = false;
			inputRef.current.focus()


		}
	}, [isEditing])



	return <div className="relative my-2">
		<div className="flex flex-col relative h-full">
			{typeof label === "string" && <>
				<span className={`absolute top-[50%] ${(!isEditing && !value) ? "-translate-y-1/2" : "-translate-y-[150%]"}  transition-transform  ease-linear ml-3 text-sm text-ellipsis overflow-hidden whitespace-nowrap`}>{label}</span>
			</>}
			<button onClick={() => handleOnClickBtn()} className="border-red-500 absolute inline right-2 bottom-4"><BsPencilFill size={13} className={isEditing? "hidden" : "block"}/></button>
			<input ref={inputRef} onBlur={() => handleBlur()} className="disabled:bg-white pr-8 shadow-md border-b-2 border-blue-mid h-full p-2 rounded py-2 focus-within:outline-none overflow-y-clip focus-within:text-black" disabled {...props} />
		</div>
	</div>
}