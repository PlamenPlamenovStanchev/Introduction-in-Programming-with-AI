// TypeScript Types
interface Team {
  name: string;
  played: number;
  won: number;
  lost: number;
  drawn: number;
  goalDiff: number;
  goalsScored: number;
  goalsConceded: number;
  points: number;
}

interface MatchResult {
  scoreTeam1: number;
  scoreTeam2: number;
}

interface Match {
  team1: string;
  team2: string;
  result: MatchResult;
}

function soccerLeague(...commands: string[]): void {
  const teams: Map<string, Team> = new Map();
  let totalMatches = 0;

  // Helper function to create a new team
  function createTeam(name: string): Team {
    return {
      name,
      played: 0,
      won: 0,
      lost: 0,
      drawn: 0,
      goalDiff: 0,
      goalsScored: 0,
      goalsConceded: 0,
      points: 0
    };
  }

  // Helper function to register a match and update stats
  function registerMatch(team1Name: string, team2Name: string, goals1: number, goals2: number): void {
    const team1 = teams.get(team1Name)!;
    const team2 = teams.get(team2Name)!;

    // Update played matches
    team1.played++;
    team2.played++;

    // Update goals
    team1.goalsScored += goals1;
    team1.goalsConceded += goals2;
    team1.goalDiff = team1.goalsScored - team1.goalsConceded;

    team2.goalsScored += goals2;
    team2.goalsConceded += goals1;
    team2.goalDiff = team2.goalsScored - team2.goalsConceded;

    // Determine winner and update points
    if (goals1 > goals2) {
      // Team 1 wins
      team1.won++;
      team1.points += 3;
      team2.lost++;
    } else if (goals2 > goals1) {
      // Team 2 wins
      team2.won++;
      team2.points += 3;
      team1.lost++;
    } else {
      // Draw
      team1.drawn++;
      team2.drawn++;
      team1.points += 1;
      team2.points += 1;
    }

    totalMatches++;
  }

  // Helper function to print standings
  function printStandings(): void {
    console.log(`Standings after ${totalMatches} matches:`);
    console.log("| Rank | Team | Played | Won | Lost | Drawn | Goal Diff | Goals Scored | Points |");

    // Get all teams and sort them
    const sortedTeams = Array.from(teams.values()).sort((a, b) => {
      // 1. Points (descending)
      if (b.points !== a.points) {
        return b.points - a.points;
      }
      // 2. Goal Difference (descending)
      if (b.goalDiff !== a.goalDiff) {
        return b.goalDiff - a.goalDiff;
      }
      // 3. Goals Scored (descending)
      if (b.goalsScored !== a.goalsScored) {
        return b.goalsScored - a.goalsScored;
      }
      // 4. Alphabetically by name (ascending)
      return a.name.localeCompare(b.name);
    });

    // Assign ranks (teams with same stats get same rank)
    let currentRank = 1;
    for (let i = 0; i < sortedTeams.length; i++) {
      const team = sortedTeams[i];
      
      if (i > 0) {
        const prevTeam = sortedTeams[i - 1];
        // Check if current team has same stats as previous
        if (team.points === prevTeam.points && 
            team.goalDiff === prevTeam.goalDiff && 
            team.goalsScored === prevTeam.goalsScored) {
          // Same rank as previous
        } else {
          // New rank is the position (1-indexed)
          currentRank = i + 1;
        }
      }

      console.log(`| ${currentRank} | ${team.name} | ${team.played} | ${team.won} | ${team.lost} | ${team.drawn} | ${team.goalDiff} | ${team.goalsScored} | ${team.points} |`);
    }

    console.log("");
  }

  // Process each command
  for (const command of commands) {
    if (command.startsWith("Team: ")) {
      // Register a new team
      const teamName = command.substring(6);
      teams.set(teamName, createTeam(teamName));
    } else if (command.startsWith("Match: ")) {
      // Parse match: "Match: Team1 - Team2: g1-g2"
      const matchPart = command.substring(7);
      const [teamsPart, scorePart] = matchPart.split(": ");
      const [team1Name, team2Name] = teamsPart.split(" - ");
      const [goals1, goals2] = scorePart.split("-").map(Number);
      
      registerMatch(team1Name, team2Name, goals1, goals2);
    } else if (command === "Standings") {
      printStandings();
    }
  }
}

// Test case
soccerLeague(
  "Team: Real Madrid",
  "Team: Chelsea",
  "Team: Barcelona",
  "Team: Bayern Munich",
  "Standings",
  "Match: Chelsea - Real Madrid: 1-1",
  "Match: Bayern Munich - Barcelona: 2-2",
  "Standings",
  "Match: Bayern Munich - Real Madrid: 1-2",
  "Match: Chelsea - Barcelona: 2-1",
  "Standings",
  "Match: Barcelona - Real Madrid: 2-0",
  "Match: Bayern Munich - Chelsea: 2-4",
  "Team: Manchester United",
  "Team: Liverpool",
  "Match: Manchester United - Liverpool: 2-2",
  "Standings"
);
