import React, { Component } from 'react';
import {Test} from "./Test";
import {TestResult} from "../Types";

export type TestClassProps = {
    endpoint: string,
    testResults: TestResult[]
};

const boldName: React.CSSProperties = { fontWeight: 'bolder', fontFamily: 'Arial', fontSize: '30pt' };
const expand: React.CSSProperties = { width: '100%', height: '100%' };

export class TestClass extends Component<TestClassProps> {

    static defaultProps = {
        testResults: []
    };

    render() {
        let testsHTML = [];
        for(let i = 0; i < this.props.testResults.length; i++){
            let testProps: TestResult = this.props.testResults[i];
            if(i === this.props.testResults.length - 1){
                testsHTML.push(<div style={{ marginRight: '1em' }}><Test testResult={testProps} endpoint={this.props.endpoint}/></div>);
            } else {
                testsHTML.push(<Test testResult={testProps} endpoint={this.props.endpoint}/>);
            }
        }
        return (<div style={{ ...expand, ...boldName, display: 'flex', justifyContent: 'flex-start', overflowX: "scroll", maxWidth: '100%' }}>
            {testsHTML}
        </div>)
    }
}