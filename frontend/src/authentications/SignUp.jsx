import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const url = "http://127.0.0.1:5000";

function SignupForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSignup = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const password = formData.get("password");
    const confirmPassword = formData.get("confirm_password");

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    fetch(`${url}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        password,
        confirm_password: confirmPassword,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(data.error);
          });
        }
        return res.json();
      })
      .then((data) => {
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        localStorage.setItem("user", JSON.stringify(data.user));

        alert(`Welcome ${data.user.name}`);

        navigate("/notes"); // 👈 important
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <div>
      <form onSubmit={handleSignup}>
        <input name="name" placeholder="Name" />
        <input name="email" placeholder="Email" />

        <input
          name="password"
          // placeholder="Password"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
        />
        <span onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>

        <input
          name="confirm_password"
          type={showConfirm ? "text" : "password"}
          placeholder="Confirm Password"
        />
        <span onClick={() => setShowConfirm(!showConfirm)}>
          {showConfirm ? <FaEyeSlash /> : <FaEye />}
        </span>

        <button type="submit">Sign Up</button>
        <p>Already have an account? <a href = "/login">Login</a> </p>
      </form>
    </div>
  );
}

export default SignupForm;