package database;

import java.io.*;
import java.sql.*;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;  // This imports java.util.Date, which conflicts with java.sql.Date

public class InsertGames {
    private static final String DB_URL = "jdbc:mysql://db:3306/betting_platform"; // Database connection details
    private static final String DB_USER = "root";
    private static final String DB_PASSWORD = "rootpassword";
    private static final String CSV_FILE = "/app/march_madness_mens_games_2024.csv"; // Path to CSV file inside Docker

    public static void main(String[] args) {
        // DEBUG: Startup message for debugging
        // System.out.println("Starting InsertGames prefill...");
        try (BufferedReader br = new BufferedReader(new FileReader(CSV_FILE))) {
            String line;
            // DEBUG: Read and print CSV header
            String header = br.readLine();
            System.out.println("CSV Header: " + header);
            int rowCount = 0; // DEBUG: Row counter

            while ((line = br.readLine()) != null) {
                rowCount++; // DEBUG: Increment row count
                // DEBUG: Print the raw row content
                // System.out.println("Processing row " + rowCount + ": " + line);

                String[] values = line.split(",");
                // DEBUG: Print column count and values array
                // System.out.println("Row " + rowCount + " has " + values.length + " columns: " + Arrays.toString(values));
                
                if (values.length >= 9) {
                    String team1 = values[1].trim();
                    String team2 = values[3].trim();
                    int team1_score = Integer.parseInt(values[2].trim());
                    int team2_score = Integer.parseInt(values[4].trim());
                    String game_date = values[0].trim();

                    // DEBUG: Print extracted values
                    // System.out.println("Row " + rowCount + ": team1 = " + team1 + ", team2 = " + team2 +
                    //                    ", team1_score = " + team1_score + ", team2_score = " + team2_score +
                    //                    ", game_date = " + game_date);
                    
                    // Convert CSV date "M/D/YYYY" → "YYYY-MM-DD"
                    String mysqlDate = convertDate(game_date);
                    if (mysqlDate == null) {
                        System.out.println("Row " + rowCount + ": Skipping row due to date parse error.");
                        continue;
                    }
                    // DEBUG: Print converted date
                    // System.out.println("Row " + rowCount + ": Converted date = " + mysqlDate);

                    // Parse round from CSV (9th column, index 8)   
                    int round = 0;                 
                    try {
                        round = Integer.parseInt(values[8].trim());
                    } catch (NumberFormatException e) {
                        System.out.println("Round parse error: " + e.getMessage());
                        continue;
                    }


                    // Look up team IDs from the teams table
                    int team1_id = getTeamId(team1);
                    int team2_id = getTeamId(team2);
                    // DEBUG: Print team lookup results
                    // System.out.println("Row " + rowCount + ": Team lookup: " + team1 + " -> " + team1_id +
                    //                    ", " + team2 + " -> " + team2_id);
                    

                    // Check which team is favored. Set the id of the team to be associated with whichever team is favored.
                    // Then pull in the spread and moneyline for both teams.
                    // Check from the CSV which of the teams is supposed to be favored by team num in the matchup
                    int team_favored_num = Integer.parseInt(values[9].trim());
                    int team_dog_num = Integer.parseInt(values[12].trim());
                    // Create variables to hold each necessary piece of betting information for both teams, by underdog or favorite
                    int team_favored_id = -1;
                    int team_dog_id = -1;
                    if (team_favored_num == 1){
                        team_favored_id = team1_id;
                        team_dog_id = team2_id;
                    } else if (team_dog_num == 1){
                        team_favored_id = team2_id;
                        team_dog_id = team1_id;
                    }
                    int team_favored_spread = 0;
                    int team_favored_moneyline = 0;
                    int team_dog_spread = 0;
                    int team_dog_moneyline = 0;
                    team_favored_spread = Integer.parseInt(values[10].trim());
                    team_favored_moneyline = Integer.parseInt(values[11].trim());
                    team_dog_spread = Integer.parseInt(values[13].trim());
                    team_dog_moneyline = Integer.parseInt(values[14].trim()); 


                    if (team1_id != -1 && team2_id != -1) {
                        insertGame(team1_id, team2_id, team1_score, team2_score, mysqlDate, round, team_favored_id, team_dog_id, team_favored_spread, team_dog_spread, team_favored_moneyline, team_dog_moneyline);
                    } else {
                        System.out.println("Row " + rowCount + ": Skipping game. Could not find IDs for " 
                            + team1 + " or " + team2);
                    }
                } else {
                    System.out.println("Row " + rowCount + ": Skipping due to insufficient columns.");
                }
            }
            // DEBUG: Summary after processing all rows
            // System.out.println("Finished processing " + rowCount + " rows.");
        } catch (IOException e) {
            System.out.println("CSV Read Error: " + e.getMessage());
        }
    }
   
