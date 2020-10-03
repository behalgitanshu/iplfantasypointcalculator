import { CSSProperties } from "react";

export class Styles {
    public static rowStyle: CSSProperties = {
        display: "flex",
        flexDirection: "row",
        marginTop: "8px",
        width: "100%"
    }

    public static buttonTheme: any = {
        marginBottom: "auto",
        marginTop: "auto",
        marginRight: "10px",
        fontWeight: 600,
        fontSize: "x-small",
        color: "white",
        width: "33%",
        flexGrow: 1,
    };

    public static rightButtonTheme: any = {
        marginBottom: "auto",
        marginTop: "auto",
        fontWeight: 600,
        fontSize: "x-small",
        color: "white",
        width: "33%",
        flexGrow: 1,
    };

    public static nextMatchButton: any = {
        fontWeight: 600,
        color: "white",
        flexGrow: 1
    };

    public static calculatorText: CSSProperties = {
        fontWeight: 600,
        color: "black",
        justifyContent: "left",
        backgroundColor: "cyan",
        flexGrow: 1,
        marginRight: "10px",
        height: "100%"
    }

    public static calculatorValue: CSSProperties = {
        fontWeight: 600,
        color: "black",
        backgroundColor: "lightskyblue",
        width: "20%",
    }
}