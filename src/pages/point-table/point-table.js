import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Table } from "react-bootstrap";

export default function (props) {
  const navigate = useNavigate();
  const [tblData, setTblData] = useState([]);
  const [highest, setHighest] = useState(0);

  useEffect(() => {
    getTableData();
  }, []);

  const getTableData = () => {
    axios({
      url: "http://localhost:8080/api/v1/game/top-score",
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("ACCESS_TOKEN")}`,
      },
    })
      .then((response) => {
        console.log("API Response:", response.data);

        if (response?.data?.success) {
          let data = response?.data?.body;
          if (data && data.length > 0) {
            setTblData(data);
            setHighest(data[0].point);
          } else {
            console.warn("Empty or invalid data received from the API.");
          }
        } else {
          console.warn("API request was not successful.");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  return (
    <div>
      <div className="pt-4 h-auto quiz-main d-flex justify-content-center align-items-start">
        <h1>SCORE BOARD</h1>
      </div>
      <div className={"w-100 pt-5 d-flex justify-content-center"}>
        <div
          className={
            "y-box p-3 w-75 d-flex justify-content-center align-items-start"
          }
        >
          <h1
            style={{ color: "black", fontFamily: "Arial", fontWeight: "bold" }}
          >
            Highest Points : {highest}
          </h1>
        </div>
      </div>

      <div className={"w-100 pt-4 d-flex justify-content-center"}>
        <div
          className={
            "y-box mb-5 p-3 w-75 d-flex justify-content-center align-items-start"
          }
        >
          <div>
            <h1
              className={"text-center"}
              style={{
                color: "black",
                fontFamily: "Arial",
                fontWeight: "bold",
                fontSize: "30px",
              }}
            >
              ALL POINTS
            </h1>

            {tblData.length > 0 && (
              <Table className={"mt-3 pb-5"} size="md">
                <thead>
                  <tr>
                    <th className={"main-th"}>Date</th>
                    <th className={"main-th"}>Player</th>
                    <th className={"main-th"}>Level</th>
                    <th className={"main-th"}>Point</th>
                  </tr>
                </thead>

                <tbody>
                  {tblData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.date.split("T")[0]}</td>
                      <td>{item.userName}</td>
                      <td>{item.level_eum}</td>
                      <td>{item.point}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>
        </div>
      </div>

      <div className={"w-100 d-flex py-3 justify-content-center"}>
        <button
          style={{ background: "yellow", color: "black" }}
          onClick={() => navigate("/home")}
          className={"signin-btn"}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
