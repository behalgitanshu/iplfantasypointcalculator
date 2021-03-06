import React from "react";
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import './ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { FantasyPlayer } from "../model/model";
import 'react-dropdown/style.css';
import { ClipLoader } from "react-spinners";
import { Chip } from "@material-ui/core";
import { CommonComponents } from "./Common";
import { URL } from "../constants/URLs";

export class PlayerDB extends React.Component<{}, {
    showGrid: boolean;
    errorMessage: string;
}> {

    private playerDB: { [key: string]: any } = {}; //require("./../data/playersData.json");
    private playersList: FantasyPlayer[] = [];

    constructor(props: any) {
        super(props);
        this.state = {
            showGrid: false,
            errorMessage: ""
        }
        this.fetchData("https://fantasy.iplt20.com/season/services/feed/players?lang=en&tourgamedayId=6&teamgamedayId=6&announcedVersion=09232020184336");
    }

    render() {
        if (this.state.errorMessage) {
            return <h3 style={{ color: "white" }}>{this.state.errorMessage}</h3>;
        }
        if (this.state.showGrid) {
            this.playersList = this.playerDB["Data"]["Value"]["Players"];
            return <div style={{
                display: "-webkit-flex",
                flexDirection: "column",
                height: "100%"
            }}>
                <Chip
                    label={"Sorted as per base value from official FL site!!"}
                    color="default"
                    style={{
                        marginBottom: "5px",
                        marginTop: "5px",
                        marginRight: "10px",
                        fontWeight: 600,
                        color: "black",
                        cursor: "default"
                    }}
                />
                <div className="ag-theme-alpine" style={{ flex: 1, maxWidth: '770px', width: "100%", height: "50vh", alignSelf: "center" }}>
                    <AgGridReact
                        rowData={Object.values(this.playersList).sort(
                            (a: FantasyPlayer, b: FantasyPlayer) => {
                                return b.Value - a.Value;
                            }
                        )}
                        defaultColDef={{
                            sortable: true,
                            filter: true,
                            floatingFilter: true,
                            width: 100
                        }}>
                        <AgGridColumn field="TeamShortName" headerName={"Team"}></AgGridColumn>
                        <AgGridColumn field="Name" width={200}></AgGridColumn>
                        <AgGridColumn field="Value" headerName={"Price"}></AgGridColumn>
                        <AgGridColumn field="SkillName" width={150} headerName="Skill"></AgGridColumn>
                        <AgGridColumn field="OverallPoints" headerName={"Points"}></AgGridColumn>
                        <AgGridColumn field="IS_FP" headerName={"IsForeigner"}></AgGridColumn>
                    </AgGridReact>
                </div>
            </div>
        } else {
            return CommonComponents.getSpinner();
        }
    }

    private fetchData(url: string) {
        const proxyurl = URL.proxyURL;
        fetch(proxyurl + url, { method: "get" })
            .then(response => response.json()
                .then(x => {
                    this.playerDB = x;
                    this.setState(
                        {
                            showGrid: true,
                        }
                    );
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
}
