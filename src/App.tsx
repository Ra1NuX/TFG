import { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

import Cookies from 'js-cookie';

import { auth } from './firebase';
import { onAuthStateChanged } from '@firebase/auth';

declare global {
  interface Window{handler:any}
}


// import './default.css';
// import "./lightmode";
import Main from "./routes/Main"
import LogIn from "./routes/Login"
import Register from "./routes/Register"
import VerifyEmail from './routes/Verify'
import CookieBanner from 'react-cookie-banner/lib';
import CookiesPage from './routes/CookiesPage';
import Loader from './components/Loader';


function App() {
  const [isLoading, setIsLoading] = useState(auth.currentUser === null);
  const [isLoggedIn, setIsLogedIn] = useState(false);
  const [acceptCookies, setAcceptCookies] = useState<any>(Cookies.get('user-has-accepted-cookies'));


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
    <Loader/>
    :
    <div className='h-screen bg-dark'>
      
      <CookieBanner
      message="OpenClass-TFG usa cookies para mejorar tu experiencia. Para continuar navegando, acepta nuestra"
      link={<a href="/#/cookies">Política de cookies</a>}
      dismissOnScroll={false}
      onAccept={() => {setAcceptCookies(true)}}
      cookie="user-has-accepted-cookies" />

      <HashRouter>
        <Routes>
        {!acceptCookies && <>
        <Route path="cookies" element={<CookiesPage />}  />
        </>}
        {acceptCookies && 
        <>
          <Route path="/*" element={!isLoggedIn ? <Navigate to="login" /> : !auth.currentUser?.emailVerified ? <VerifyEmail /> : <Main />} />
          <Route path="login" element={isLoggedIn ? <Navigate to="/" /> : <LogIn />} />
          <Route path="register" element={isLoggedIn ? <Navigate to="/" /> : <Register />} />
          </>
        }
        </Routes>
      </HashRouter>
    </div>

}

export default App
