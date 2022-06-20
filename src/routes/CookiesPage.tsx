import { BsArrowLeftShort } from "react-icons/bs";
import { Link } from "react-router-dom";
import Card from "../components/Card";

export default function CookiesPage() {
    return <Card >

        <div className="flex flex-col items-center dark:text-white text-blue-dark">
            <h1 >Política de cookies</h1>
            <p >
                OpenClass-TFG usa cookies para mejorar tu experiencia. Debe haber aceptado estas cookies para poder navegar en la aplicación.


                <table>
                    <tr className="bg-gray-400 first-of-type:pr-2 text-white">
                        <th>Nombre</th>
                        <th>Duración</th>
                        <th>Descripción</th>
                    </tr>
                    <tr className="first-of-type:pr-2">
                        <td>user-has-accepted-cookies</td>
                        <td>9000</td>
                        <td>Determina si el usuario a aceptado las cookies</td>
                    </tr>
                    <tr className="first-of-type:pr-2">
                        <td>dark-mode</td>
                        <td>9000</td>
                        <td>Determina si la web esta en modo oscuro</td>
                    </tr>
                    <tr className="first-of-type:pr-2">
                        <td>user</td>
                        <td>9000</td>
                        <td>se guardan algunos valores del usuario por defecto</td>
                    </tr>
                </table>
                <p className="absolute left-1 bottom-1">Copyright © 2022 Ra1NuX. All Rights Reserved.</p>
            </p>
            
        </div>
        <Link to={"/"}><a className=" px-4 rounded hover:text-blue-mid hover:drop-shadow-md"><BsArrowLeftShort className="inline-block"/>Volver</a></Link>
    </Card>

}