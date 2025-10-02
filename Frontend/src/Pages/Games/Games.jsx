import React, { useEffect, useState } from "react";
import { queryBackend } from "../../utils/api"; // Make sure this path is correct

const Games = () => {
    const [games, setGames] = useState([]);

    useEffect(() => {
        const fetchGames = async () => {
            const result = await queryBackend("SELECT * FROM games");
            setGames(result.split("\n").filter(row => row.trim() !== ""));
        };

        fetchGames();
    }, []);

    return (
        <div>
            <h1>Available Games</h1>
            <ul>
                {games.length > 0 ? (
                    games.map((game, index) => <li key={index}>{game}</li>)
                ) : (
                    <p>No games available</p>
                )}
            </ul>
        </div>
    );
};

export default Games;
