import React from "react";
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import './ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { Team, Bowling, Batting, Player } from "../model/model";
import { GridApi } from "ag-grid-community";

export class Scoreboard extends React.Component<{}, { showGrid: boolean }> {

    constructor(props: any) {
        super(props);
        this.state = {
            showGrid: false,
        }
    }

    private data: { [key: string]: any } = require("./../data/cricInfoData.json");
    private playerMap: { [key: string]: Player } = {};
    private gridApi: GridApi = {} as GridApi;
    private showGrid: boolean = false;

    render() {
        return this.viewPointsTable();
    }

    private viewPointsTable() {
        return (
            <div>
                <label>
                    Get JSON from <a target="_blank" href="https://hsapi.espncricinfo.com/v1/pages/match/scoreboard?lang=en&leagueId=8048&eventId=1216492&liveTest=false&qaTest=false">Cricinfo API</a> :: update event id from espncricinfo in the url.
                </label>
                <br />
                <label>JSON data:
                        <input type="text" name="json" id="input" />
                </label>
                <input type="submit" value="Submit" onClick={
                    () => {
                        const element: any = document.getElementById("input");
                        this.playerMap = {};
                        this.processData(element.value);
                    }
                } />
                {
                    this.state.showGrid &&
                    <button
                        onClick={() => {
                            this.gridApi.exportDataAsCsv();
                        }}
                    >
                        Export
                </button>
                }
                {
                    this.state.showGrid &&
                    <div className="ag-theme-alpine" style={{ height: '600px', width: '1250px' }}>
                        <AgGridReact
                            rowData={Object.values(this.playerMap)}
                            onGridReady={(params) => {
                                this.gridApi = params.api;
                            }}>
                            <AgGridColumn field="fullName"></AgGridColumn>
                            <AgGridColumn field="battingPoints"></AgGridColumn>
                            <AgGridColumn field="bowlingPoints"></AgGridColumn>
                            <AgGridColumn field="fieldingPoints"></AgGridColumn>
                            <AgGridColumn field="specialPoints"></AgGridColumn>
                            <AgGridColumn field="totalPoints"></AgGridColumn>
                            <AgGridColumn field="team"></AgGridColumn>
                            <AgGridColumn field="roleId"></AgGridColumn>
                            <AgGridColumn field="name"></AgGridColumn>
                            <AgGridColumn field="shortText"></AgGridColumn>
                            <AgGridColumn field="runs"></AgGridColumn>
                            <AgGridColumn field="ballsFaced"></AgGridColumn>
                            <AgGridColumn field="fours"></AgGridColumn>
                            <AgGridColumn field="sixes"></AgGridColumn>
                            <AgGridColumn field="strikeRate"></AgGridColumn>
                            <AgGridColumn field="ballsBowled"></AgGridColumn>
                            <AgGridColumn field="conceded"></AgGridColumn>
                            <AgGridColumn field="maidens"></AgGridColumn>
                            <AgGridColumn field="wickets"></AgGridColumn>
                            <AgGridColumn field="dots"></AgGridColumn>
                            <AgGridColumn field="economyRate"></AgGridColumn>
                            <AgGridColumn field="fieldingActions"></AgGridColumn>
                        </AgGridReact>
                    </div>
                }
            </div>
        );
    }

