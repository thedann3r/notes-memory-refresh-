import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import LoginForm from './Login';
import SignupForm from './Signup';
// import Accommodate from '../AdminAccommodation/Accommodate';
// import AccommodationDetails from '../UserAccommodation/AccommodationDetails';

const url = "http://127.0.0.1:5000"

function Authentication() {
    let navigate = useNavigate()
    const [user, setUser] = useState(null);
    const [accommodations, setAccommodations] = useState([]);
    const [users, setUsers] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('access_token'));

    useEffect(() => {
        if (token && user) {
            fetchAccommodations();
            if (user?.role === "admin") {
                fetchUsers();
            }
        }
    }, [token, user]);

    const fetchAccommodations = () => {
        fetch(`${url}/accommodations`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Failed to fetch accommodations');
            })
            .then((data) => {
                setAccommodations(data);
            })
            .catch((error) => {
                console.error('Error fetching accommodations:', error);
            });
    };

    const fetchUsers = () => {
        if (user?.role !== 'admin') {
            navigate("/accommodationUsers");
            return;
        }

        fetch(`${url}/users`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    console.error('Error fetching users:', response.statusText);
                    throw new Error('Error fetching users');
                }
            })
            .then((data) => {
                setUsers(data);
            })
            .catch((error) => {
                console.error('Error fetching users:', error);
            });
    };

    const handleLogout = () => {
        console.log("Logout button clicked")
        setToken(null);
        setUser(null);
        localStorage.removeItem("access_token");
        navigate('/login')
    };

    return (
        <Router>
            <Routes>
                <Route path="/login" element={user ? <Navigate to={user?.role === 'admin' ? '/accommodationAdmin' : '/accommodationUsers'} /> : <LoginForm setUser={setUser} />} />
                <Route path="/signup" element={user ? <Navigate to={user?.role === 'admin' ? '/accommodationAdmin' : '/accommodationUsers'} /> : <SignupForm />} />

                <Route path="/accommodationUsers" element={token ? <Navigate to={user?.role === 'admin' ? '/accommodationAdmin' : '/accommodationUsers'} /> : <Navigate to="/login" />} />

                <Route path="/accommodationAdmin" element={user?.role === 'admin' ? <Accommodate /> : <Navigate to="/login" />} />

                <Route path="/accommodationUsers" element={user?.role === 'user' ? <AccommodationDetails /> : <Navigate to="/login" />} />

                <Route path="/users" element={user?.role === 'admin' ? <Users users={users} /> : <Navigate to="/accommodationUsers" />} />
            </Routes>
        </Router>
    );
}

function Accommodations({ accommodations }) {
    return (
        <div>
            <h2>Accommodations</h2>
            <ul>
                {accommodations.map((accommodation) => (
                    <li key={accommodation.id}>
                        <h3>{accommodation.name}</h3>
                        <p><strong>Description:</strong> {accommodation.description}</p>
                        <img src={accommodation.image} alt={accommodation.name} style={{ width: '200px', height: 'auto' }} />
                    </li>
                ))}
            </ul>
        </div>
    );
}

function Users({ users }) {
    return (
        <div>
            <h2>Users</h2>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        {user.name} - {user.email} - {user.role}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Authentication;