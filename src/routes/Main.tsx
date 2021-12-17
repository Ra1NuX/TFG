import {useContext} from 'react';

import Sidebar from "../components/sidebar"
import Content from "../components/Content";

export default function Main() {

    let size = 180; 

    console.log(location.href)
    return <>
        <Sidebar size={size}/>
        <Content size={size} />
    </>
}