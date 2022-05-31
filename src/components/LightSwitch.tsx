import { Switch } from "@headlessui/react";
import { useDarkMode } from "../hooks/useDarkMode";
import {motion} from 'framer-motion'
import { BsMoonStarsFill, BsSunFill } from "react-icons/bs";


export default function LightSwitch() {
    const [darkMode, setDarkMode] = useDarkMode();
    return <Switch
    checked={darkMode}
    onChange={setDarkMode}
    className={`${darkMode ? 'bg-light justify-end' : 'bg-light justify-start'}
relative inline-flex self-center ml-2 h-[22px] w-[40px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
>
    <motion.span
        layout
        aria-hidden="true"
        className={`
  pointer-events-none mx-[1px] h-[18px] w-[18px] rounded-full shadow-lg transform ring-0 flex`}
    >{darkMode ? <BsMoonStarsFill size={16} className="mr-px self-center" /> : <BsSunFill size={16} className="ml-px self-center" />}</motion.span>
</Switch>
}