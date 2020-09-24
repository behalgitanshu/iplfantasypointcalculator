import React from "react";
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import './ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { Team, Bowling, Batting, Player } from "../model/model";
import { GridApi } from "ag-grid-community";
import ReactDropdown from "react-dropdown";
import 'react-dropdown/style.css';
import { ClipLoader } from "react-spinners";
import { Button, Icon } from "@material-ui/core";
import { PlayerDB } from "./PlayerDB";

export class Scoreboard extends React.Component<{}, {
    showGrid: boolean,
    title: string,
    errorMessage: string,
    showPlayerDB: boolean
}> {

    private buttonTheme: any = {
        marginBottom: "auto",
        marginTop: "auto",
        marginRight: "10px",
        fontWeight: "600",
        fontSize: "x-small"
    };
    private fixtures: { [key: string]: any } = require("./../data/fixtures.json");
    private fixtureList: { title: string, id: string, startTime: string }[] = [];
    private data: { [key: string]: any } = {}; // require("./../data/cricInfoData.json");
    private playerMap: { [key: string]: Player } = {};
    private gridApi: GridApi = {} as GridApi;
    private placeholder: string = "Select a team";
    private HidePlaceholderPrefix: boolean = false;

    constructor(props: any) {
        super(props);
        this.state = {
            showGrid: false,
            title: "",
            errorMessage: "",
            showPlayerDB: false,
        }
        this.getFixtureList();
    }

    render() {
        if (!this.data["meta"]) {
            return this.getSpinner();
        }
        if (this.state.errorMessage) {
            return <h3 style={{ color: "white" }}>{this.state.errorMessage}</h3>;
        }
        return (
            <div>
                <h2 style={{ margin: "auto", color: "white" }}>IPL Fantasy League Points Table - F.R.I.E.N.D.S</h2>
                {this.state.showPlayerDB && <PlayerDB />}
                {!this.state.showPlayerDB && this.getDashboard()}
                {this.getButttons()}
            </div>
        );
    }

    getDashboard(): React.ReactNode {
        return <div>
            {this.getFixtureDropdown()}
            {
                this.data["header"]["matchEvent"]["statusLabel"] === "Scheduled"
                && <label style={{ color: "white" }}> Match hone me time hai abhi!! </label>
            }
            {
                !this.state.showGrid &&
                this.data["header"]["matchEvent"]["statusLabel"] !== "Scheduled" &&
                this.getSpinner()
            }
            {
                this.state.showGrid
                && this.getAGGridPointTable()
            }
        </div>
    }

    private fetchData(url: string) {
        const proxyurl = "https://cors-anywhere.herokuapp.com/"
        fetch(proxyurl + url, { method: "get" })
            .then(response => response.json()
                .then(x => {
                    this.data = x;
                    this.processData();
                })
            ).catch(
                (error) => {
                    this.setState(
                        {
                            errorMessage: "kuchh to gadbad hai - Technical message: " + error
                        }
                    );
                }
            )
    }

    private getFixtureList() {
        this.fixtureList = this.fixtures["content"]["matchEvents"].map(
            (match: any) => {
                return {
                    title: match.shortName + " " + match.description,
                    id: match.id,
                    startTime: match.startDate,
                }
            }
        );
        const id: string = this.getCurrentMatch();
        this.fetchData(this.getJSONUrl(id));
    }

    private getCurrentMatch(): any {
        let currentMatch: any;
        const now: Date = new Date();
        this.fixtureList.map((match: any) => {
            if (new Date(match.startTime) < now) {
                currentMatch = match;
            }
        });
        if (currentMatch) {
            this.placeholder = currentMatch.title;
            return currentMatch.id;
        } else {
            this.setState({
                errorMessage: "Tournament Chalu hone ke baad ana :P"
            });
        }
    }

    private getButttons(): React.ReactNode {
        return <div style={{ display: "flex", flexDirection: "row", marginBottom: "10px", marginTop: "10px" }}>
            <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                    this.HidePlaceholderPrefix = true;
                    this.setState({
                        showPlayerDB: !this.state.showPlayerDB,
                    });
                }}
                style={this.buttonTheme}
            >
                {this.state.showPlayerDB ? "Back" : "Players Database"}
            </Button>
            <Button
                variant="contained"
                color="primary"
                onClick={() => {
                    window.open("https://docs.google.com/spreadsheets/d/1dDUpBAGOzmJBF7O0U60Yc005QTA01BFpSym9VywaquY/edit#gid=304738466", "_self");
                }}
                style={this.buttonTheme}
            >
                Fantasy League Points Table
            </Button>
            {
                this.state.showGrid &&
                this.data["header"]["bestPlayer"] &&
                <Button
                    variant="contained"
                    color="default"
                    onClick={() => {
                        this.gridApi.exportDataAsCsv();
                    }}
                    style={this.buttonTheme}
                >
                    Export Points Table to Excel
            </Button>
            }
        </div>
    }

    private getFixtureDropdown(): React.ReactNode {
        return <div style={{ marginBottom: "5px", marginTop: "10px" }}>
            <ReactDropdown
                options={this.fixtureList.map((match: any) => { return { label: match.title, value: match.id } })}
                onChange={(option: any) => {
                    this.playerMap = {};
                    this.fetchData(this.getJSONUrl(option.value));
                    this.setState(
                        {
                            title: option.label,
                            showGrid: false,
                        }
                    );
                }}
                placeholder={
                    (this.HidePlaceholderPrefix
                        ? ""
                        : (this.data["header"]["bestPlayer"]
                            ?
                            "Recent Result: "
                            : "Live Match: "))
                    + this.placeholder}
            />
        </div>;
    }

    private getSpinner(): React.ReactNode {
        return <ClipLoader
            size={50}
            color={"#123abc"}
            loading={true}
        />;
    }

    private getAGGridPointTable(): React.ReactNode {
        return <div className="ag-theme-alpine" style={{ height: '60vh', width: '100%' }}>
            <AgGridReact
                rowData={Object.values(this.playerMap).sort(
                    (a: Player, b: Player) => {
                        return b.totalPoints - a.totalPoints;
                    }
                )}
                onGridReady={(params) => {
                    this.gridApi = params.api;
                }}
                defaultColDef={{
                    sortable: true,
                }}>
                <AgGridColumn field="fullName"></AgGridColumn>
                <AgGridColumn field="totalPoints"></AgGridColumn>
                <AgGridColumn field="battingPoints"></AgGridColumn>
                <AgGridColumn field="bowlingPoints"></AgGridColumn>
                <AgGridColumn field="fieldingPoints"></AgGridColumn>
                <AgGridColumn field="specialPoints"></AgGridColumn>
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

    private getJSONUrl(eventId: string): string {
        return "https://hsapi.espncricinfo.com/v1/pages/match/scoreboard?lang=en&leagueId=8048&eventId=" + eventId + "&liveTest=false&qaTest=false";
    }

    private processData() {
        if (this.data["header"]["matchEvent"]["statusLabel"] !== "Scheduled") {
            Object.keys(this.playerMap).length === 0 && this.data["content"]["teams"].map(
                (team: Team) => {
                    team.players.map(
                        (player: Player) => {
                            player.fullName = player.name;
                            player.battingPoints = 0;
                            player.bowlingPoints = 0;
                            player.fieldingPoints = 0;
                            player.specialPoints = 0;
                            player.totalPoints = 0;
                            player.team = team.title;
                            player.runs = 0;
                            player.ballsFaced = 0;
                            player.fours = 0;
                            player.sixes = 0;
                            player.strikeRate = 0;
                            player.ballsBowled = 0;
                            player.maidens = 0;
                            player.wickets = 0;
                            player.dots = 0;
                            player.economyRate = 0;
                            player.fieldingActions = 0;
                            player.conceded = 0;
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
        } else {
            // refresh page
            this.setState({
                title: this.state.title
            });
        }
    }

    private getNumberOfBallsBowled(overs: string): number {
        let balls = 0;
        const str: string[] = overs.split('.');
        balls += 6 * (parseInt(str[0]));
        if (str.length == 2) {
            balls += parseInt(str[1]);
        }
        return balls;
    }

    private calculatePoints() {
        this.calculateBattingPoints();
        this.calculateBowlingPoints();
        this.calculateFieldingPoints();
        this.calculateSpecialPoints()
        this.calculateTotalPoints();
    }

    private calculateSpecialPoints() {
        // MOM
        const playerName: string = this.data["header"]["bestPlayer"] ? this.data["header"]["bestPlayer"]["name"] : "";
        if (playerName) {
            this.playerMap[playerName].specialPoints += 25;
        }
        const winner: string = this.getNameOfWinningTeam();
        if (winner) {
            this.allocateWinningBonus(winner);
        }
    }

    private allocateWinningBonus(winner: string) {
        Object.values(this.playerMap).map(
            (player: Player) => {
                if (player.team === winner) {
                    player.specialPoints += 5;
                }
            }
        );
    }

    private getNameOfWinningTeam(): string {
        let winnerTeam: string = "";
        this.data["header"]["matchEvent"]["competitors"].map(
            (team: any) => {
                if (team.isWinner) {
                    winnerTeam = team.name;
                }
            }
        );
        return winnerTeam;
    }

    private calculateFieldingPoints() {
        Object.values(this.playerMap).map(
            (player: Player) => {
                let text: string = player.shortText;
                // Caught and bowled
                if (text && text.indexOf("c & b ") > -1) {
                    const playerName = text.substring(6);
                    this.allocateFieldingPointToPlayer(playerName, player.team);
                }
                // caught
                if (text && text.indexOf("c ") > -1) {
                    text = text.substring(2);
                    const playerName = text.split(" b")[0];
                    this.allocateFieldingPointToPlayer(playerName, player.team);
                }
                // run out
                if (text && text.indexOf("run out (") > -1) {
                    text = text.substring(9);
                    text = text.substring(0, text.length - 1);
                    text.split("/").map(
                        (playerName: string) => {
                            this.allocateFieldingPointToPlayer(playerName, player.team);
                        }
                    );
                }
                // stumping
                if (text && text.indexOf("st ") > -1) {
                    text = text.substring(3);
                    const playerName = text.split(" b")[0];
                    this.allocateFieldingPointToPlayer(playerName, player.team);
                }
            }
        );
    }

    private allocateFieldingPointToPlayer(playerName: string, oppnentTeam: string) {
        Object.values(this.playerMap).map(
            (player: Player) => {
                if (player.name.indexOf(playerName) > -1 && player.team != oppnentTeam) {
                    player.fieldingActions++;
                    player.fieldingPoints += 10;
                }
            }
        );
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
                if (player.runs === 0 && player.roleId !== "BL" && player.shortText && player.shortText !== "not out") {
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
