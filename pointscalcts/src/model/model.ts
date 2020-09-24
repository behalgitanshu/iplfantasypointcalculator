export interface Team {
    title: string,
    players: Player[],
}

export interface Player {
    name: string,
    role: string,
    roleId: string,
    team: string,
    fullName: string,
    shortText: string,
    runs: number,
    ballsFaced: number,
    fours: number,
    sixes: number,
    strikeRate: number,
    ballsBowled: number,
    maidens: number,
    wickets: number,
    conceded: number,
    dots: number,
    economyRate: number,
    fieldingActions: number,
    battingPoints: number,
    bowlingPoints: number,
    fieldingPoints: number,
    specialPoints: number,
    totalPoints: number,
}

export interface Batting {
    name: string;
    fullName: string,
    shortText: string,
    runs: string,
    ballsFaced: string,
    fours: string,
    sixes: string,
    strikeRate: string,
}

export interface Bowling {
    name: string;
    fullName: string,
    overs: string,
    maidens: string,
    wickets: string,
    dots: string,
    economyRate: string,
    conceded: string,
}

export interface FantasyPlayer {
    Name: string,
    TeamName: string,
    SkillName: string,
    IS_FP: string,
    Value: string,
    OverallPoints: number,
}