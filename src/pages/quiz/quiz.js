/* eslint-disable import/no-anonymous-default-export */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeftCircle, HeartFill } from "react-bootstrap-icons";
import headerImg from "../../assets/img/tomato9.png";
import TrackVisibility from "react-on-screen";

export default function (props) {
  const navigate = useNavigate();
  const [answer, setAnswer] = useState("");
  const [time, setTime] = useState(300000);
  const [points, setPoints] = useState(0);
  const [url, setUrl] = useState(null);
  const [scoreId, setScoreId] = useState("");
  const [scoreDetailsId, setScoreDetailsId] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(4); // Updated to start with 4 lives

  useEffect(() => {
    let score_id = sessionStorage.getItem("SCORE_ID");
    let score_details_id = sessionStorage.getItem("SCORE_DETAILS_ID");
    let url = sessionStorage.getItem("URL");
    if (score_id) {
      setScoreId(score_id);
    }
    if (score_details_id) {
      setScoreDetailsId(score_details_id);
    }
    if (url) {
      setUrl(url);
    }
  }, []);

  useEffect(() => {
    if (lives === 0) {
      sessionStorage.setItem("POINTS", points);
      sessionStorage.setItem("SCORE_ID", scoreId);
      sessionStorage.setItem("SCORE_DETAILS_ID", scoreDetailsId);
      // Game over if lives are zero
      navigate("/end");
    }

    if (time === 0) {
      // Reduce lives if time runs out
      setLives((prevLives) => prevLives - 1);
      resetGame(); // Move to the next level or end the game
    }

    const timerId = setTimeout(() => {
      setTime(time - 1000);
    }, 1000);

    return () => clearTimeout(timerId); // Cleanup on component unmount
  }, [time, lives]);

  const resetGame = () => {
    setTime(300000);
    setAnswer("");
    setTimeout(() => {
      setIsCorrect(null);
    }, 1000);

    if (points >= level * 20) {
      setLevel(level + 1);
      // setTime((prevTime) => prevTime - 5000);
      fetchNextQuestion();
    } else {
      fetchNextQuestion();
    }
  };

  const fetchNextQuestion = () => {
    // Implement logic to fetch the next question from your server
    // Update scoreId, scoreDetailsId, and url accordingly
  };

  const getTime = (milliseconds) => {
    let total_seconds = parseInt(Math.floor(milliseconds / 1000));
    let total_minutes = parseInt(Math.floor(total_seconds / 60));

    let seconds = parseInt(total_seconds % 60);
    let minutes = parseInt(total_minutes % 60);

    return `${minutes} : ${seconds}`;
  };

  const submitAnswer = () => {
    axios({
      url: `http://localhost:8080/api/v1/game/answer/check`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("ACCESS_TOKEN")}`,
      },
      data: {
        score_id: scoreId,
        score_details_id: scoreDetailsId,
        answer: answer,
      },
    }).then((response) => {
      if (response.data.success) {
        const newPoints = response.data.body.point
          ? response.data.body.point
          : 0;
        setPoints(newPoints);
        setScoreId(response.data.body.score_id);
        setScoreDetailsId(response.data.body.score_details_id);
        setUrl(response.data.body.question ? response.data.body.question : "");
        const isAnswerCorrect = response.data.body.is_true;
        setIsCorrect(isAnswerCorrect);

        if (!isAnswerCorrect) {
          setLives((prevLives) => prevLives - 1);
        }

        resetGame();
      }
    });
  };

  return (
    <div className="quiz-cover">
      <div className="d-flex justify-content-center quiz-main">
        <div
          className="back-button "
          role="button"
          onClick={() => {
            window.history.back();
          }}
        >
          <ArrowLeftCircle size={28} />
        </div>

        <div>
          <TrackVisibility>
            {({ isVisible }) => (
              <div
                className={isVisible ? "animate__animated animate__zoomIn" : ""}
              >
                <img src={headerImg} alt="Header Img" />
              </div>
            )}
          </TrackVisibility>
        </div>

        <div className={"w-50 mt-3"}>
          <div
            className={"d-flex justify-content-between"}
            style={{ width: "100%" }}
          >
            <h3>Guess the number</h3>
            <button className={"points-btn"}>Points {points}</button>
            <span className="tagline">Level {level}</span>
            <div className="lives-container">
              {[...Array(lives)].map((_, index) => (
                <HeartFill
                  key={index}
                  size={20}
                  color="#FFD700"
                  style={{ marginRight: "2px" }}
                />
              ))}
            </div>
          </div>

          <div className={"w-100 text-center mt-3"}>
            {isCorrect !== null && (
              <h2 className={`${isCorrect ? "correctTxt" : "wrongTxt"}`}>
                {isCorrect ? "Correct" : "Wrong"}
              </h2>
            )}
          </div>

          <img
            className={"mt-2 quiz-img"}
            style={{ width: "100%", height: "380px" }}
            src={
              url
                ? url
                : `https://www.sanfoh.com/uob/tomato/data/t4fea7155a5961d100670774982n901.png`
            }
          />

          <div className={"row w-100 mt-5"} style={{ width: "100%" }}>
            <div className={"col-8"}>
              <h3 className={"timing-text"}>{getTime(time)}</h3>
            </div>
            <div className={"col-4 d-flex justify-content-end"}>
              <input
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className={"answer-input"}
              />
              <button
                disabled={answer === ""}
                onClick={submitAnswer}
                className={`points-btn ${answer === "" && "disabled-btn"}`}
              >
                Guess
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
