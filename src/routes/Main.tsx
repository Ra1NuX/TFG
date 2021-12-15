import {useContext} from 'react';

import Sidebar from "../components/sidebar"
import {auth} from '../firebase'
import {signOut} from "firebase/auth"
import { Routes, Route, Navigate } from "react-router";
import Dashboard from "../components/dashboard";
import Content from "../components/Content";

import DataContext from "../dataContext"

export default function Main() {

    const {cursos, update} = useContext(DataContext)

    let size = 180; 

    console.log(location.href)
    return <>
        <Sidebar size={size}/>
        <DataContext.Provider value={{cursos, update}}>
            <Content size={size}/>
        </DataContext.Provider>
    </>
}