import React from "react";
import { ExpectationRep } from "../Types";
import {Typography} from "@material-ui/core";

const leftAlign: React.CSSProperties = { textAlign: 'left', float: 'left'};
const testDesc: React.CSSProperties = { fontWeight: "bold" };
const fillWidth: React.CSSProperties = { width: '100%' };
const blueText: React.CSSProperties = { textAlign: 'left', color: 'blue'};
const orangeText: React.CSSProperties = { textAlign: 'left', color: 'orange'};
const greenText: React.CSSProperties = { textAlign: 'left', color: 'green'};
const bold: React.CSSProperties = { fontWeight: 'bold' };
const brStyle1: React.CSSProperties = { display: 'block', marginTop: '0.7em' };

export const ExpectationComponent = (exp: ExpectationRep) => {
    let descColor = exp.passed ? 'black' : 'red';
    return (
        <div>
            <Typography style={{ ...leftAlign, ...fillWidth }} variant="body2" component="p">
                <span style={{ ...testDesc, color: descColor }}>{exp.description}</span>
                <span style={{ ...brStyle1 }}/>
                <span style={{ ...blueText }}>Expected </span>
                <span style={{ ...orangeText, ...bold }}>{exp.expectVal} </span>
                <span style={{ ...greenText }}>{exp.operator} {exp.comparisonName} </span>
                <span style={{ ...orangeText, ...bold }}>{(exp.actualVal !== 'undefined' || (exp.expectVal === 'undefined' && exp.comparisonName !== 'undefined')) ? exp.actualVal : ''}</span>
                <span style={{ ...brStyle1 }}/>
            </Typography>
            <span style={{ ...brStyle1 }}/>
        </div>
    );
}