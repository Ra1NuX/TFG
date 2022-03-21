import { useEffect, useState } from 'react';

import Sidebar from "../components/sidebar"
import Content from "../components/Content";



export default function Main() {
    const [data, setData] = useState()
    const handleData = (info: any) => setData(info);
    let onCourse = data != undefined;


    return <div className='flex bg-red-600 h-screen'>
            <Sidebar onCourse={onCourse} />
            <Content handleData={handleData} />
        </div> 
}