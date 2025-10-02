import React, { useState, useEffect } from "react";
import { fetchGames } from "./utils/api";

const Games = () => {
    const [games, setGames] = useState([]);

    useEffect(() => {
        const getGames = async () => {
            const data = await fetchGames();
            setGames(data);
        };
        getGames();
    }, []);

    return (
        <div>
            <h2>Available Games</h2>
            {games.length > 0 ? (
                <ul>
                    {games.map((game) => (
                        <li key={game.game_id}>
                            Game ID: {game.game_id} - Teams: {game.team1_id} vs. {game.team2_id} - Time: {game.game_time} - Odds: {game.team1_odds} / {game.team2_odds}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No games available.</p>
            )}
        </div>
    );
};

export default Games;