import Sidebar from "../components/sidebar"
import {auth} from '../firebase'
import {signOut} from "firebase/auth"
import { Routes, Route, Navigate } from "react-router";
import Dashboard from "../components/dashboard";
import Content from "../components/Content";

export default function Main() {
    let size = 180; 

    console.log(location.href)
    return <>
        <Sidebar size={size}/>
        <Content size={size}/>
    </>
}