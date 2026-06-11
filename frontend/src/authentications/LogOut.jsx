import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
    const [token, setToken] = useState(localStorage.getItem('access_token'));
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const navigate = useNavigate();

    const handleLogout = () => {
        console.log("Logout button clicked");
        setToken(null);
        setUser(null);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");  // Remove user info from localStorage
        navigate('/login');  // Redirect to login page
    };

    return (
        <div>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default Logout;