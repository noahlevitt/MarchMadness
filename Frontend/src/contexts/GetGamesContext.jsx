import React, { createContext, useState, useContext, useEffect } from 'react';
import { fetchGames } from '../utils/api';

const GamesContext = createContext();

export const useGames = () => useContext(GamesContext);

export const GamesProvider = ({ children }) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getGames = async () => {
    setLoading(true);
    try {
      const gameList = await fetchGames();
      setGames(Array.isArray(gameList) ? gameList : []);
      setError(null);
    } catch (error) {
      console.error("Error fetching games:", error);
      setError("Failed to fetch games from the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getGames();
  }, []);

  return (
    <GamesContext.Provider value={{ games, loading, error}}>
      {children}
    </GamesContext.Provider>
  );
};