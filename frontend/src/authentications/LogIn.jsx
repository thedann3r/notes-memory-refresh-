import { useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const url = "http://127.0.0.1:5000";

function LoginForm() {
  const navigate = useNavigate();

  const [token, setToken] = useState(
    localStorage.getItem("access_token")
  );

  const [showPassword, setShowPassword] = useState(false);

  function handleLogin(e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    fetch(`${url}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Invalid credentials");
        }

        return response.json();
      })
      .then((data) => {
        localStorage.setItem(
          "access_token",
          data.access_token
        );

        localStorage.setItem(
          "refresh_token",
          data.refresh_token
        );

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        setToken(data.access_token);

        alert(`Welcome ${data.user.name}!`);

        navigate("/notes");
      })
      .catch((error) => {
        console.error(error);
        alert("Invalid email or password");
      });
  }

  if (token) {
    return <Navigate to="/notes" />;
  }

  return (
    <div>
      <form onSubmit={handleLogin}>
        <h2>Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Enter email"
          required
        />

        <div>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter password"
            required
          />

          <span
            onClick={() =>
              setShowPassword(!showPassword)
            }
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button type="submit">
          Login
        </button>

        <p>
          Don't have an account?
          {" "}
          <Link to="/signup">
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
}

export default LoginForm;