    private processData(json: string) {
        if (json === "test" || !json) {
            this.data = require("./../data/cricInfoData.json");
        } else {
            this.data = JSON.parse(json);
        }
        Object.keys(this.playerMap).length === 0 && this.data["content"]["teams"].map(
            (team: Team) => {
                team.players.map(
                    (player: Player) => {
                        player.fullName=player.name;
                        player.battingPoints=0;
                        player.bowlingPoints=0;
                        player.fieldingPoints=0;
                        player.specialPoints=0;
                        player.totalPoints=0;
                        player.team=team.title;
                        player.runs=0;
                        player.ballsFaced=0;
                        player.fours=0;
                        player.sixes=0;
                        player.strikeRate=0;
                        player.ballsBowled=0;
                        player.maidens=0;
                        player.wickets=0;
                        player.dots=0;
                        player.economyRate=0;
                        player.fieldingActions=0;
                        player.conceded=0;
                        this.playerMap[player.fullName] = player;
                    }
                );
            }
        );

        this.data["content"]["innings"].map(
            (inn: any) => {
                inn["batsmen"].map(
                    (battingData: Batting) => {
                        this.playerMap[battingData.fullName].ballsFaced = parseInt(battingData.ballsFaced);
                        this.playerMap[battingData.fullName].fours = parseInt(battingData.fours);
                        this.playerMap[battingData.fullName].fullName = battingData.fullName;
                        this.playerMap[battingData.fullName].name = battingData.name;
                        this.playerMap[battingData.fullName].runs = parseInt(battingData.runs);
                        this.playerMap[battingData.fullName].shortText = (battingData.shortText)
                            .replace(/&[^dagger;]*dagger;?/gm, '')
                            .replace(/&[^amp;]*amp;?/gm, '&');
                        this.playerMap[battingData.fullName].sixes = parseInt(battingData.sixes);
                        this.playerMap[battingData.fullName].strikeRate = parseFloat(battingData.strikeRate);
                    }
                );
                inn["bowlers"].map(
                    (bowlData: Bowling) => {
                        this.playerMap[bowlData.fullName].dots = parseInt(bowlData.dots);
                        this.playerMap[bowlData.fullName].economyRate = parseFloat(bowlData.economyRate);
                        this.playerMap[bowlData.fullName].fullName = bowlData.fullName;
                        this.playerMap[bowlData.fullName].maidens = parseInt(bowlData.maidens);
                        this.playerMap[bowlData.fullName].name = bowlData.name;
                        this.playerMap[bowlData.fullName].ballsBowled = this.getNumberOfBallsBowled(bowlData.overs);
                        this.playerMap[bowlData.fullName].wickets = parseInt(bowlData.wickets);
                        this.playerMap[bowlData.fullName].conceded = parseInt(bowlData.conceded);
                    }
                );
            }
        );
        this.calculatePoints();
        this.setState(
            { showGrid: true }
        )
    }

    private getNumberOfBallsBowled(overs: string): number {
        let balls = 0;
        const str: string[] = overs.split('.');
        balls+= 6*(parseInt(str[0]));
        if(str.length == 2){
            balls += parseInt(str[1]);
        }
        return balls;
    }

    private calculatePoints() {
        this.calculateBattingPoints();
        this.calculateBowlingPoints();
        this.calculateTotalPoints();
    }

    private calculateBattingPoints() {
        Object.values(this.playerMap).map(
            (player: Player) => {
                let points: number = 0;
                // Base points
                points += player.runs;
                // Pace points
                points += (player.runs - player.ballsFaced)
                // impact points
                points += player.runs < 25 
                            ? 0 : player.runs < 50 
                                ? 5 : player.runs < 75
                                    ? 15 : player.runs < 100
                                        ? 30 : 50;
                // milestones points
                points += player.fours;
                points += 2 * player.sixes;
                if(player.runs === 0 && player.roleId !== "BL"){
                    points -= 5;
                }
                player.battingPoints = points;
            }
        );
    }

    private calculateBowlingPoints() {
        Object.values(this.playerMap).map(
            (player: Player) => {
                let points: number = 0;
                // Base points
                points += player.wickets * 20;
                // Pace points
                const pace: number = 1.5 * player.ballsBowled - player.conceded;
                points += pace > 0 ? pace * 2 : pace;
                // impact points
                points += player.wickets < 2 
                            ? 0 : player.wickets < 3 
                                ? 5 : player.wickets < 4
                                    ? 15 : player.wickets < 5
                                        ? 30 : 50;
                // milestones points
                points += player.dots;
                points += 25 * player.maidens;
                player.bowlingPoints = points;
            }
        );
    }

    private calculateTotalPoints() {
        Object.values(this.playerMap).map(
            (player: Player) => {
                player.totalPoints = 
                    player.battingPoints 
                    + player.bowlingPoints 
                    + player.fieldingPoints 
                    + player.specialPoints;
            }
        );
    }
}