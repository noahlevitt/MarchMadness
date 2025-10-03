import React, { useEffect, useState } from "react";
import { useUserSession } from "../../contexts/UserSessionContext";
import "./MyBets.css";
import Navbar from "../../components/Navbar/Navbar";

const MyBets = () => {
  const { isLoggedIn, userEmail, refreshBalance } = useUserSession();

  const [bets, setBets]       = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  // helper to load bets + keep balance in sync
  const fetchBets = () => {
    setLoading(true);
    fetch(`/api/mybets?email=${encodeURIComponent(userEmail)}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch bets");
        return res.json();
      })
      .then(data => setBets(data))
      .catch(err => setError(err.message))
      .finally(() => {
        setLoading(false);
        refreshBalance();
      });
  };

  useEffect(() => {
    if (!isLoggedIn) return;

    // initial load
    fetchBets();

    // then poll every 30 seconds
    const intervalId = setInterval(fetchBets, 30_000);
    return () => clearInterval(intervalId);
  }, [isLoggedIn, userEmail, refreshBalance]);

  if (!isLoggedIn) {
    return (
      <div className="mybets-container container my-5">
        <h2>Please log in to view your bets</h2>
      </div>
    );
  }

  return (
    <div className="mybets-container container my-5">
      {/* <Navbar /> */}
      <h2 className="mb-4">My Bets</h2>

      {loading ? (
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading…</span>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : bets.length === 0 ? (
        <div className="alert alert-info">
          You have not placed any bets yet.
        </div>
      ) : (
        <table className="mybets-table table table-striped table-hover shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>Bet ID</th>
              <th>Matchup</th>
              <th>Team</th>
              <th>Amount</th>
              <th>Payout</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bets.map(bet => (
              <tr key={bet.bet_id}>
                <td>{bet.bet_id}</td>
                <td>{bet.team1_name} vs {bet.team2_name}</td>
                <td>{bet.team_name}</td>
                <td>${bet.amount.toFixed(2)}</td>
                <td>${bet.payout.toFixed(2)}</td>
                <td className={
                    bet.bet_status === "won"  ? "text-success"
                  : bet.bet_status === "lost" ? "text-danger"
                  : ""
                }>
                  {bet.bet_status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyBets;
