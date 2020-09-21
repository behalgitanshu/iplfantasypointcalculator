import React from "react";
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import './ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { Team, Bowling, Batting, Player } from "../model/model";
import { ValueGetterParams } from "ag-grid-community";
import { decode } from "punycode";

export class Scoreboard extends React.Component<{}> {

    // private getData(){
    //     fetch("https://hsapi.espncricinfo.com/v1/pages/match/scoreboard?lang=en&leagueId=8048&eventId=1216492&liveTest=false&qaTest=false").then(
    //         (data: any) => {
    //             console.log(data);
    //         }
    //     );
    // }

    private data: { [key: string]: any } = require("./../data/cricInfoData.json");
    private playerMap: { [key: string]: Player } = {};

    render() {
        this.processData();
        // this.writeToExcel();
        return this.viewPointsTable();
    }

    private viewPointsTable() {
        return (
            <div>
                <div className="ag-theme-alpine" style={{ height: '600px', width: '1200px' }}>
                    <AgGridReact
                        rowData={Object.values(this.playerMap)}>
                        <AgGridColumn field="team"></AgGridColumn>
                        <AgGridColumn field="fullName"></AgGridColumn>
                        <AgGridColumn field="name"></AgGridColumn>
                        <AgGridColumn field="roleId"></AgGridColumn>
                        <AgGridColumn field="shortText"></AgGridColumn>
                        <AgGridColumn field="runs"></AgGridColumn>
                        <AgGridColumn field="ballsFaced"></AgGridColumn>
                        <AgGridColumn field="fours"></AgGridColumn>
                        <AgGridColumn field="sixes"></AgGridColumn>
                        <AgGridColumn field="strikeRate"></AgGridColumn>
                        <AgGridColumn field="overs"></AgGridColumn>
                        <AgGridColumn field="maidens"></AgGridColumn>
                        <AgGridColumn field="wickets"></AgGridColumn>
                        <AgGridColumn field="dots"></AgGridColumn>
                        <AgGridColumn field="economyRate"></AgGridColumn>
                        <AgGridColumn field="fielding"></AgGridColumn>
                        <AgGridColumn field="battingPoints"></AgGridColumn>
                        <AgGridColumn field="bowlingPoints"></AgGridColumn>
                        <AgGridColumn field="fieldingPoints"></AgGridColumn>
                        <AgGridColumn field="specialPoints"></AgGridColumn>
                        <AgGridColumn field="totalPoints"></AgGridColumn>
                    </AgGridReact>
                </div>
            </div>
        );
    }

    private processData() {
        this.getTeams();
    }

    private getTeams() {
        this.data = require("./../data/cricInfoData.json");
        Object.keys(this.playerMap).length === 0 && this.data["content"]["teams"].map(
            (team: Team) => {
                team.players.map(
                    (player: Player) => {
                        player.team = team.title;
                        player.fullName = player.name;
                        this.playerMap[player.fullName] = player;
                    }
                );
            }
        );

        this.data["content"]["innings"].map(
            (inn: any) => {
                inn["batsmen"].map(
                    (battingData: Batting) => {
                        this.playerMap[battingData.fullName].ballsFaced = battingData.ballsFaced;
                        this.playerMap[battingData.fullName].fours = battingData.fours;
                        this.playerMap[battingData.fullName].fullName = battingData.fullName;
                        this.playerMap[battingData.fullName].name = battingData.name;
                        this.playerMap[battingData.fullName].runs = battingData.runs;
                        this.playerMap[battingData.fullName].shortText = (battingData.shortText)
                            .replace(/&[^dagger;]*dagger;?/gm, '')
                            .replace(/&[^amp;]*amp;?/gm, '&');
                        this.playerMap[battingData.fullName].sixes = battingData.sixes;
                        this.playerMap[battingData.fullName].strikeRate = battingData.strikeRate;
                    }
                );
                inn["bowlers"].map(
                    (bowlData: Bowling) => {
                        this.playerMap[bowlData.fullName].dots = bowlData.dots;
                        this.playerMap[bowlData.fullName].economyRate = bowlData.economyRate;
                        this.playerMap[bowlData.fullName].fullName = bowlData.fullName;
                        this.playerMap[bowlData.fullName].maidens = bowlData.maidens;
                        this.playerMap[bowlData.fullName].name = bowlData.name;
                        this.playerMap[bowlData.fullName].overs = bowlData.overs;
                        this.playerMap[bowlData.fullName].wickets = bowlData.wickets;
                    }
                );
            }
        );


    }
}