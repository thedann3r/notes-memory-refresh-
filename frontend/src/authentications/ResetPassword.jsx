import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const url = "http://127.0.0.1:5000";

function ResetPassword() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    fetch(`${url}/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        new_password: newPassword,
        confirm_password: confirmPassword,
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
          throw new Error(data.error);
        }

        setMessage(data.message);

        setTimeout(() => {
          navigate("/login");
        }, 3000);
      })
      .catch((err) => {
        setError(err.message || "Something went wrong");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div className="signupContainer">
      <div className="signupCard">
        <h2>Reset Password</h2>

        <form
          onSubmit={handleSubmit}
          className="signupForm"
        >
          <input
            className="signupInput"
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) =>
              setNewPassword(e.target.value)
            }
            required
          />

          <input
            className="signupInput"
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            required
          />

          <button
            className="signupButton"
            type="submit"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {message && (
          <p className="text-green-600">
            {message}
          </p>
        )}

        {error && (
          <p className="text-red-600">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;