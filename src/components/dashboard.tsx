import { auth } from "../firebase"

export default function Dashboard({...props}){

    const {size} = props
    return <div>
    <h1>Bienvenido {auth.currentUser?.displayName}</h1>
    </div>
}
