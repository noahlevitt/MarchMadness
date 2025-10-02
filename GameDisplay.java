import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.sql.*;

public class GameDisplay {
    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(5002), 0);
        server.createContext("/games", new GameHandler());
        server.setExecutor(null);
        server.start();
        System.out.println("GameDisplay server running at http://localhost:5002/games");
    }

    static class GameHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().set("Content-Type", "application/json");

            if (!"GET".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(405, -1); // Method not allowed
                return;
            }

            String json = getGamesJson();
            byte[] responseBytes = json.getBytes();

            exchange.sendResponseHeaders(200, responseBytes.length);
            OutputStream os = exchange.getResponseBody();
            os.write(responseBytes);
            os.close();
        }
    }

    public static String getGamesJson() {
        StringBuilder result = new StringBuilder("[");
        try (Connection conn = DriverManager.getConnection(
                "jdbc:mysql://db:3306/betting_platform", "root", "rootpassword");
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(
                     "SELECT g.game_id, g.game_time, g.team1_odds, g.team2_odds, " +
                     "t1.name AS team1_name, t2.name AS team2_name " +
                     "FROM games g " +
                     "JOIN teams t1 ON g.team1_id = t1.team_id " +
                     "JOIN teams t2 ON g.team2_id = t2.team_id")) {

            while (rs.next()) {
                result.append("{")
                      .append("\"game_id\":").append(rs.getInt("game_id")).append(",")
                      .append("\"team1_name\":\"").append(escapeJson(rs.getString("team1_name"))).append("\",")
                      .append("\"team2_name\":\"").append(escapeJson(rs.getString("team2_name"))).append("\",")
                      .append("\"game_time\":\"").append(rs.getTimestamp("game_time")).append("\",")
                      .append("\"team1_odds\":").append(rs.getBigDecimal("team1_odds")).append(",")
                      .append("\"team2_odds\":").append(rs.getBigDecimal("team2_odds"))
                      .append("},");
            }

            if (result.length() > 1) {
                result.setLength(result.length() - 1); // Remove trailing comma
            }

            result.append("]");
        } catch (SQLException e) {
            return "{\"error\":\"Database error: " + escapeJson(e.getMessage()) + "\"}";
        }
        return result.toString();
    }

    // Escape double quotes and backslashes for safe JSON output
    private static String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}
