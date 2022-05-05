import { ErrorMessage, useField } from "formik"

interface InputProps extends React.ComponentPropsWithoutRef<"input"> {
	label?: string;
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
				"border-red-600 text-red-600" : "text-neutral-700 text-bold border-blue-500"}`} />
		</label>
		<div className="min-h-[24px]">
			<ErrorMessage name={name}>
				{msg => <span className="text-red-600 text-sm">{msg}</span>}
			</ErrorMessage>
		</div>
	</>
}

Input.Editable = function Editable({ label, ...props }: InputProps) {
	return <div className="flex flex-col">
		{typeof label === "string" && <>
			<span className="ml-3 mt-2 text-sm text-ellipsis overflow-hidden whitespace-nowrap">{label}</span>
		</>}
		<input className="shadow-md border-b-2 border-blue-500 h-full p-2 rounded py-2 focus-within:outline-none" disabled {...props} />
	</div>
}