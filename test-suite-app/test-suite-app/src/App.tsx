import React, {Component} from 'react';
import socketIOClient from "socket.io-client";
import logo from './logo.svg';
import './App.css';
import {TestGroup} from "./components/TestGroup";
import {TestResult} from "./Types";

const windowStyle: React.CSSProperties = { width: '100%', height: '100%' };
const boldName: React.CSSProperties = { fontWeight: 'bolder', fontFamily: 'Arial', fontSize: '30pt' };


export class App extends Component<any> {

    public testResults: TestResult[][] = [];

    constructor(props: Readonly<any>) {
        super(props);
    }

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
