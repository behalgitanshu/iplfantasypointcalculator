import React from "react";
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import './ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { FantasyPlayer } from "../model/model";
import 'react-dropdown/style.css';
import { ClipLoader } from "react-spinners";

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
            return <div style={{marginBottom: "-20px"}}>
                <h3 style={{ color: "cyan", marginTop: "5px", marginBottom: "5px" }}>
                    Sorted as per points on fantasy league site!!
                </h3>
                <div className="ag-theme-alpine" style={{ height: '60vh', maxWidth: '1200px', width: "100%" }}>
                    <AgGridReact
                        rowData={Object.values(this.playersList).sort(
                            (a: FantasyPlayer, b: FantasyPlayer) => {
                                return b.OverallPoints - a.OverallPoints;
                            }
                        )}
                        defaultColDef={{
                            sortable: true,
                            filter: true,
                            floatingFilter: true,
                        }}>
                        <AgGridColumn field="TeamName"></AgGridColumn>
                        <AgGridColumn field="Name"></AgGridColumn>
                        <AgGridColumn field="Value"></AgGridColumn>
                        <AgGridColumn field="SkillName"></AgGridColumn>
                        <AgGridColumn field="OverallPoints"></AgGridColumn>
                        <AgGridColumn field="IS_FP"></AgGridColumn>
                    </AgGridReact>
                </div>;
            </div>
        } else {
            return this.getSpinner();
        }
    }

    private getSpinner(): React.ReactNode {
        return <ClipLoader
            size={50}
            color={"#123abc"}
            loading={true}
        />;
    }

    private fetchData(url: string) {
        const proxyurl = "https://cors-anywhere.herokuapp.com/"
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