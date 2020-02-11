import React, { Component } from 'react';
import {TestResult} from "../Types";
import {Internet} from "../util/Internet";
import {Button, Card, CardContent, IconButton, Typography} from "@material-ui/core";
import {ExpectationComponent} from "./ExpectationComponent";
import {ArrowDropDown, ArrowRight} from "@material-ui/icons";

export type TestProps = {
    endpoint: string,
    testResult: TestResult
};

const leftAlign: React.CSSProperties = { textAlign: 'left', float: 'left'};
const brStyle1: React.CSSProperties = { display: 'block', marginTop: '0.9em' };
const brStyle2: React.CSSProperties = { display: 'block', marginTop: '1.7em' };
const brStyle3: React.CSSProperties = { display: 'block', marginTop: '2.5em' };
const passStyling: React.CSSProperties = { fontWeight: 'bold' };
const testFuncStyling: React.CSSProperties = { fontWeight: 'bold' };

export class Test extends Component<TestProps> {

    public testsAreOpen : boolean = false;
    
    requestRerun(){
        return () => {
            this.props.testResult.hasRun = false;
            this.forceUpdate();
            Internet.requestRerun(this.props.endpoint, this.props.testResult.cInd, this.props.testResult.tInd);
        }
    }

    logTest(){
        return () => {
            console.log(this.props.testResult);
        }
    }

    toggleOpenTests(){
        return () => {
            this.testsAreOpen = !this.testsAreOpen;
            this.forceUpdate();
        };
    }

    render() {
        let expectationsHTML: JSX.Element[] = [];
        if(this.testsAreOpen){
            for(let i = 0; i < this.props.testResult.expectations.length; i++){
                let exp = this.props.testResult.expectations[i];
                expectationsHTML.push(<ExpectationComponent description={exp.description} expectVal={exp.expectVal} actualVal={exp.actualVal} operator={exp.operator} comparisonName={exp.comparisonName} passed={exp.passed}/>);
            }
        }
        let dropDownIcon = !this.testsAreOpen ? <ArrowRight/> : <ArrowDropDown />;
        let passColor = !this.props.testResult.hasRun ? 'orange' : (this.props.testResult.passed ? 'green' : 'red');
        return (<Card style={{ minWidth: '40vw', maxWidth: '40vw', margin: '1em', height: "fit-content" }}>
            <CardContent>
                <Typography style={{ ...leftAlign, ...testFuncStyling }} variant="h5" component="h2">
                    {this.props.testResult.testFuncName}
                </Typography>
                <div style={{ ...brStyle1 }}/>
                <Typography style={{ ...leftAlign }} color="textSecondary" gutterBottom>
                    {this.props.testResult.testClassName}
                </Typography>
                <div style={{ ...brStyle2 }}/>
                <Typography style={{ ...leftAlign, ...passStyling, color: passColor }} color="textSecondary">
                    {!this.props.testResult.hasRun ? "Running" : (this.props.testResult.passed ? "Passed" : "FAILED")}
                </Typography>
                <div style={{ ...brStyle3 }}/>
                <Button style={{ ...leftAlign, color: 'black', background: '#f7f7f7' }} size="large" onClick={this.requestRerun()}>Re-run</Button>
                <Button style={{ ...leftAlign, marginLeft: '1em', color: 'black', background: '#f7f7f7' }} size="large" onClick={this.logTest()}>Log Test</Button>
                <IconButton style={{ float: 'right', marginTop: '-0.15em', marginBottom: '0em' }} onClick={this.toggleOpenTests()}>
                    { dropDownIcon }
                </IconButton>
                <div style={{ maxHeight: '30vh', width: '100%', overflowY: 'scroll', marginLeft:'0em' }}>
                    { [expectationsHTML] }
                </div>
            </CardContent>
        </Card>)
    }
}