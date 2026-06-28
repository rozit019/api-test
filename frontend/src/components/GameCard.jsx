import React from "react";
import "./GameCard.css";

function GameCard({ game }) {
  // Proper Nepal time conversion for display
  const formatNepaliTime = (utcDate) => {
    if (!utcDate) return "Time TBD";

    try {
      const date = new Date(utcDate);
      if (isNaN(date.getTime())) return "Invalid Time";

      // Convert to Nepal Time (UTC+5:45) using Intl.DateTimeFormat
      return new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Kathmandu",
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).format(date);
    } catch {
      return "Invalid Time";
    }
  };

  const getSportIcon = (sport) => {
    switch (sport) {
      case "football":
        return "⚽";
      //   case "cricket":
      //     return "🏏";
      //   case "ufc":
      //     return "🥊";
      case "f1":
        return "🏎️";
      default:
        return "🎮";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "live":
        return "status-live";
      case "finished":
        return "status-finished";
      default:
        return "status-scheduled";
    }
  };

  const homeTeam = game.homeTeam || "TBD";
  const awayTeam = game.awayTeam || "TBD";
  const league = game.league || "Unknown League";
  const sport = game.sport || "unknown";
  const status = game.status || "scheduled";
  const venue = game.venue || "TBD";

  const renderMatchup = () => {
    if (sport === "f1") {
      return (
        <div className="matchup-f1">
          <span className="session-name">{homeTeam}</span>
          <h3 className="grand-prix">{awayTeam}</h3>
        </div>
      );
    }

    return (
      <div className="matchup-standard">
        <div className="team">
          <h3 className="team-name">{homeTeam}</h3>
          {game.homeScore !== null && game.homeScore !== undefined && (
            <span className="score">{game.homeScore}</span>
          )}
        </div>
        <div className="vs">
          <span>VS</span>
        </div>
        <div className="team">
          <h3 className="team-name">{awayTeam}</h3>
          {game.awayScore !== null && game.awayScore !== undefined && (
            <span className="score">{game.awayScore}</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="game-card">
      <div className="game-header">
        <span className="sport-info">
          {getSportIcon(sport)} {sport} • {league}
        </span>
        <span className={`status-badge ${getStatusColor(status)}`}>
          {status.toUpperCase()}
        </span>
      </div>

      {renderMatchup()}

      <div className="game-footer">
        <p className="nepali-time">
          🕐 {formatNepaliTime(game.utcDateTime)} NPT
        </p>
        <p className="venue">{venue}</p>
      </div>
    </div>
  );
}

export default GameCard;
