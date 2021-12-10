import {auth } from "../firebase"
export default function Calendar() {
    console.log(auth.currentUser)
  return <div>
<h1>Calendar</h1>
  </div>  
}
