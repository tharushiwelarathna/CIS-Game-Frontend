import { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import logo from "../assets/img/tomatoimg.png";
import { HashLink } from "react-router-hash-link";
import { BrowserRouter as Router, Route, useNavigate } from "react-router-dom";
import Auth from "../pages/auth/Auth";
import { Banner } from "./Banner";

// NavBar component for the application
export const NavBar = () => {
  // React hook for navigation
  const navigate = useNavigate();
  // State variables for username and password
  const [userName, setUserName] = useState();
  const [password, setPassword] = useState();
  
 // Function to trigger a custom storage event
  const fireStorageEvent = () => {
    window.dispatchEvent(new Event("storage"));
  };

  // Static authentication data
  const authData = { userName: "Tharushi", password: "tharushi" };

  // Event handlers for input fields
  const handleUserName = (e) => {
    setUserName(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };
  // Event handler for login button
  const loginHandler = () => {
    alert("HI");
    // if (password === authData.password && userName === authData.userName){
    // localStorage.setItem("key","tharushi");
    // fireStorageEvent();
    navigate("/auth");
    // }
  };

  const [activeLink, setActiveLink] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onUpdateActiveLink = (value) => {
    setActiveLink(value);
  };

  return (
    <Navbar expand="md" className={scrolled ? "scrolled" : ""}>
      <Container>
        <Navbar.Brand href="/">
          <img src={logo} alt="Logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav">
          <span className="navbar-toggler-icon"></span>
        </Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link
              href="#home"
              className={
                activeLink === "home" ? "active navbar-link" : "navbar-link"
              }
              onClick={() => onUpdateActiveLink("home")}
            >
              Home
            </Nav.Link>
          </Nav>
          <span className="navbar-text">
            <HashLink to="#connect">
              <button className="vvd" onClick={loginHandler}>
                <span>Log in</span>
              </button>
            </HashLink>
          </span>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
