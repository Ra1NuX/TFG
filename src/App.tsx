import { useState, useEffect } from 'react';
import { BsMoonStarsFill, BsSunFill } from 'react-icons/bs'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { VscChromeMaximize } from 'react-icons/vsc'
import { SyncLoader } from 'react-spinners';



import { auth } from './firebase';
import { onAuthStateChanged } from '@firebase/auth';

// import './default.css';
// import "./lightmode";
import Main from "./routes/Main"
import LogIn from "./routes/Login"
import Register from "./routes/Register"
import VerifyEmail from './routes/Verify'
import { useDarkMode } from './hooks/useDarkMode';


function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLogedIn] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode()


  // Check if the window is fullScreen only one time when the application run. 
  useEffect(() => {
    onAuthStateChanged(auth, (user => {
      setIsLoading(false);
      if (user != null) {
        setIsLogedIn(true);
      }
    }))

  }, [])

  return isLoading
    ? 
    <div className='flex h-screen justify-center items-center bg-dark'>
      <SyncLoader />
    </div>
    :
    <div className='h-screen bg-dark'>
      <HashRouter>
        <Routes>
          <Route path="/*" element={!isLoggedIn ? <Navigate to="login" /> : !auth.currentUser?.emailVerified ? <VerifyEmail /> : <Main />} />
          <Route path="login" element={isLoggedIn ? <Navigate to="/" /> : <LogIn />} />
          <Route path="register" element={isLoggedIn ? <Navigate to="/" /> : <Register />} />
        </Routes>
      </HashRouter>
    </div>

}

export default App
