import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const url = "http://127.0.0.1:5000";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
  });

  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser) {
      setUser(storedUser);
      setNewName(storedUser.name);
      setNewEmail(storedUser.email);
    }
  }, []);

  function handleUpdate(e) {
    e.preventDefault();

    const token = localStorage.getItem("access_token");

    let requestBody = {
        current_password: currentPassword
    };

    if (newName !== user.name) {
      requestBody.name = newName;
    }

    if (newEmail !== user.email) {
      requestBody.email = newEmail;
    }

    if (newPassword.trim()) {
    //   requestBody.current_password = currentPassword;
      requestBody.new_password = newPassword;
    }

    fetch(`${url}/users`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    })
      .then((res) => {
        if (!res.ok) {
            return res.json().then((data) => {
            throw new Error(data.error);
            });
        }

        return res.json();
        })
      .then((updatedUser) => {
        localStorage.setItem(
          "user",
          JSON.stringify(updatedUser)
        );

        setUser(updatedUser);

        alert("Profile updated successfully!");
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to update profile");
      });
  }

  function handleDelete() {
    if (!window.confirm("Delete your account?")) {
      return;
    }

    const token = localStorage.getItem("access_token");

    fetch(`${url}/delete-account`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to delete account");
        }

        return res.json();
      })
      .then(() => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");

        navigate("/login");
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to delete account");
      });
  }

  return (
    <div>
      <h2>Profile</h2>

      <form onSubmit={handleUpdate}>
        <input
          type="text"
          value={newName}
          placeholder="Name"
          onChange={(e) => setNewName(e.target.value)}
        />

        <input
          type="email"
          value={newEmail}
          placeholder="Email"
          onChange={(e) => setNewEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button type="submit">
          Update Profile
        </button>
      </form>

      <button onClick={handleDelete}>
        Delete Account
      </button>
    </div>
  );
}

export default Profile;