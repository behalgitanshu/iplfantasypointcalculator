import React from "react";
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import './ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { FantasyPlayer } from "../model/model";
import 'react-dropdown/style.css';

export class PlayerDB extends React.Component<{}, {}> {

    private playerDB: { [key: string]: any } = require("./../data/playersData.json");
    private playersList: FantasyPlayer[] = [];

    constructor(props: any) {
        super(props);
        this.playersList = this.playerDB["Data"]["Value"]["Players"];
    }

    render() {
        return <div className="ag-theme-alpine" style={{ height: '60vh', maxWidth: '1000px', width: "100%" }}>
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