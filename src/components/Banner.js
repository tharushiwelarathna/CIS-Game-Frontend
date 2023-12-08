import { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import headerImg from "../assets/img/tomatoimg.png";
import {
  ArrowRightCircle,
  PersonCircle,
  StarFill,
} from "react-bootstrap-icons";
import "animate.css";
import TrackVisibility from "react-on-screen";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Banner = () => {
  // State variables for text animation
  const [loopNum, setLoopNum] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState("");
  const [delta, setDelta] = useState(300 - Math.random() * 100);
  const [index, setIndex] = useState(1);
  const toRotate = ["Web Developer", "Web Designer", "Team Leader"];
  const period = 2000;
  // React hook for navigation
  const navigation = useNavigate();
  // User details from localStorage
  const user = JSON.parse(localStorage.getItem("User"));

  // Effect hook for text animation
  useEffect(() => {
    console.log(user);
    let ticker = setInterval(() => {
      tick();
    }, delta);

    return () => {
      clearInterval(ticker);
    };
  }, [text]);

  // Function to handle text animation
  const tick = () => {
    let i = loopNum % toRotate.length;
    let fullText = toRotate[i];
    let updatedText = isDeleting
      ? fullText.substring(0, text.length - 1)
      : fullText.substring(0, text.length + 1);

    setText(updatedText);

    if (isDeleting) {
      setDelta((prevDelta) => prevDelta / 2);
    }

    if (!isDeleting && updatedText === fullText) {
      setIsDeleting(true);
      setIndex((prevIndex) => prevIndex - 1);
      setDelta(period);
    } else if (isDeleting && updatedText === "") {
      setIsDeleting(false);
      setLoopNum(loopNum + 1);
      setIndex(1);
      setDelta(500);
    } else {
      setIndex((prevIndex) => prevIndex + 1);
    }
  };

  // Function to start a new game
  const startGame = () => {
    axios({
      url: "http://localhost:8080/api/v1/game/start",
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("ACCESS_TOKEN")}`,
      },
    }).then((response) => {
      if (response?.data?.success) {
        sessionStorage.setItem(
          "SCORE_ID",
          response?.data.body.score_id ? response.data.body.score_id : null
        );
        sessionStorage.setItem(
          "SCORE_DETAILS_ID",
          response.data.body.score_details_id
            ? response.data.body.score_details_id
            : null
        );
        sessionStorage.setItem(
          "URL",
          response.data.body.question ? response.data.body.question : null
        );
        navigation("/quiz");
      }
    });
  };

  return (
    <section className="banner" id="home">
      <Container>
        <div className="profile-sec">
          <h5>
            <span className="person-icon">
              <PersonCircle size={22} />
            </span>

            <span>
              {user.username} -{" "}
              <span className="level">{user.userDetails.level_eum}</span>{" "}
              <span className="points">
                <StarFill size={16} />
                <span>{user.userDetails.level}</span>
              </span>
            </span>
          </h5>
        </div>
        <Row className="aligh-items-center">
          <Col xs={12} md={6} xl={6}>
            <TrackVisibility>
              {({ isVisible }) => (
                <div
                  className={
                    isVisible ? "animate__animated animate__fadeIn" : ""
                  }
                >
                  <span className="tagline">Welcome to Tomato Maths Game </span>

                  <p>
                    Get ready to embark on an exciting mathematical journey with
                    Tomato Math Game, where learning meets fun! Sharpen your
                    arithmetic skills and challenge yourself with a thrilling
                    quiz experience that covers addition, subtraction,
                    multiplication, and division.
                  </p>
                  {/* <button style={{ fontSize: "40px" }} onClick={startGame}>
                    Start Game <ArrowRightCircle size={35} />
                  </button> */}

                  <div className="centered-button">
                    <button onClick={startGame}>
                      <Button variant="primary" size="lg">
                        Start Game <ArrowRightCircle size={35} />
                      </Button>
                    </button>
                  </div>
                </div>
              )}
            </TrackVisibility>
          </Col>
          <Col xs={12} md={6} xl={4}>
            <TrackVisibility>
              {({ isVisible }) => (
                <div
                  className={
                    isVisible ? "animate__animated animate__zoomIn" : ""
                  }
                >
                  <img src={headerImg} alt="Header Img" />
                </div>
              )}
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
    </section>
  );
};
