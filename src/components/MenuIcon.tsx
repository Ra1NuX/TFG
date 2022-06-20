import { ClassType, useState } from "react"

interface MenuIconProps extends Pick<HTMLButtonElement, "className">{
    onClick: () => any,
    open: boolean,

}

export default function MenuIcon({ className="", onClick, open }: MenuIconProps) {
    
    return <div className={"absolute z-[1010] " + className}> 
    <button className={"w-10 h-10 relative focus:outline-none " + className} onClick={onClick}>
        <div className=" block w-5 absolute left-1/2 top-1/2  transform  -translate-x-1/2 -translate-y-1/2">
            <span aria-hidden="true" className={`text-white block absolute h-0.5 w-5 bg-current transform transition duration-500 ease-in-out ${open ? 'rotate-45' : '-translate-y-1.5'}`}></span>
            <span aria-hidden="true" className={`text-white block absolute h-0.5 w-5 bg-current transform transition duration-500 ease-in-out ${open ? "opacity-0" : "opacity-100"} `}></span>
            <span aria-hidden="true" className={`text-white block absolute h-0.5 w-5 bg-current transform transition duration-500 ease-in-out ${open ? '-rotate-45' : 'translate-y-1.5'}`}></span>
        </div>
    </button>
    </div>

}