    // Converts "M/D/YYYY" to "YYYY-MM-DD"
    public static String convertDate(String csvDate) { 
        SimpleDateFormat originalFormat = new SimpleDateFormat("M/d/yyyy"); 
        SimpleDateFormat targetFormat = new SimpleDateFormat("yyyy-MM-dd"); 
        try {
            java.util.Date dateObj = originalFormat.parse(csvDate);
            return targetFormat.format(dateObj);
        } catch (ParseException e) {
            System.out.println("Date Parse Error: " + e.getMessage());
            return null;
        }
    }

    // Retrieves team_id from the teams table
    public static int getTeamId(String abbreviation) {
        String query = "SELECT team_id FROM teams WHERE abbreviation = ?";
        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
             PreparedStatement pstmt = conn.prepareStatement(query)) {
            pstmt.setString(1, abbreviation);
            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                return rs.getInt("team_id");
            }
        } catch (SQLException e) {
            System.out.println("Database Query Error (getTeamId) for " + abbreviation + ": " + e.getMessage());
        }
        return -1;
    }

    /**
     * Inserts a row into the games table.
     *
     * @param team1_id                The unique ID of the first team.
     * @param team2_id                The unique ID of the second team.
     * @param team1_score             The final score of the first team.
     * @param team2_score             The final score of the second team.
     * @param game_date               The date of the game in "yyyy-MM-dd" format.
     * @param round                   The round identifier (e.g., 1 = Round of 64, 2 = Round of 32, etc.).  // ADDED documentation
     * @param team_favored_id         The id of the favored team
     * @param team_dog_id             The id of the underdog team
     * @param team_favored_spread     The spread for the favorite
     * @param team_dog_spread         The spread for the dog
     * @param team_favored_moneyline  The moneyline for the favorite
     * @param team_dog_moneyline      The moneyline for the dog
     */
    public static void insertGame(int team1_id, int team2_id, int team1_score, int team2_score, String game_date, int round, int team_favored_id, int team_dog_id, int team_favored_spread, int team_dog_spread, int team_favored_moneyline, int team_dog_moneyline) {
        String insertQuery = "INSERT INTO games (team1_id, team2_id, team1_score, team2_score, game_time, round, team_favored_id, team_dog_id, favored_spread, dog_spread, favored_moneyline, dog_moneyline) "
                           + "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
             PreparedStatement pstmt = conn.prepareStatement(insertQuery)) {
            pstmt.setInt(1, team1_id);
            pstmt.setInt(2, team2_id);
            pstmt.setInt(3, team1_score);
            pstmt.setInt(4, team2_score);
            pstmt.setString(5, game_date);
            pstmt.setInt(6, round);
            pstmt.setInt(7, team_favored_id);
            pstmt.setInt(8, team_dog_id);
            pstmt.setInt(9, team_favored_spread);
            pstmt.setInt(10, team_dog_spread);
            pstmt.setInt(11, team_favored_moneyline);
            pstmt.setInt(12, team_dog_moneyline);  
            pstmt.executeUpdate();
            // DEBUG: Print confirmation of insertion
            // System.out.println("Inserted game: " + team1_id + " vs. " + team2_id + " on " + game_date + " (Round " + round + ")");
        } catch (SQLException e) {
            System.out.println("Database Insert Error (insertGame): " + e.getMessage());
        }
    }
}
