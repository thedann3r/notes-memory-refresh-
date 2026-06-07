import React, { useState } from 'react';
import { Navigate } from "react-router-dom";

const url = "http://127.0.0.1:5000"

function LoginForm() {
    const [token, setToken] = useState(localStorage.getItem('access_token'));
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

    const handleLogin = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
    
        try {
            const response = await fetch(`${url}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.get('name'),
                    email: formData.get('email'),
                    password: formData.get('password')
                }),
            });
    
            if (!response.ok) {
                alert("Invalid credentials");
                throw new Error('Invalid credentials');
            }
    
            const data = await response.json();
    
            localStorage.setItem("access_token", data.create_token);
            localStorage.setItem("user", JSON.stringify({
                id: data.user.id,
                name: data.user.name,
                email: data.user.email,
                role: data.role
            }));
    
            window.dispatchEvent(new Event("storage"));
    
            setToken(data.create_token);
            setUser({ name: data.user.name, role: data.role });

            alert(`Welcome ${data.user.name}, you are logged in as a ${data.role}.`);
    
        } catch (error) {
            console.error("Login error:", error);
        }
    };
    
    if (token && user) {
        return user.role === "admin" ? <Navigate to="/accommodationAdmin" /> : <Navigate to="/accommodationUsers" />;
    }

    return (
        <div className="signupContainer">
            <div className="signupCard">
                <div className="signupLeft">
                    <div className="signupImagePlaceholder">
                        <img src="https://cdn.create.vista.com/api/media/small/426382906/stock-photo-hostel-dormitory-beds-arranged-in-room" alt="signup" />
                    </div>
                </div>
                <div className="signupRight">
                    <h2>Log in to your account</h2>
                    <form className="signupForm" onSubmit={handleLogin}>
                        <input className="signupInput" type="text" name="name" placeholder="Enter name..." required />
                        <input className="signupInput" type="email" name="email" placeholder="Enter email..." required />
                        <input className="signupInput" type="password" name="password" placeholder="Enter password..." required />
                        <button className="signupButton" type="submit">Log In</button>
                    </form>
                    <p className="signupFooter">Don't have an account? <a href="/signup">Sign up</a></p>
                </div>
            </div>
        </div>
    );
}

export default LoginForm;