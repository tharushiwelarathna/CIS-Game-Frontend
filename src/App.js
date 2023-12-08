import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { NavBar } from "./components/NavBar";
import { Banner } from "./components/Banner";
import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Routes } from "react-router-dom";
import Auth from "./pages/auth/Auth";
import Quiz from "./pages/quiz/quiz";
import GameOver from "./pages/game-over/game-over";
import PointTable from "./pages/point-table/point-table";
import Verification from "./pages/verification/verification";
import { useEffect, useState } from "react";

function App() {
  const [home, setHome] = useState(false);

  useEffect(() => {
    window.addEventListener("storage", () => {
      setHome(true);
    });
  }, []);
  return (
    <div>
      {home && <NavBar />}
      <Routes>
        <Route path="" element={<Auth />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/home" element={<Banner />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/end" element={<GameOver />} />
        <Route path="/point-table" element={<PointTable />} />
        <Route path="/register-complete" element={<Verification />} />
      </Routes>
    </div>
  );
}

export default App;
