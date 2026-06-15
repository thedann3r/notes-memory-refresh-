import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
import Authentication from './authentications/Authentication'
import SignupForm from './authentications/SignUp'
import LoginForm from './authentications/LogIn'
import Note from './notes/Note'
import './App.css'
import Profile from './profile/Profile'
import Logout from './authentications/LogOut'

function App() {
  return(
    <Router>
      <Routes>
        <Route path = '/authentication' element = {<Authentication/>} />
        <Route path = '/signup' element = {<SignupForm/>} />
        <Route path = '/login' element = {<LoginForm/>} />
        <Route path = '/notes' element = {<Note/>} />
        <Route path = '/profile' element = {<Profile/>} />
        <Route path = '/logout' element = {<Logout/>} />
      </Routes>
    </Router>
  )
}
 
export default App
