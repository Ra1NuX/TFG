import { useContext } from "react"
import DataContext from "../dataContext"

export default function Chat(){
    const {cursos} = useContext(DataContext)
    console.log(cursos)
    return <h1>Chatz</h1>
}