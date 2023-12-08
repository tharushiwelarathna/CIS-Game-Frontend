import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { NavBar } from "../../components/NavBar";

// sign up successfully!

export default function (props) {
  const navigate = useNavigate();
  // State variables to manage user input for sign-in and sign-up forms
  let [authMode, setAuthMode] = useState("signin");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const [newUserName, setNewUserName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Function to trigger a storage event (e.g., when the user logs in)
  const fireStorageEvent = () => {
    window.dispatchEvent(new Event("storage"));
  };
  // Function to toggle between sign-in and sign-up modes
  const changeAuthMode = () => {
    setAuthMode(authMode === "signin" ? "signup" : "signin");
  };

  // Sample authentication data for demo purposes
  const authData = { userName: "Tharushi", password: "tharushi" };

  // Event handlers for user input changes in the forms
  const handleUserName = (e) => {
    setUserName(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };
  const handleRegisterUsername = (e) => {
    setNewUserName(e.target.value);
  };
  const handleRegisterEmail = (e) => {
    setNewEmail(e.target.value);
  };
  const handlerRegisterPassoword = (e) => {
    setNewPassword(e.target.value);
  };

  // Function to clear all form fields
  const Clear = () => {
    setUserName("");
    setPassword("");
    setNewUserName("");
    setNewEmail("");
    setNewPassword("");
  };

  // Function to handle user login
  const loginHandler = () => {
    // Check if the entered credentials match the sample authentication data
    if (password === authData.password && userName === authData.userName) {
      localStorage.setItem("key", "tharushi");
      fireStorageEvent();
      navigate("/home");
    }
  };

  // Function to handle user login using an authentication API
  const LoginHandler = async (e) => {
    e.preventDefault();
    // Prepare form data for authentication API
    let data = new FormData();
    data.append("username", userName);
    data.append("password", password);
    data.append("grant_type", "password");
    // Configuration for the authentication API request
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `http://localhost:8080/api/v1/oauth/token`,
      headers: {
        Authorization: "Basic cGxheWVyOg==",
        "Content-Type": "multipart/form-data",
      },
      data: data,
    };
    // Check if both username and password are provided
    if (password !== "" && userName !== "") {
      // Make the authentication API request
      await axios(config).then((response) => {
        console.log(response, "res");
        // If the response contains an access token, store it and user details in local storage
        if (response?.data?.access_token) {
          localStorage.setItem("ACCESS_TOKEN", response?.data?.access_token);
          let details = response.data.user;
          localStorage.setItem("User", JSON.stringify(details));
          navigate("/home");
        } else {
          console.log(response.data.message);
        }
      });
    }
  };

  // Function to handle user registration
  const SignUpHandler = () => {
    // Check if all required sign-up fields are provided
    if (newUserName !== "" && newEmail !== "" && newPassword !== "") {
      // Make a request to the player sign-up API
      axios({
        url: `http://localhost:8080/api/v1/player/signup`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: {
          userName: newUserName,
          email: newEmail,
          password: newPassword,
        },
      }).then((response) => {
        // If the sign-up is successful, clear the form fields and show an alert
        if (response?.data?.success) {
          Clear();
          if (response.data.message === "sign up successfully!") {
            alert("sign up successfully! Please check your email");
          }
        } else {
          // If there is an error, show an alert with the error message
          alert(response.data.message);
        }
      });
    }
  };

  // Render the component based on the current authentication mode (sign-in or sign-up)
  if (authMode === "signin") {
    // Render the sign-in form
    return (
      <div className="Auth-form-container">
        <div className="Auth-form-container2">
          <h3 className="Auth-form-container-title">Tomato Math Game</h3>
        </div>
        <form className="Auth-form">
          <div className="Auth-form-content">
            <h3 className="Auth-form-title">Sign In</h3>
            <div className="form-group mt-3">
              <label>User name</label>
              <input
                type="name"
                className="form-control mt-1"
                placeholder="User name"
                value={userName}
                onChange={(e) => handleUserName(e)}
              />
            </div>
            <div className="form-group mt-3">
              <label>Password</label>
              <input
                type="password"
                className="form-control mt-1"
                placeholder="Enter password"
                value={password}
                onChange={(e) => handlePassword(e)}
              />
            </div>
            {/* <p className="text-left link-text mt-4">
              <a className="link-text" href="src/pages/auth/Auth#">
                Forgot password?
              </a>
            </p> */}
            <div className="d-grid gap-2 mt-3">
              <button className="btn btn-dark" onClick={LoginHandler}>
                Submit
              </button>
            </div>
            <div className="link-primary text-end mt-3">
              <span> </span>
              <span className="link-text" onClick={changeAuthMode}>
                New User?
                <span
                  style={{ textDecoration: "underline", cursor: "pointer" }}
                >
                  {" "}
                  Sign Up
                </span>
              </span>
            </div>
          </div>
        </form>
      </div>
    );
  }
  // Render the sign-up form
  return (
    <div className="Auth-form-container">
      <div className="Auth-form-container2">
        <h3 className="Auth-form-container-title">Tomato Math Game</h3>
      </div>
      <form className="Auth-form">
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Sign Up</h3>
          <div className="form-group mt-3">
            <label>User Name</label>
            <input
              type="name"
              className="form-control mt-1"
              placeholder="User name"
              value={newUserName}
              onChange={(e) => handleRegisterUsername(e)}
            />
          </div>
          <div className="form-group mt-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control mt-1"
              placeholder="Email"
              value={newEmail}
              onChange={(e) => handleRegisterEmail(e)}
            />
          </div>
          <div className="form-group mt-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control mt-1"
              placeholder="Password"
              value={newPassword}
              onChange={(e) => handlerRegisterPassoword(e)}
            />
          </div>
          <div className="d-grid gap-2 mt-3">
            <button
              onClick={SignUpHandler}
              type="button"
              className="btn btn-primary"
            >
              Submit
            </button>
          </div>

          <div className="text-end mt-3">
            <span className="link-text" onClick={changeAuthMode}>
              Already have an account?{" "}
              <span style={{ textDecoration: "underline", cursor: "pointer" }}>
                {" "}
                Sign In
              </span>
            </span>
          </div>
        </div>
      </form>
    </div>
  );
}
