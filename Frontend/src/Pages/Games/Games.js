import React, { useState, useEffect } from "react";
import { queryBackend } from "../../utils/api";

const Games = () => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      const result = await queryBackend("SELECT * FROM games");
      setGames(result.split("\n").filter(row => row.trim() !== "")); // Process results
    };

    fetchGames();
  }, []);

  return (
    <div>
      <h1>Games</h1>
      <ul>
        {games.length > 0 ? (
          games.map((game, index) => <li key={index}>{game}</li>)
        ) : (
          <p>No games found.</p>
        )}
      </ul>
    </div>
  );
};

export default Games;
