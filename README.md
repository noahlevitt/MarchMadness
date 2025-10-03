# Specification Document

This document serves as a living reference for the March Madness Betting Platform. It will be updated regularly to reflect changes in project architecture, specifications, and development decisions.

## One-Click Demo (no setup)

Click to launch a GitHub Codespace that builds and runs the full stack:

[![Open in GitHub Codespaces](https://img.shields.io/badge/Open%20in-Codespaces-181717?logo=github)](https://github.com/codespaces/new?hide_repo_select=true&ref=master&repo=YOUR_REPO_ID)

After the Codespace starts, open the **Ports** panel and click the forwarded web port to view the app.

### Project Abstract

The March Madness Betting Platform allows users to place bets on March Madness games through an interface. The system consists of a frontend built in React.js, a backend using a plain Java HTTP server, and a MySQL database to store betting data. Users interact with the interface to place bets, which are logged in the database for tracking. Future enhancements includes authentication, game tracking, and additional betting features.

### Customer

This software is designed for:
- *Casual March Madness fans* who want to participate in friendly betting.
- *Betting enthusiasts* looking for an easy and lightweight platform to use.
- *Instructional staff from CS506*

### Specification

#### Technology Stack

```mermaid
flowchart RL
subgraph Front End
	A(React.js)
end
	
subgraph Back End
	B(Java HTTP Server)
end
	
subgraph Database
	C[(MySQL)]
end

A <-->|"Fetch API"| B
B <-->|"SQL Queries"| C
```

#### Database

```mermaid
---
title: Database for Betting Platform
---
erDiagram
    User ||--o{ Bet : "places"
    Bet ||--o{ Game : "on"

    User {
        int user_id PK
        string username
        string email
    }

    Bet {
        int bet_id PK
        int user_id FK
        decimal amount
        string bet_type
    }

    Game {
        int game_id PK
        string team_one
        string team_two
        date game_date
    }
```

#### Class Diagram
```mermaid
---
title: Class Diagram for Betting Platform
---
classDiagram

    class User {
        - int user_id
        - string username
        - string email
    }

    class Bet {
        - int bet_id
        - int user_id
        - decimal amount
        - string bet_type
    }

    class Game {
        - int game_id
        - string team_one
        - string team_two
        - date game_date
    }
    User <|-- Bet
    Bet <|-- Game
```

#### Flowchart

```mermaid
---
title: Program Flowchart
---
graph TD;
    Start([User Opens Website]) --> ClickBet[Clicks Bet];
    ClickBet --> APIRequest[API Request Sent to Backend];
    APIRequests --> BackendProcess[Backend Processes Bet];
    BackendProcess --> DBUpdate[Database Logs Bet];
    DBUpdate --> SuccessMessage[Confirmation Sent to User];
```

#### Behavior

```mermaid
---
title: State Diagram For Betting Application
---
stateDiagram
    [*] --> Ready
    Ready --> PlacingBet : User Clicks "Bet"
    PlacingBet --> Processing : Backend Logs Bet
    Processing --> Completed : Confirmation Sent
```

#### Sequence Diagram

```mermaid
sequenceDiagram

participant ReactFrontend
participant JavaBackend
participant MySQLDatabase

ReactFrontend ->> JavaBackend: HTTP POST /bet

JavaBackend ->> MySQLDatabase: INSERT INTO bets

MySQLDatabase -->> JavaBackend: Success

JavaBackend -->> ReactFrontend:"Bet placed successfully!"
```

### Standards & Conventions

<!--This is a link to a seperate coding conventions document / style guide-->
[Style Guide & Conventions](STYLE.md)
