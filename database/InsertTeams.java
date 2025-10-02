package database;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.sql.*;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

public class InsertTeams {
    private static final String DB_URL = "jdbc:mysql://db:3306/betting_platform"; // Database connection details
    private static final String DB_USER = "root";
    private static final String DB_PASSWORD = "rootpassword";

    // CSV with game data
    private static final String CSV_FILE = "/app/march_madness_mens_games_2024.csv"; // Path to CSV file inside Docker
    private static final String MAPPING_CSV = "/app/teams_mapping.csv";

    public static void main(String[] args) {
        // Check if the teams table is empty
        if (!isTableEmpty("teams")) {
            System.out.println("Teams table is not empty. Skipping prepopulation.");
            return;
        }
        
        // Extract abbreviations from the games CSV
        Set<String> uniqueTeams = extractAbbreviationsFromGames(CSV_FILE);
        // Load mapping from abbreviations to team details (team_name, region, seed)
        Map<String, String[]> teamMapping = loadTeamMapping(MAPPING_CSV);
        // Insert or update each team using the mapping details
        insertOrUpdateTeams(uniqueTeams, teamMapping);
    }

    /**
     * Checks if the specified table is empty.
     */
    private static boolean isTableEmpty(String tableName) {
        String query = "SELECT COUNT(*) FROM " + tableName;
        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
             PreparedStatement pstmt = conn.prepareStatement(query)) {
            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                int count = rs.getInt(1);
                return count == 0;
            }
        } catch (SQLException e) {
            System.out.println("Error checking table emptiness: " + e.getMessage());
        }
        return false; // Assume not empty if error occurs
    }

    /**
     * Reads main March Madness CSV (games) to collect all unique abbreviations.
     */
    private static Set<String> extractAbbreviationsFromGames(String csvFile) {
        Set<String> uniqueTeams = new HashSet<>();
        try (BufferedReader br = new BufferedReader(new FileReader(csvFile))) {
            br.readLine(); // Skip header
            String line;
            while ((line = br.readLine()) != null) {
                String[] values = line.split(",");
                if (values.length >= 5) {
                    String team1 = values[1].trim(); // team1 abbreviation
                    String team2 = values[3].trim(); // team2 abbreviation
                    uniqueTeams.add(team1);
                    uniqueTeams.add(team2);
                }
            }
            System.out.println("Found " + uniqueTeams.size() + " unique abbreviations from games CSV.");
        } catch (IOException e) {
            System.out.println("CSV Read Error (Games CSV): " + e.getMessage());
        }
        return uniqueTeams;
    }

    /**
     * Loads teams_mapping.csv file, building a map of abbreviation to team details.
     * The mapping CSV is expected to have 4 columns: abbreviation, team_name, region, seed.
     * Returns a Map where the key is the abbreviation and the value is a String array: [team_name, region, seed].
     */
    private static Map<String, String[]> loadTeamMapping(String mappingFile) {
        Map<String, String[]> teamMap = new HashMap<>();
        try (BufferedReader br = new BufferedReader(new FileReader(mappingFile))) {
            br.readLine(); // Skip header
            String line;
            while ((line = br.readLine()) != null) {
                String[] parts = line.split(",");
                // UPDATED: Expect at least 4 columns
                if (parts.length >= 4) {
                    String abbr = parts[0].trim();
                    String fullName = parts[1].trim();
                    String region = parts[2].trim();
                    String seed = parts[3].trim(); // Store seed as String; parse later
                    teamMap.put(abbr, new String[]{fullName, region, seed});
                }
            }
            System.out.println("Loaded " + teamMap.size() + " mappings from " + mappingFile);
        } catch (IOException e) {
            System.out.println("CSV Read Error (Mapping CSV): " + e.getMessage());
        }
        return teamMap;
    }

    /**
     * Inserts or updates each team in the 'teams' table with abbreviation, team_name, region, and seed.
     */
    private static void insertOrUpdateTeams(Set<String> uniqueTeams, Map<String, String[]> teamMapping) {
        String upsertQuery = "INSERT INTO teams (abbreviation, team_name, region, seed) VALUES (?, ?, ?, ?) " +
                             "ON DUPLICATE KEY UPDATE team_name = VALUES(team_name), region = VALUES(region), seed = VALUES(seed)";
        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
             PreparedStatement pstmt = conn.prepareStatement(upsertQuery)) {

            int count = 0;
            for (String abbr : uniqueTeams) {
                String[] details = teamMapping.get(abbr);
                String teamName;
                String region;
                int seed;
                if (details != null) {
                    teamName = details[0];
                    region = details[1];
                    try {
                        seed = Integer.parseInt(details[2]);
                    } catch (NumberFormatException e) {
                        seed = 0; // Default seed if parsing fails
                    }
                } else {
                    teamName = abbr + " - TBD";
                    region = "TBD";
                    seed = 0;
                }
                pstmt.setString(1, abbr);
                pstmt.setString(2, teamName);
                pstmt.setString(3, region);
                pstmt.setInt(4, seed);
                pstmt.executeUpdate();
                count++;
            }
            System.out.println("Inserted or updated " + count + " teams into the database.");
        } catch (SQLException e) {
            System.out.println("Database Insert/Update Error: " + e.getMessage());
        }
    }
}
