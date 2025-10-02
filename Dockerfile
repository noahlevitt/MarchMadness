FROM openjdk:17-slim
WORKDIR /app

# COPY GSON dependencies
COPY gson-2.10.1.jar .

# Copy Java source code
COPY BackendMain.java .
COPY Parser.java .
COPY database/ ./database/
COPY database/InsertBets.java database/

# Copy the CSV files from the 2024_game_results subdirectory
COPY 2024_game_results/march_madness_mens_games_2024.csv ./
COPY 2024_game_results/teams_mapping.csv ./

# Install required dependencies
RUN apt-get update && apt-get install -y wget curl

# Download MySQL Connector
RUN wget -O mysql-connector-java-8.3.0.jar https://repo1.maven.org/maven2/com/mysql/mysql-connector-j/8.3.0/mysql-connector-j-8.3.0.jar

# Compile Java program
RUN javac -cp ".:mysql-connector-java-8.3.0.jar:gson-2.10.1.jar" BackendMain.java database/InsertTeams.java database/InsertGames.java database/InsertBets.java

# Wait for MySQL to be ready, run the prefill scripts, then start the backend server
CMD sh -c "echo 'Waiting for MySQL to be ready...'; sleep 20; \
echo 'Running InsertTeams prefill...'; \
java -cp '.:mysql-connector-java-8.3.0.jar:gson-2.10.1.jar' database.InsertTeams; \
echo 'Running InsertGames prefill...'; \
java -cp '.:mysql-connector-java-8.3.0.jar:gson-2.10.1.jar' database.InsertGames; \
echo 'Starting backend HTTP server...'; \
java -cp '.:mysql-connector-java-8.3.0.jar:gson-2.10.1.jar' BackendMain"