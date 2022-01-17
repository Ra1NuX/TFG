import {useState} from 'react';

import Sidebar from "../components/sidebar"
import Content from "../components/Content";

export default function Main() {


    let size = 180; 

    return <>
        <Sidebar size={size} />
        <Content size={size} />
    </>
}