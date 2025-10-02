import { useMemo } from 'react';
import { useGames } from "../../contexts/GetGamesContext";
import { useTeams } from "../../contexts/GetTeamsContext";

const createEmptyMatchup = () => ([
  { seed: '', name: '', score: null, abv: '' },
  { seed: '', name: '', score: null, abv: '' }
]);

const createRegionStructure = () => ({
  firstFour: [],
  first: Array(8).fill(0).map(createEmptyMatchup),
  second: Array(4).fill(0).map(createEmptyMatchup),
  sweet16: Array(2).fill(0).map(createEmptyMatchup),
  elite8: [createEmptyMatchup()]
});

// Define bracket structure with seed pairs
const firstRoundOrder = [
  [1, 16], [8, 9], [5, 12], [4, 13], [6, 11], [3, 14], [7, 10], [2, 15]
];

// Define which seeds would be in team1 (upper) position in each round based on the provided structure
const upperSeedsByRound = {
  first: [1, 8, 5, 4, 6, 3, 7, 2],
  second: [1, 16, 5, 12, 6, 11, 7, 10],
  sweet16: [1, 16, 8, 9, 6, 11, 3, 14],
  elite8: [1, 16, 8, 9, 5, 12, 4, 13]
};

// Maps positions to potential seeds for each round
const seedMappings = {
  first: firstRoundOrder,
  second: [
    [1, 16, 8, 9],     
    [5, 12, 4, 13],    
    [6, 11, 3, 14],    
    [7, 10, 2, 15]     
  ],
  sweet16: [
    [1, 16, 8, 9, 5, 12, 4, 13],
    [6, 11, 3, 14, 7, 10, 2, 15]
  ],
  elite8: [
    [1, 16, 8, 9, 5, 12, 4, 13, 6, 11, 3, 14, 7, 10, 2, 15]
  ]
};

const useTournamentData = () => {
  const { games, loading: gamesLoading, error: gamesError } = useGames();
  const { teams, loading: teamsLoading, error: teamsError } = useTeams();

  const tournamentData = useMemo(() => {
    const structure = {
      regions: {
        South: createRegionStructure(),
        East: createRegionStructure(),
        West: createRegionStructure(),
        Midwest: createRegionStructure()
      },
      finalFour: Array(2).fill(0).map(createEmptyMatchup),
      championship: [createEmptyMatchup()]
    };

    if (!games || !teams || gamesLoading || teamsLoading) {
      return structure;
    }

    // Create lookup maps for faster access
    const teamsById = Object.fromEntries(teams.map(team => [team.team_id, team]));
    const roundNames = ['first', 'second', 'sweet16', 'elite8'];
    
    // Sort games into rounds and regions
    const gamesByRegionAndRound = {};
    const finalFourGames = [];
    const championshipGames = [];

    // Process games into structured format
    games.forEach(game => {
      const team1 = teamsById[game.team1_id];
      const team2 = teamsById[game.team2_id];
      
      // Create team data objects
      const team1Data = {
        seed: team1?.seed ?? '',
        name: team1?.team_name ?? 'TBD',
        score: game?.team1_score != null ? game.team1_score.toString() : null,
        abv: team1?.abbreviation
      };
      
      const team2Data = {
        seed: team2?.seed ?? '',
        name: team2?.team_name ?? 'TBD',
        score: game?.team2_score != null ? game.team2_score.toString() : null,
        abv: team2?.abbreviation
      };
      
      // Parse seeds as numbers for comparison
      const seed1 = parseInt(team1Data.seed);
      const seed2 = parseInt(team2Data.seed);
      
      // Handle by round
      if (game.round === 0) {
        // First Four
        const region = team1?.region === "First Four" ? team2?.region : team1?.region;
        if (region && structure.regions[region]) {
          if (!structure.regions[region].firstFour) {
            structure.regions[region].firstFour = [];
          }
          structure.regions[region].firstFour.push([team1Data, team2Data]);
        }
      } else if (game.round === 5) {
        // Final Four
        finalFourGames.push([team1Data, team2Data]);
      } else if (game.round === 6) {
        // Championship
        championshipGames.push([team1Data, team2Data]);
      } else if (game.round >= 1 && game.round <= 4) {
        // Regular rounds
        const region = team1?.region || team2?.region;
        if (!region) return;
        
        const roundName = roundNames[game.round - 1];
        
        if (!gamesByRegionAndRound[region]) {
          gamesByRegionAndRound[region] = {};
        }
        if (!gamesByRegionAndRound[region][roundName]) {
          gamesByRegionAndRound[region][roundName] = [];
        }
        
        // Store both original order and seeds for proper placement
        gamesByRegionAndRound[region][roundName].push({
          team1: team1Data,
          team2: team2Data,
          seed1,
          seed2,
          originalOrder: [team1Data, team2Data]
        });
      }
    });

    // Place games in the correct bracket positions
    Object.entries(gamesByRegionAndRound).forEach(([region, roundData]) => {
      // Handle each round
      roundNames.forEach(roundName => {
        if (!roundData[roundName]) return;
        
        const validPositions = seedMappings[roundName];
        const upperSeeds = upperSeedsByRound[roundName];
        
        if (!validPositions) return;
        
        // Place each game in its correct position based on seeds
        validPositions.forEach((validSeeds, position) => {
          // Find a game where at least one team has a seed in validSeeds
          const matchIndex = roundData[roundName].findIndex(game => 
            validSeeds.includes(game.seed1) || validSeeds.includes(game.seed2)
          );
          
          if (matchIndex !== -1) {
            const game = roundData[roundName][matchIndex];
            let matchup;
            
            // Check if seeds match the upper position pattern for this round
            if (upperSeeds.includes(game.seed1)) {
              // Seed1 should be in upper position
              matchup = game.originalOrder;
            } else if (upperSeeds.includes(game.seed2)) {
              // Seed2 should be in upper position, so swap
              matchup = [game.team2, game.team1];
            } else {
              // If neither seed is in upperSeeds, use original order
              matchup = game.originalOrder;
            }
            
            structure.regions[region][roundName][position] = matchup;
            roundData[roundName].splice(matchIndex, 1);
          }
        });
      });
    });

    // Add Final Four and Championship games
    finalFourGames.forEach((matchup, i) => {
      if (i < structure.finalFour.length) {
        structure.finalFour[i] = matchup;
      }
    });
    
    if (championshipGames.length && structure.championship.length) {
      structure.championship[0] = championshipGames[0];
    }

    return structure;
  }, [games, teams, gamesLoading, teamsLoading]);

  return {
    tournamentData,
    loading: gamesLoading || teamsLoading,
    error: gamesError || teamsError
  };
};

export default useTournamentData;