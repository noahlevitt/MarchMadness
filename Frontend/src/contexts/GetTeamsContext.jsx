import React, { createContext, useState, useContext, useEffect } from 'react';
import { fetchTeams } from '../utils/api';

const TeamsContext = createContext();

export const useTeams = () => useContext(TeamsContext);

export const TeamsProvider = ({ children }) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getTeams = async () => {
    setLoading(true);
    try {
      const gameList = await fetchTeams();
      setTeams(Array.isArray(gameList) ? gameList : []);
      setError(null);
    } catch (error) {
      console.error("Error fetching teams:", error);
      setError("Failed to fetch teams from the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTeams();
  }, []);

  return (
    <TeamsContext.Provider value={{ teams, loading, error}}>
      {children}
    </TeamsContext.Provider>
  );
};