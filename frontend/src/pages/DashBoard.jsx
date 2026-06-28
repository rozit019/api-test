import React, { useState, useEffect } from "react";
import GameCard from "../components/GameCard";
import {
  fetchGames,
  fetchTodayGames,
  fetchLiveGames,
} from "../services/gameService";
import "./Dashboard.css";

function Dashboard() {
  const [games, setGames] = useState([]);
  const [filter, setFilter] = useState("upcoming");
  const [sportFilter, setSportFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadGames();
  }, [filter, sportFilter]);

  const loadGames = async () => {
    setLoading(true);
    setError(null);

    try {
      let response;

      if (filter === "today") {
        response = await fetchTodayGames();
      } else if (filter === "live") {
        response = await fetchLiveGames();
      } else {
        const params = {};
        if (sportFilter !== "all") params.sport = sportFilter;
        response = await fetchGames(params);
      }

      console.log("API Response:", response);

      if (response.success && Array.isArray(response.data)) {
        setGames(response.data);
      } else if (Array.isArray(response)) {
        setGames(response);
      } else {
        setGames([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
      setGames([]);
    } finally {
      setLoading(false);
    }
  };

  const getNepaliTime = () => {
    return new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kathmandu",
      dateStyle: "full",
      timeStyle: "medium",
    });
  };
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="container">
          <h1>🇳🇵 Nepali Game Time</h1>
          <p>All your favorite games in Nepal Standard Time</p>
        </div>
      </header>

      <div className="container">
        <div className="filters">
          <div className="filter-buttons">
            {["upcoming", "today", "live", "all"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={filter === f ? "active" : ""}
              >
                {f === "live" ? "🔴 Live" : f}
              </button>
            ))}
          </div>

          <select
            value={sportFilter}
            onChange={(e) => setSportFilter(e.target.value)}
            className="sport-select"
          >
            <option value="all">All Sports</option>
            <option value="football">⚽ Football</option>
            {/* <option value="cricket">🏏 Cricket</option>
            <option value="ufc">🥊 UFC</option> */}
            <option value="f1">🏎️ F1</option>
          </select>
        </div>

        <div className="time-banner">
          <p>🕐 Current Nepal Time: {getNepaliTime()}</p>
        </div>

        {error && (
          <div className="error-banner">
            <p>❌ Error: {error}</p>
            <button onClick={loadGames}>Retry</button>
          </div>
        )}

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading games...</p>
          </div>
        ) : games.length === 0 ? (
          <div className="empty">
            <p className="empty-title">No games found 🏟️</p>
            <p className="empty-subtitle">
              {error
                ? "Something went wrong."
                : "Check back later or try different filters"}
            </p>
          </div>
        ) : (
          <div className="games-list">
            {games.map((game, index) => (
              <GameCard
                key={game._id || game.externalId || index}
                game={game}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
