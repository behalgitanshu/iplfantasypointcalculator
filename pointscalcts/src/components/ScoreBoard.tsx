import React from "react";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import "./ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { Team, Bowling, Batting, Player } from "../model/model";
import { GridApi } from "ag-grid-community";
import ReactDropdown, { Group, Option } from "react-dropdown";
import "react-dropdown/style.css";
import { Button, Chip } from "@material-ui/core";
import { PlayerDB } from "./PlayerDB";
import { CommonComponents } from "./Common";
import { Styles } from "../constants/Styles";
import { Style } from "@material-ui/icons";
import { URL } from "../constants/URLs";

export class Scoreboard extends React.Component<
  {},
  {
    title: string;
    errorMessage: string;
    showPlayerDB: boolean;
    data: { [key: string]: any };
    fetchInProgress: boolean;
    nextMatchClicked: boolean;
  }
> {
  private year: string = "2023";
  private fixtureList: { title: string; id: string; startTime: string }[] = [];
  // private data: { [key: string]: any } = {}; // require("./../data/cricInfoData.json");
  private playerMap: { [key: string]: Player } = {};
  private gridApi: GridApi = {} as GridApi;
  private placeholder: string = "Select a team";
  private upcomingMatch: { label: string; value: string } = {
    label: "",
    value: "",
  };
  private HidePlaceholderPrefix: boolean = false;
  private matchId: string = "";
  private selection: Player[] = [];

  constructor(props: any) {
    super(props);
    this.state = {
      title: "",
      errorMessage: "",
      showPlayerDB: false,
      data: {},
      fetchInProgress: false,
      nextMatchClicked: false,
    };
    this.getFixtureList();
  }

  render() {
    if (this.state.errorMessage) {
      return <h3 style={{ color: "white" }}>{this.state.errorMessage}</h3>;
    }
    if (!this.state.data["meta"]) {
      return CommonComponents.getSpinner();
    }
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <h3
            style={{
              color: "white",
              marginTop: "auto",
              marginBottom: "auto",
              flexGrow: 1,
            }}
          >
            IPL Fantasy League - F.R.I.E.N.D.S
          </h3>
          {this.getYearDropdown()}
        </div>
        <div style={{ flexGrow: 1 }}>
          {this.state.showPlayerDB && <PlayerDB />}
          {!this.state.showPlayerDB && this.getDashboard()}
        </div>
        {!this.state.showPlayerDB &&
          this.upcomingMatch.label &&
          this.getNextMatch()}
        {!this.state.showPlayerDB && this.getPointsCounter()}
        {this.getActionButttons()}
      </div>
    );
  }

  private getNextMatch(): React.ReactNode {
    return (
      <div style={Styles.rowStyle}>
        {this.state.nextMatchClicked && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              this.matchId = this.getCurrentMatch();
              this.HidePlaceholderPrefix = true;
              this.fetchData();
              this.setState({
                nextMatchClicked: false,
              });
            }}
            style={Styles.buttonTheme}
          >
            Back
          </Button>
        )}
        {!this.state.nextMatchClicked && (
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              this.matchId = this.upcomingMatch.value;
              this.placeholder = this.upcomingMatch.label;
              this.HidePlaceholderPrefix = true;
              this.fetchData();
              this.setState({
                nextMatchClicked: true,
                title: this.upcomingMatch.label,
              });
            }}
            style={Styles.nextMatchButton}
          >
            {"Scheduled: " + this.upcomingMatch.label}
          </Button>
        )}
      </div>
    );
  }

  private getPointsCounter(): React.ReactNode {
    return (
      <div style={Styles.rowStyle}>
        <Chip
          label={"Total points of Selected Players"}
          color="default"
          style={Styles.calculatorText}
        />
        <Button
          variant="contained"
          color="default"
          style={Styles.calculatorValue}
        >
          <span id="currentSelectionTotal">0</span>
        </Button>
      </div>
    );
  }

  private getActionButttons(): React.ReactNode {
    return (
      <div style={Styles.rowStyle}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            this.HidePlaceholderPrefix = true;
            this.setState({
              showPlayerDB: !this.state.showPlayerDB,
            });
          }}
          style={Styles.buttonTheme}
        >
          {this.state.showPlayerDB ? "Point Table" : "Players List"}
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            window.open(
              "https://docs.google.com/spreadsheets/d/1dDUpBAGOzmJBF7O0U60Yc005QTA01BFpSym9VywaquY/edit#gid=304738466",
              "_self"
            );
          }}
          style={Styles.buttonTheme}
        >
          Score Sheet
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            window.open(
              "https://docs.google.com/document/d/1lIOvXLeVBKRwQ8g4eo05eKStPUmJbl6Hhy2dsKYoDjY/edit",
              "_self"
            );
          }}
          style={Styles.rightButtonTheme}
        >
          {"Rule Book"}
        </Button>
      </div>
    );
  }

  private getScoreBoard(): React.ReactNode {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          paddingBottom: "10px",
        }}
      >
        <Button
          color="default"
          style={{
            marginBottom: "5px",
            marginTop: "5px",
            fontWeight: 600,
            color: "black",
            flexGrow: 1,
            backgroundColor: "#afdade",
          }}
        >
          {this.state.data["header"]["matchEvent"]["statusText"]}
        </Button>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Button
            color="primary"
            style={{
              marginBottom: "auto",
              marginTop: "auto",
              marginRight: "10px",
              fontWeight: 600,
              color: "white",
              flexGrow: 1,
              backgroundColor: "#735e56",
              cursor: "default",
            }}
          >
            {this.state.data["header"]["matchEvent"]["competitors"][0]["score"]
              ? this.state.data["header"]["matchEvent"]["competitors"][0][
                  "shortName"
                ] +
                " : " +
                this.state.data["header"]["matchEvent"]["competitors"][0][
                  "score"
                ]
              : "-"}
          </Button>
          <Button
            color="secondary"
            style={{
              marginBottom: "auto",
              marginTop: "auto",
              fontWeight: 600,
              color: "white",
              flexGrow: 1,
              backgroundColor: "#806070",
              cursor: "default",
            }}
          >
            {this.state.data["header"]["matchEvent"]["competitors"][1]["score"]
              ? this.state.data["header"]["matchEvent"]["competitors"][1][
                  "shortName"
                ] +
                " : " +
                this.state.data["header"]["matchEvent"]["competitors"][1][
                  "score"
                ]
              : "-"}
          </Button>
        </div>
        {this.state.data["header"]["matchEvent"]["statusLabel"] === "Live" && (
          <Button
            color="default"
            style={{
              marginBottom: "5px",
              marginTop: "5px",
              marginRight: "10px",
              fontWeight: 600,
              color: "black",
              flexGrow: 1,
              cursor: "default",
              backgroundColor: "#afdade",
            }}
          >
            {this.state.data["header"]["title"].replace(" - Live", "")}
          </Button>
        )}
      </div>
    );
  }

  private getDashboard(): React.ReactNode {
    return (
      <div
        style={{
          display: "-webkit-flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {this.getFixtureDropdown()}
        {this.getScoreBoard()}
        {this.getAGGridPointTable()}
      </div>
    );
  }

  private fetchData() {
    this.playerMap = {};
    if (document.querySelector("#currentSelectionTotal")) {
      (document.querySelector("#currentSelectionTotal") as any).innerHTML = "0";
    }
    if (!this.matchId) {
      return;
    }
    const url = this.getJSONUrl(this.matchId);
    const proxyurl = URL.proxyURL;
    fetch(proxyurl + url, { method: "get" })
      .then((response) =>
        response.json().then((x) => {
          x = JSON.parse(x["contents"]);
          this.setState({
            fetchInProgress: false,
            data: x,
          });
          this.processData();
        })
      )
      .catch((error) => {
        this.setState({
          errorMessage: "kuchh to gadbad hai - Technical message: " + error,
        });
      });
    this.setState({
      fetchInProgress: true,
    });
  }

  private getFixtureList() {
    const fixtureUrl =
      "https://hsapi.espncricinfo.com/v1/pages/series/schedule?lang=en%26leagueId=8048%26year=" +
      this.year;
    const proxyurl = URL.proxyURL;
    fetch(proxyurl + fixtureUrl, { method: "get" })
      .then((response) =>
        response.json().then((fixtures) => {
          fixtures = JSON.parse(fixtures["contents"]);
          this.fixtureList = fixtures["content"]["matchEvents"].map(
            (match: any) => {
              return {
                title:
                  match.shortName +
                  " - " +
                  (match.description as string)
                    .replace("Indian Premier League at ", "")
                    .replace(" 2023", ""),
                id: match.id,
                startTime: match.startDate,
              };
            }
          );
          const id: string = this.getCurrentMatch();
          this.matchId = id;
          this.fetchData();
          setInterval(this.fetchData.bind(this), 300000);
          this.setState({
            fetchInProgress: true,
          });
        })
      )
      .catch((error) => {
        this.setState({
          errorMessage: "kuchh to gadbad hai - Technical message: " + error,
        });
      });
    this.setState({
      fetchInProgress: true,
    });
  }

  private getCurrentMatch(): any {
    let currentMatch: any;
    let upcomingMatch: any;
    let captureUpcoming: boolean = true;
    const now: Date = new Date();
    now.setMinutes(now.getMinutes() + 29);
    this.fixtureList.map((match: any) => {
      if (captureUpcoming) {
        upcomingMatch = match;
        captureUpcoming = false;
      }
      if (new Date(match.startTime) < now) {
        currentMatch = match;
        captureUpcoming = true;
      }
    });
    if (currentMatch && currentMatch.id !== upcomingMatch.id) {
      this.upcomingMatch = {
        label: upcomingMatch.title,
        value: upcomingMatch.id,
      };
    }
    if (currentMatch) {
      this.placeholder = currentMatch.title;
      return currentMatch.id;
    } else {
      if (this.fixtureList.length > 0) {
        this.placeholder = this.fixtureList[0].title;
        return this.fixtureList[0].id;
      } else {
        this.setState({
          errorMessage: "Tournament Chalu hone ke baad ana :P",
        });
      }
    }
  }

  private getYearDropdown(): React.ReactNode {
    return (
      <div className="year">
        <ReactDropdown
          options={[
            "2023",
            "2022",
            "2021",
            "2020",
            "2019",
            "2018",
            "2017",
            "2016",
            "2015",
            "2014",
            "2013",
            "2012",
            "2011",
            "2010",
            "2009",
            "2008",
          ]}
          onChange={(option: any) => {
            this.year = option.value;
            this.getFixtureList();
          }}
          value={"2023"}
        />
      </div>
    );
  }

  private getFixtureDropdown(): React.ReactNode {
    return (
      <div style={Styles.rowStyle}>
        <div style={{ flexGrow: 1 }}>
          <ReactDropdown
            options={this.createWeeklyGroups()}
            disabled={this.state.fetchInProgress}
            onChange={(option: any) => {
              this.matchId = option.value;
              this.placeholder = option.label;
              this.HidePlaceholderPrefix = true;
              this.fetchData();
              this.setState({
                title: option.label,
              });
            }}
            value={{
              label:
                (this.HidePlaceholderPrefix
                  ? ""
                  : this.state.data["header"]["bestPlayer"]
                  ? "Recent Result: "
                  : "Live Match: ") + this.placeholder,
              value: this.matchId,
            }}
          />
        </div>
        <div style={{ marginLeft: "10px" }}>
          {this.state.fetchInProgress && CommonComponents.getSpinner()}
        </div>
      </div>
    );
  }

  private createWeeklyGroups(): Group[] {
    let groups: Group[] = [];
    let weekCnt: number = 1;
    for (let i: number = 0; i < this.fixtureList.length; ) {
      let options: Option[] = [];
      for (let j: number = 0; j < 9; j++) {
        if (i < this.fixtureList.length) {
          const match = this.fixtureList[i++];
          options.push({ label: match.title, value: match.id });
        }
      }
      groups.push({
        items: options,
        name: "Week: " + weekCnt,
        type: "group",
      });
      weekCnt++;
    }
    return groups;
    // return this.fixtureList.map((match: any) => { return { label: match.title, value: match.id } })
  }

  private getAGGridPointTable(): React.ReactNode {
    return (
      <div className="ag-theme-alpine" style={{ flex: 1, width: "100%" }}>
        <AgGridReact
          rowData={Object.values(this.playerMap).sort(
            (a: Player, b: Player) => {
              return b.totalPoints - a.totalPoints;
            }
          )}
          onGridReady={(params) => {
            this.gridApi = params.api;
          }}
          onSelectionChanged={() => {
            this.selection = this.gridApi.getSelectedRows();
            let points: number = 0;
            this.selection.map((player: Player) => {
              points += player.totalPoints;
            });
            (document.querySelector(
              "#currentSelectionTotal"
            ) as any).innerHTML = points;
          }}
          rowSelection="multiple"
          rowMultiSelectWithClick={true}
          defaultColDef={{
            sortable: true,
            width: 75,
          }}
        >
          <AgGridColumn
            field="name"
            headerName={"Nickname"}
            width={125}
            lockPinned={true}
            pinned={"left"}
          ></AgGridColumn>
          <AgGridColumn
            field="totalPoints"
            headerName={"Points"}
            width={75}
            lockPinned={true}
            pinned={"left"}
          ></AgGridColumn>
          <AgGridColumn field="battingPoints" headerName={"Bat"}></AgGridColumn>
          <AgGridColumn
            field="bowlingPoints"
            headerName={"Bowl"}
          ></AgGridColumn>
          <AgGridColumn
            field="fieldingPoints"
            headerName={"Field"}
          ></AgGridColumn>
          <AgGridColumn
            field="specialPoints"
            headerName={"Bonus"}
          ></AgGridColumn>
          <AgGridColumn field="roleId" headerName={"Role"}></AgGridColumn>
          <AgGridColumn field="runs"></AgGridColumn>
          <AgGridColumn field="ballsFaced" headerName={"Faced"}></AgGridColumn>
          <AgGridColumn field="fours"></AgGridColumn>
          <AgGridColumn field="sixes"></AgGridColumn>
          <AgGridColumn field="strikeRate"></AgGridColumn>
          <AgGridColumn
            field="shortText"
            headerName={"Status"}
            width={200}
          ></AgGridColumn>
          <AgGridColumn
            field="ballsBowled"
            headerName={"Bowled"}
          ></AgGridColumn>
          <AgGridColumn field="conceded"></AgGridColumn>
          <AgGridColumn field="maidens"></AgGridColumn>
          <AgGridColumn field="wickets"></AgGridColumn>
          <AgGridColumn field="dots"></AgGridColumn>
          <AgGridColumn field="economyRate"></AgGridColumn>
          <AgGridColumn field="fieldingActions"></AgGridColumn>
          <AgGridColumn field="team" width={200}></AgGridColumn>
          <AgGridColumn field="fullName" width={200}></AgGridColumn>
        </AgGridReact>
      </div>
    );
  }

  private getJSONUrl(eventId: string): string {
    return (
      "https://hsapi.espncricinfo.com/v1/pages/match/scoreboard?lang=en%26leagueId=8048%26eventId=" +
      eventId +
      "%26liveTest=false%26qaTest=false"
    );
  }

  private processData() {
    if (
      this.state.data["header"]["matchEvent"]["statusLabel"] !== "Scheduled"
    ) {
      Object.keys(this.playerMap).length === 0 &&
        this.state.data["content"]["teams"].map((team: Team) => {
          team.players.map((player: Player) => {
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
          });
        });

      this.state.data["content"]["innings"].map((inn: any) => {
        inn["batsmen"].map((battingData: Batting) => {
          this.playerMap[battingData.fullName].ballsFaced = parseInt(
            battingData.ballsFaced
          );
          this.playerMap[battingData.fullName].fours = parseInt(
            battingData.fours
          );
          this.playerMap[battingData.fullName].fullName = battingData.fullName;
          this.playerMap[battingData.fullName].name = battingData.name;
          this.playerMap[battingData.fullName].runs = parseInt(
            battingData.runs
          );
          this.playerMap[
            battingData.fullName
          ].shortText = battingData.shortText
            .replace(/&[^dagger;]*dagger;?/gm, "")
            .replace(/&[^amp;]*amp;?/gm, "&");
          this.playerMap[battingData.fullName].sixes = parseInt(
            battingData.sixes
          );
          this.playerMap[battingData.fullName].strikeRate = parseFloat(
            battingData.strikeRate
          );
        });
        inn["bowlers"].map((bowlData: Bowling) => {
          this.playerMap[bowlData.fullName].dots = parseInt(bowlData.dots);
          this.playerMap[bowlData.fullName].economyRate = parseFloat(
            bowlData.economyRate
          );
          this.playerMap[bowlData.fullName].fullName = bowlData.fullName;
          this.playerMap[bowlData.fullName].maidens = parseInt(
            bowlData.maidens
          );
          this.playerMap[bowlData.fullName].name = bowlData.name;
          this.playerMap[
            bowlData.fullName
          ].ballsBowled = this.getNumberOfBallsBowled(bowlData.overs);
          this.playerMap[bowlData.fullName].wickets = parseInt(
            bowlData.wickets
          );
          this.playerMap[bowlData.fullName].conceded = parseInt(
            bowlData.conceded
          );
        });
      });
      this.calculatePoints();
      this.setState({
        title: this.state.title,
      });
    } else {
      // refresh page
      this.setState({
        title: this.state.title,
      });
    }
  }

  private getNumberOfBallsBowled(overs: string): number {
    let balls = 0;
    const str: string[] = overs.split(".");
    balls += 6 * parseInt(str[0]);
    if (str.length == 2) {
      balls += parseInt(str[1]);
    }
    return balls;
  }

  private calculatePoints() {
    this.calculateBattingPoints();
    this.calculateBowlingPoints();
    this.calculateFieldingPoints();
    this.calculateSpecialPoints();
    this.calculateTotalPoints();
  }

  private calculateSpecialPoints() {
    // MOM
    const playerName: string = this.state.data["header"]["bestPlayer"]
      ? this.state.data["header"]["bestPlayer"]["name"]
      : "";
    if (playerName) {
      this.playerMap[playerName].specialPoints += 25;
    }
    const winner: string = this.getNameOfWinningTeam();
    if (winner) {
      this.allocateWinningBonus(winner);
    }
  }

  private allocateWinningBonus(winner: string) {
    Object.values(this.playerMap).map((player: Player) => {
      if (player.team === winner) {
        player.specialPoints += 5;
      }
    });
  }

  private getNameOfWinningTeam(): string {
    let winnerTeam: string = "";
    this.state.data["header"]["matchEvent"]["competitors"].map((team: any) => {
      if (team.isWinner) {
        winnerTeam = team.name;
      }
    });
    const status = this.state.data["header"]["matchEvent"][
      "statusText"
    ] as string;
    if (status.indexOf("Match tied") > -1) {
      winnerTeam = status
        .split("(")[1]
        .replace(" won the one-over eliminator)", "");
    }
    return winnerTeam;
  }

  private calculateFieldingPoints() {
    Object.values(this.playerMap).map((player: Player) => {
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
        text.split("/").map((playerName: string) => {
          this.allocateFieldingPointToPlayer(playerName, player.team);
        });
      }
      // stumping
      if (text && text.indexOf("st ") > -1) {
        text = text.substring(3);
        const playerName = text.split(" b")[0];
        this.allocateFieldingPointToPlayer(playerName, player.team);
      }
    });
  }

  private allocateFieldingPointToPlayer(
    playerName: string,
    oppnentTeam: string
  ) {
    Object.values(this.playerMap).map((player: Player) => {
      if (player.name.indexOf(playerName) > -1 && player.team != oppnentTeam) {
        player.fieldingActions++;
        player.fieldingPoints += 10;
      }
    });
  }

  private calculateBattingPoints() {
    Object.values(this.playerMap).map((player: Player) => {
      let points: number = 0;
      // Base points
      points += player.runs;
      // Pace points
      points += player.runs - player.ballsFaced;
      // impact points
      points +=
        player.runs < 25
          ? 0
          : player.runs < 50
          ? 5
          : player.runs < 75
          ? 15
          : player.runs < 100
          ? 30
          : 50;
      // milestones points
      points += player.fours;
      points += 2 * player.sixes;
      if (
        player.runs === 0 &&
        player.roleId !== "BL" &&
        player.shortText &&
        player.shortText !== "not out"
      ) {
        points -= 5;
      }
      player.battingPoints = points;
    });
  }

  private calculateBowlingPoints() {
    Object.values(this.playerMap).map((player: Player) => {
      let points: number = 0;
      // Base points
      points += player.wickets * 20;
      // Pace points
      const pace: number = 1.5 * player.ballsBowled - player.conceded;
      points += pace > 0 ? pace * 2 : pace;
      // impact points
      points +=
        player.wickets < 2
          ? 0
          : player.wickets < 3
          ? 5
          : player.wickets < 4
          ? 15
          : player.wickets < 5
          ? 30
          : 50;
      // milestones points
      points += player.dots;
      points += 25 * player.maidens;
      player.bowlingPoints = points;
    });
  }

  private calculateTotalPoints() {
    Object.values(this.playerMap).map((player: Player) => {
      player.totalPoints =
        player.battingPoints +
        player.bowlingPoints +
        player.fieldingPoints +
        player.specialPoints;
    });
  }
}
