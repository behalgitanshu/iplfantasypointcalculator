import { CircularProgress } from "@material-ui/core";
import React from "react";

export class CommonComponents {
    public static getSpinner(): React.ReactNode {
        return <div style={{
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }}>
            <CircularProgress />
        </div>
    }

}