import React, { Component } from 'react';
import {TestClass} from "./TestClass";
import {TestResult} from "../Types";
import {Internet} from "../util/Internet";
import {Button} from "@material-ui/core";

type TestGroupState = {
    testResults: TestResult[][];
}

type TestGroupProps = {
    endpoint: string;
}


const expand: React.CSSProperties = { width: '100%', height: '100%' };
const leftAlign: React.CSSProperties = { textAlign: 'left', float: 'left'};

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
            testsClassesHTML.push(<div style={{ display: "block", height: '5em' }}></div>);
            for(let i = 0; i < (this.state as TestGroupState).testResults.length; i++){
                let testClassResults: TestResult[] = (this.state as TestGroupState).testResults[i];
                testsClassesHTML.push(<hr style={{ width: '95vw', borderColor: '#f7f7f7' }}/>);
                testsClassesHTML.push(<TestClass testResults={testClassResults} endpoint={this.props.endpoint}/>);
            }
            return <div style={{...expand, background: '#f7f7f7' }}>
                <Button style={{ ...leftAlign, fontWeight: 'bold', marginLeft: '2.5em', marginBottom: '-1em', marginTop: '1.5em', color: 'white', background: '#D3D3D3' }} size="large" onClick={this.doFullRerun()}>Re-run All Tests</Button>
                {testsClassesHTML}
            </div>;
        } else {
            return <div style={{...expand}}>
                <div style={{ fontWeight: 'bold', fontSize: '32pt', marginTop: '2em' }} onClick={() => {this.forceUpdate()}}>Refresh</div>
            </div>;
        }
    }
}