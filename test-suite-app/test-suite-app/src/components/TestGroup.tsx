import React, { Component } from 'react';
import {TestClass} from "./TestClass";
import {TestResult} from "../Types";
import {Internet} from "../util/Internet";
import {SoftDiv} from "./SoftDiv";
import {ThemeManager} from "../util/ThemeManager";
import {ArrowRight} from "@material-ui/icons";
import {Icons} from "../util/Icons";
import {Preferences} from "../util/Preferences";
import {Colors} from "../util/Colors";

type TestGroupState = {
    testResults: TestResult[][];
}

type TestGroupProps = {
    endpoint: string;
}


const expand: React.CSSProperties = { width: '100%', height: '100%', minHeight: '100vh' };
const leftAlign: React.CSSProperties = { textAlign: 'left', float: 'left'};
const brStyle1: React.CSSProperties = { display: 'block', marginTop: '0.7em' };

export class TestGroup extends Component<TestGroupProps, TestGroupState> {

    componentDidMount() {
        const { endpoint } = this.props;
        const socket = Internet.initSocket(endpoint);
        socket.emit('initConnect');
        socket.on('currentTests', (testsUpToNow: TestResult[][]) => {
            this.setState({ testResults: testsUpToNow });
        });
        socket.on('singleTestFinish', (testResult: TestResult) => {
            let x = this.state.testResults;
            x[testResult.cInd][testResult.tInd] = testResult;
            this.setState({ testResults: x });
        });
        socket.on('rerunResult', (testResult: TestResult) => {
            let x = this.state.testResults;
            x[testResult.cInd][testResult.tInd] = testResult;
            this.setState({ testResults: x });
        });
    }

    doFullRerun(){
        return () => {
            let setStateRunning = this.state.testResults.map(
                (value:TestResult[], index:number, array:any) => {
                    return value.map(value1 => {
                        let x = value1;
                        x.hasRun = false;
                        return x;
                    });
                }
            );
            this.setState({ testResults: setStateRunning} as TestGroupState);
            Internet.requestFullRerun(this.props.endpoint);
        };
    }

    render() {
        if(this.state !== null && (this.state as TestGroupState).testResults){
            let testsClassesHTML = [];
            for(let i = 0; i < (this.state as TestGroupState).testResults.length; i++){
                let testClassResults: TestResult[] = (this.state as TestGroupState).testResults[i];
                testsClassesHTML.push(
                        <SoftDiv impressedByDefault={true} colorHex={Colors.background} style={{ marginLeft: '2.5vw', marginRight: '2.5vw' }} width={"95vw"} height={"2em"} text={" "}/>
                    );
                testsClassesHTML.push(<TestClass testResults={testClassResults} endpoint={this.props.endpoint}/>);
                if(i == this.state.testResults.length - 1){
                    testsClassesHTML.push(
                        <SoftDiv impressedByDefault={true} colorHex={Colors.background} style={{ marginLeft: '2.5vw', marginRight: '2.5vw' }} width={"95vw"} height={"2em"} text={" "}/>
                    );
                }
            }
            return <div style={{...expand, background: Colors.background }}>
                <br/>
                <div style={{ ...brStyle1 }}/>
                {/*<Button style={{ ...leftAlign, fontWeight: 'bold', marginLeft: '2.5em', marginBottom: '-1em', marginTop: '1.5em', color: 'white', background: '#D3D3D3' }} size="large" onClick={this.doFullRerun()}>Re-run All Tests</Button>*/}
                <div style={{ display: 'flex', flexDirection: "row" }}>
                    <SoftDiv borderRadius={"10em"} style={{ marginLeft: '2em', marginBottom: '2em' }} colorHex={Colors.background} onClick={this.doFullRerun()} height="5em" width="5em">
                        { Icons.getPlayIcon('3em', '3em') }
                    </SoftDiv>
                    <SoftDiv borderRadius={"10em"} style={{ marginLeft: '2em', marginBottom: '2em' }} colorHex={Colors.background} onClick={()=>{ThemeManager.cycleColorTheme(); this.forceUpdate();}} changesTheme={true} height="5em" width="5em">
                        { Icons.getRerunAllIcon('3em', '3em') }
                    </SoftDiv>
                    <SoftDiv borderRadius={"10em"} style={{ marginLeft: '2em', marginBottom: '2em' }} colorHex={Colors.background} onClick={() => {if(Preferences.cardStyle == "soft"){Preferences.cardStyle = "material"}else{Preferences.cardStyle = "soft"} this.forceUpdate()}} height="5em" width="5em">
                        { Icons.getChangeCardStyleIcon('3em', '3em') }
                    </SoftDiv>
                </div>
                {[testsClassesHTML]}
            </div>;
        } else {
            return <div style={{...expand}}>
                <div style={{ fontWeight: 'bold', fontSize: '32pt', marginTop: '2em' }} onClick={() => {this.forceUpdate()}}>Refresh</div>
            </div>;
        }
    }
}