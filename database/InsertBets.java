package database;

import java.sql.*;

public class InsertBets {
    private static final String DB_URL = "jdbc:mysql://db:3306/betting_platform";
    private static final String DB_USER = "root";
    private static final String DB_PASSWORD = "rootpassword";

    public static double getUserBalance(int user_id) {
        String query = "SELECT balance FROM users WHERE user_id = ?";
        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
             PreparedStatement pstmt = conn.prepareStatement(query)) {
            pstmt.setInt(1, user_id);
            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                return rs.getDouble("balance");
            }
        } catch (SQLException e) {
            System.out.println("Database Query Error (getUserBalance): " + e.getMessage());
        }
        return 0.0;
    }

    public static double betHandler(int game_id, int team_bet_id, int user_id, double current_user_balance, double bet_amount, int bet_type) {
        double temp_user_balance = current_user_balance;

        int team1_id = -1, team2_id = -1;
        int team1_score = 0, team2_score = 0;
        int favored_spread = 0, dog_spread = 0;
        int favored_moneyline = -110, dog_moneyline = 110;
        int favored_id = -1, dog_id = -1;

        String query = "SELECT * FROM games WHERE game_id = ?";

        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
             PreparedStatement pstmt = conn.prepareStatement(query)) {

            pstmt.setInt(1, game_id);
            ResultSet rs = pstmt.executeQuery();

            if (rs.next()) {
                team1_id = rs.getInt("team1_id");
                team2_id = rs.getInt("team2_id");
                team1_score = rs.getInt("team1_score");
                team2_score = rs.getInt("team2_score");
                favored_id = rs.getInt("team_favored_id");
                dog_id = rs.getInt("team_dog_id");
                favored_spread = rs.getInt("favored_spread");
                dog_spread = rs.getInt("dog_spread");
                favored_moneyline = rs.getInt("favored_moneyline");
                dog_moneyline = rs.getInt("dog_moneyline");
            }

        } catch (SQLException e) {
            System.out.println("Error fetching game data: " + e.getMessage());
            return 0.0;
        }

        boolean bet_won = false;
        int bet_outcome = 0;

        if (bet_type == 1) { // spread
            if (team_bet_id == favored_id) {
                if ((favored_id == team1_id && team1_score - team2_score > Math.abs(favored_spread)) ||
                    (favored_id == team2_id && team2_score - team1_score > Math.abs(favored_spread))) {
                    bet_won = true;
                }
            } else if (team_bet_id == dog_id) {
                if ((dog_id == team1_id && team1_score + dog_spread > team2_score) ||
                    (dog_id == team2_id && team2_score + dog_spread > team1_score)) {
                    bet_won = true;
                }
            }
        } else { // moneyline
            if ((team_bet_id == team1_id && team1_score > team2_score) ||
                (team_bet_id == team2_id && team2_score > team1_score)) {
                bet_won = true;
            }
        }

        double payout = 0.0;
        if (bet_type == 1) {
            payout = bet_won ? bet_amount * (1 + (100.0 / 110.0)) : 0.0;
        } else {
            int odds = (team_bet_id == favored_id) ? favored_moneyline : dog_moneyline;
            if (bet_won) {
                if (odds < 0) {
                    payout = bet_amount * (1 + (100.0 / Math.abs(odds)));
                } else {
                    payout = bet_amount * (1 + (odds / 100.0));
                }
            }
        }

        return payout;
    }

    /**
     * Inserts a pending bet (payout zero) and updates the user’s balance immediately.
     * Then returns the new bet_id for later resolution.
     * @param user_id     the ID of the user placing the bet
     * @param game_id     the game being wagered on
     * @param team_id     the team the user is betting on
     * @param amount      the amount wagered
     * @param payout      the (potential) payout; zero for pending
     * @param old_balance the user’s balance before placing the bet
     * @param new_balance the user’s balance after placing the bet (old_balance minus amount)
     * @return the generated bet_id, or -1 on failure
     */
    public static int insertBet(int user_id,
                                int game_id,
                                int team_id,
                                double amount,
                                double payout,
                                double old_balance,
                                double new_balance) {
        String insertSql =
            "INSERT INTO bets (user_id, game_id, team_id, amount, payout, old_balance, new_balance) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?)";
        String updateSql =
            "UPDATE users SET balance = ? WHERE user_id = ?";

        int betId = -1;

        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
            conn.setAutoCommit(false);  // start transaction

            try (PreparedStatement psInsert = conn.prepareStatement(insertSql, Statement.RETURN_GENERATED_KEYS);
                PreparedStatement psUpdate = conn.prepareStatement(updateSql)) {

                // bind insert parameters
                psInsert.setInt(1, user_id);
                psInsert.setInt(2, game_id);
                psInsert.setInt(3, team_id);
                psInsert.setDouble(4, amount);
                psInsert.setDouble(5, payout);
                psInsert.setDouble(6, old_balance);
                psInsert.setDouble(7, new_balance);

                int rows = psInsert.executeUpdate();
                System.out.println(">>> insertBet: inserted rows=" + rows);

                // grab the generated bet_id
                try (ResultSet rs = psInsert.getGeneratedKeys()) {
                    if (rs.next()) {
                        betId = rs.getInt(1);
                        System.out.println(">>> insertBet: new bet_id=" + betId);
                    }
                }

                // update the user’s balance
                psUpdate.setDouble(1, new_balance);
                psUpdate.setInt(2, user_id);
                int updated = psUpdate.executeUpdate();
                System.out.println(">>> insertBet: updated balance rows=" + updated);

                conn.commit();
            } catch (SQLException e) {
                conn.rollback();
                System.out.println(">>> insertBet: transaction rolled back due to " + e.getMessage());
                throw e;
            } finally {
                conn.setAutoCommit(true);
            }

        } catch (SQLException e) {
            System.out.println("Database Insert Error (insertBet): " + e.getMessage());
        }

        return betId;
    }
}