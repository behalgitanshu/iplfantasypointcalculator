import React from "react";
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import './ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { Team, Bowling, Batting, Player, FantasyPlayer } from "../model/model";
import { GridApi } from "ag-grid-community";
import ReactDropdown from "react-dropdown";
import 'react-dropdown/style.css';
import { ClipLoader } from "react-spinners";
import { Button, Icon } from "@material-ui/core";

export class PlayerDB extends React.Component<{}, {}> {

    private playerDB: { [key: string]: any } = require("./../data/playersData.json");
    private playersList: FantasyPlayer[] = [];

    constructor(props: any) {
        super(props);
        this.playersList = this.playerDB["Data"]["Value"]["Players"];
    }

    render() {
        return <div className="ag-theme-alpine" style={{ height: '600px', width: '1000px' }}>
            <AgGridReact
                rowData={Object.values(this.playersList).sort(
                    (a: FantasyPlayer, b: FantasyPlayer) => {
                        return b.TeamName.localeCompare(a.TeamName);
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
                <AgGridColumn field="IS_FP"></AgGridColumn>
            </AgGridReact>
        </div>;
    }
}