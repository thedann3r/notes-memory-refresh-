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

function App() {
  return(
    <Router>
      <Routes>
        <Route path = '/authentication' element = {<Authentication/>} />
        <Route path = '/' element = {<SignupForm/>} />
        <Route path = '/login' element = {<LoginForm/>} />
        <Route path = '/notes' element = {<Note/>} />
      </Routes>
    </Router>
  )
}
 
export default App
