import React, {useState, useEffect} from 'react';
import "./Bracket.css";

const Bracket = ({ 
  team1 = null,
  team2 = null,
  width = 220, 
  height = 80, 
  onTeamClick = () => {},
  reverse = false,
}) => {
  const defaultTeam = { seed: '', name: '', score: null, abv: '' };
  const t1 = { ...defaultTeam, ...(team1 || {}) };
  const t2 = { ...defaultTeam, ...(team2 || {}) };

  const boxHeight = height / 2;

  let team1Winner = false;
  let team2Winner = false;
  
  if (t1.score !== null && t2.score !== null) {
    const score1 = parseInt(t1.score);
    const score2 = parseInt(t2.score);
    
    team1Winner = score1 > score2;
    team2Winner = score2 > score1;
  }

  const renderTeamContent = (team) => {
    const [imgSrc, setImgSrc] = useState(null);
    const [imgError, setImgError] = useState(false);
  
    useEffect(() => {
      if (team.name && team.name.trim() !== '') {
        setImgSrc(`/Team_Logos/${team.name.replaceAll(" ", "_")}.png`);
        setImgError(false); // Reset the error if team changes
      } else {
        setImgSrc(null);
      }
    }, [team.name]);
  
    return (
      <div className={'team-content'}>
        {imgSrc && !imgError && (
          <img
            src={imgSrc}
            alt={`${team.name} logo`}
            className={`logo${reverse ? '-reverse' : ''}`}
            onError={() => setImgError(true)}
          />
        )}
        <div className={`seed${reverse ? '-reverse' : ''}`}>{team.seed}</div>
        {/* CHANGE team.abv TO team.name IF YOU WANT TO DISPLAY FULL NAMES*/}
        <div className={`name${reverse ? '-reverse' : ''}`}>{team.abv}</div>  
        <div className={`score${reverse ? '-reverse' : ''}`}>{team.score}</div>
      </div>
    );
  };
  

  return (
    <div className="bracket-container" style={{ width, height }}>
      <svg 
        viewBox={`0 0 ${width} ${height}`} 
        preserveAspectRatio="xMidYMid meet" 
        className="bracket-svg"
      >
        {/* Top team box */}
        <rect 
          x="0" y="0" 
          width={width} height={boxHeight} 
          fill="transparent" 
          stroke={team1Winner ? "orange" : "black"}
          strokeWidth={team1Winner ? 2 : 1}
        />
        
        {/* Bottom team box */}
        <rect 
          x="0" y={boxHeight} 
          width={width} height={boxHeight} 
          fill="transparent" 
          stroke={team2Winner ? "orange" : "black"} 
          strokeWidth={team2Winner ? 2 : 1}
        />

        {/* Middle line */}
        <line
          x1="0"
          y1={boxHeight}
          x2={width}
          y2={boxHeight}
          stroke={
            team1Winner ? "orange" : team2Winner ? "orange" : "black"
          }
          strokeWidth={team1Winner || team2Winner ? 2 : 1}
        />
      
      </svg>

      {/* Team 1 */}
      <div 
        className="team-box" 
        style={{ 
          top: 0, 
          backgroundColor: team1Winner ? 'rgba(255, 165, 0, 0.1)' : 'transparent',
          color: (!team1Winner && !team2Winner) ? 'black' : team1Winner == false ? "lightgray" : "black"
        }}
        onClick={() => onTeamClick('team1', t1)}
      >
        {renderTeamContent(t1)}
      </div>
      
      {/* Team 2 */}
      <div 
        className="team-box" 
        style={{ 
          top: boxHeight, 
          backgroundColor: team2Winner ? 'rgba(255, 165, 0, 0.1)' : 'transparent',
          color: (!team1Winner && !team2Winner) ? 'black' : team2Winner == false ? "lightgray" : "black"
        }}
        onClick={() => onTeamClick('team2', t2)}
      >
        {renderTeamContent(t2)}
      </div>
    </div>
  );
};

export default Bracket;
