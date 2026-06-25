import { useState } from "react";
import { Link } from "react-router-dom";

const url = "http://127.0.0.1:5000";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    fetch(`${url}/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    })
      .then((res) =>
        res.json().then((data) => ({
          ok: res.ok,
          data,
        }))
      )
      .then(({ ok, data }) => {
        if (!ok) {
          setError(data.error);
          return;
        }

        setMessage(data.message);
        setEmail("");
      })
      .catch((err) => {
        console.error(err);
        setError("Server error");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      {message && <p>{message}</p>}
      {error && <p>{error}</p>}

      <p>
        Remember your password?{" "}
        <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default ForgotPassword;