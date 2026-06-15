import { Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./LogIn";
import SignupForm from "./SignUp";
// import "./Authorization.css"

function Authentication() {
  const token = localStorage.getItem("access_token");

  return (
    <Routes>
      <Route
        path="/login"
        element={
          token
            ? <Navigate to="/notes" />
            : <Login />
        }
      />

      <Route
        path="/signup"
        element={
          token
            ? <Navigate to="/notes" />
            : <Signup />
        }
      />
    </Routes>
  );
}

export default Authentication;