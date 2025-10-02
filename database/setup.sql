-- Select the correct database
USE betting_platform;

/* 
  The users table stores account details for bettors.
  The balance column is used to track funds for betting.
*/
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY, -- Automatically generates a unique ID for each user.
    username VARCHAR(50) UNIQUE NOT NULL,   -- Ensures each username is unique and not empty.
    email VARCHAR(100) UNIQUE NOT NULL,     -- Ensures email is unique and not empty.
    password_hash VARCHAR(255) NOT NULL,    -- Stores hashed passwords for security.
    balance DECIMAL(10,2) DEFAULT 0.00      -- Stores the user's betting balance.
);

/* 
  The teams table stores basketball teams participating in March Madness.
*/
CREATE TABLE teams (
    team_id INT AUTO_INCREMENT PRIMARY KEY, -- Unique ID for each team.
    team_name VARCHAR(100) NOT NULL,        -- Full team name (e.g., "Duke Blue Devils").
    abbreviation VARCHAR(10) NOT NULL,      -- Short name (e.g., "DUKE").
    region VARCHAR(50) NOT NULL,            -- The region of the team (e.g., "East", "West").
    seed INT NOT NULL,                      -- The team's seed.
    UNIQUE KEY unique_abbreviation (abbreviation)  
);

/*
  The games table tracks matchups between two teams.
  It includes a timestamp and betting odds for both teams.
*/
CREATE TABLE games (
    game_id INT AUTO_INCREMENT PRIMARY KEY, -- Unique identifier for each game.
    team1_id INT,                           -- First team in the matchup.
    team2_id INT,                           -- Second team in the matchup.
    game_time DATETIME NOT NULL,            -- When the game is scheduled.
    team1_score INT DEFAULT 0,              -- Team 1 score, 0 if unstarted (insertGames)
    team2_score INT DEFAULT 0,              -- Team 2 score, 0 if unstarted (insertGames)
    round INT,                              -- New column for round (e.g., 0 = First Four, 1 = Round of 64, 2 = Round of 32, etc.)
    team_favored_id INT,                    -- The team favored to win the match(team1 or team2).
    team_dog_id INT,                        -- The team favored to lose the match(team1 or team2).
    favored_spread INT,                     -- The spread for the team favored to win
    dog_spread INT,                         -- The spread for the team favored to lose
    favored_moneyline INT,                  -- The moneyline odds for the team favored to win
    dog_moneyline INT,                      -- The moneyline odds for the team favored to lose
    FOREIGN KEY (team1_id) REFERENCES teams(team_id),
    FOREIGN KEY (team2_id) REFERENCES teams(team_id),
    FOREIGN KEY (team_favored_id) REFERENCES teams(team_id),
    FOREIGN KEY (team_dog_id) REFERENCES teams(team_id)
);

/*
  The bets table stores user bets on specific games.
  The bet_status column tracks whether the bet is pending, won, or lost.
*/
CREATE TABLE bets (
    bet_id INT AUTO_INCREMENT PRIMARY KEY,  -- Unique identifier for each bet.
    user_id INT,                            -- The user who placed the bet.
    game_id INT,                            -- The game being bet on.
    team_id INT,                            -- The team the user is betting on.
    amount DECIMAL(10,2) NOT NULL,          -- Amount wagered.
    payout DECIMAL(10,2),                   -- Payout after the bet is resolved.
    old_balance DECIMAL(10,2),              -- User's balance before the bet.
    new_balance DECIMAL(10,2),              -- User's balance after the bet.
    bet_status ENUM('pending', 'won', 'lost') DEFAULT 'pending',    -- Tracks bet status.
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (game_id) REFERENCES games(game_id),
    FOREIGN KEY (team_id) REFERENCES teams(team_id)
);
