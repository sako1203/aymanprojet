import { useEffect, useState } from "react";
import { getScores } from "../api";

export default function ScoreBoard() {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    getScores().then(setScores);
  }, []);

  return (
    <div className="mt-5 p-5 border rounded-lg shadow-lg">
      <h2 className="text-xl font-bold">Classement</h2>
      <ul>
        {scores.map((score, index) => (
          <li key={index} className="text-lg">
            {score.playerName}: {score.points} points
          </li>
        ))}
      </ul>
    </div>
  );
}
