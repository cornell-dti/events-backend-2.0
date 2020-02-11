import React, {Component} from 'react';
import './App.css';
import {TestGroup} from "./components/TestGroup";
import {TestResult} from "./Types";

const windowStyle: React.CSSProperties = { width: '100%', height: '100%' };


export class App extends Component<any> {

    public testResults: TestResult[][] = [];

    render() {
        return (
            <div className="App">
                <div id="windowDiv" style={{...windowStyle}}>
                    <TestGroup endpoint={'http://127.0.0.1:9909'}/>
                </div>
            </div>
        );
    }
}

export default App;
