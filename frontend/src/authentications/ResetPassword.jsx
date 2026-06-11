// import React, { useState } from 'react';
// import { useSearchParams, useNavigate } from 'react-router-dom';

// const url = "http://127.0.0.1:5000";

// function ResetPassword() {
//     const navigate = useNavigate();  // Correct place
//     const [searchParams] = useSearchParams();
//     const token = searchParams.get('token');

//     const [loading, setLoading] = useState(false);
//     const [newPassword, setNewPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [message, setMessage] = useState('');
//     const [error, setError] = useState('');

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);

//         try {
//             const res = await fetch(`${url}/reset-password`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ token, new_password: newPassword, confirm_password: confirmPassword }),
//             });

//             const data = await res.json();

//             if (!res.ok) {
//                 setError(data.error || "Something went wrong");
//                 setMessage('');
//             } else {
//                 setMessage(data.message);
//                 setError('');
//                 setTimeout(() => navigate('/login'), 3000);  // Redirect after 3s
//             }
//         } catch (err) {
//             setError("Server error");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="signupContainer">
//             <div className="signupCard">
//                 <h2>Reset Password</h2>
//                 <form onSubmit={handleSubmit} className="signupForm">
//                     <input
//                         className="signupInput"
//                         type="password"
//                         placeholder="New password"
//                         value={newPassword}
//                         onChange={(e) => setNewPassword(e.target.value)}
//                         required
//                     />
//                     <input
//                         className="signupInput"
//                         type="password"
//                         placeholder="Confirm new password"
//                         value={confirmPassword}
//                         onChange={(e) => setConfirmPassword(e.target.value)}
//                         required
//                     />
//                     <button className="signupButton" type="submit" disabled={loading}>
//                         {loading ? "Resetting..." : "Reset Password"}
//                     </button>
//                 </form>
//                 {message && <p className="text-green-600">{message}</p>}
//                 {error && <p className="text-red-600">{error}</p>}
//             </div>
//         </div>
//     );
// }

// export default ResetPassword;