import * as testExtensions from './testExtensions';
import { isUndefined } from 'util';
const chalk = require('chalk');
var fs = require('fs');
import * as express from "express";
import * as socketio from "socket.io";
import {Express} from "express";
const eventBus = require('js-event-bus')();

// Read .env file --------------------------------------------------------------
const dotenv = require('dotenv').config();
// -----------------------------------------------------------------------------

// Firebase --------------------------------------------------------------------
let admin = require('firebase-admin');
let serviceAccount = require('../../secrets/eventsbackenddatabase-firebase-adminsdk-ukak2-d1b3a5ef55.json');
function updateServiceAccountWithSecrets() {
  serviceAccount["private_key_id"] = process.env.PK_ID ? process.env.PK_ID : "null";
  if (serviceAccount["private_key_id"] == "null" || !serviceAccount["private_key_id"]) {
    console.log("ERROR: No PK_ID in .env, pk val is: " + serviceAccount["private_key_id"]);
    throw new Error("No PK_ID in .env");
  }
  serviceAccount["private_key"] = process.env.PK_PWD ? process.env.PK_PWD : "null";
  if (serviceAccount["private_key"] == "null" || !serviceAccount["private_key"]) {
    console.log("ERROR: No PK_PWD in .env, pk_pwd val is: " + serviceAccount["private_key"]);
    throw new Error("No PK_PWD in .env");
  }
}
updateServiceAccountWithSecrets();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://eventsbackenddatabase.firebaseio.com"
});
let db = admin.firestore();
// -----------------------------------------------------------------------------

let FgRed = "\x1b[31m"
let FgGreen = "\x1b[32m"
let FgWhite = "\x1b[37m"
let FgYellow = "\x1b[33m"
let FgMagenta = "\x1b[35m"
let FgCyan = "\x1b[36m"

let colors = [FgRed, FgGreen, FgWhite, FgYellow, FgMagenta, FgCyan];

// -----------------------------------------------------------------------------

export type ExpectationRep = {
  description: string;
  expectVal: string;
  actualVal: string;
  operator: string;
  comparisonName: string;
  passed: boolean;
}

export type TestResult = {
  expectations: Array<ExpectationRep>,
  testClass: any,
  testFuncName: string,
  testClassName: string,
  passed: boolean,
  hasRun: boolean,
  cInd: number,
  tInd: number
}

let testClasses: any[] = [];
let testClassTests: Function[][] = [];
let testClassNames: string[] = [];
let classIndex = 0;
let testIndex = 0;
export let testResults: TestResult[][] = [];

let passedTests = [];
let failedTests = [];

let testsOver = false;

let currentlyRunningTest: Function;

// Constants -------------------------------------------------------------------
let pageWidth = 100;
let firstLine = true;
let lastLine = false;
let doTestLog = false;

let getExpRep = (exp: testExtensions.Expectation) => {
  return {
    description: exp.description,
    expectVal: exp.expectVal ? (exp.expectVal.toString().length <= 20 ? exp.expectVal.toString() : exp.expectVal.toString().substr(0, 17) + '...') : 'undefined',
    actualVal: exp.actualVal ? (exp.actualVal.toString().length <= 20 ? exp.actualVal.toString() : exp.actualVal.toString().substr(0, 17) + '...') : 'undefined',
    operator: exp.operator.name,
    comparisonName: exp.functionName,
    passed: exp.passed
  } as ExpectationRep;
};

let singleRunPromChain: Promise<any> | undefined = undefined;

let serverStarted = false;

function startServer(){
  const express = require('express');
  const app: Express = express();
  let http = require("http").Server(app);
// set up socket.io and bind it to our
// http server.
  let io = require("socket.io")(http);
  io.on('connection', function(socket: any){
    socket.on('requestFullRerun', function () {
      start(false).then(() => {
        socket.emit('currentTests', testResults);
      });
    });
    socket.on('requestRerun', function(request:string){
      let reqSplits = request.split(";;");
      let cInd = Number(reqSplits[0]);
      let tInd = Number(reqSplits[1]);
      if(singleRunPromChain === undefined){
        singleRunPromChain = runOneTest(cInd, tInd).then((val) => {
          socket.emit('rerunResult', testResults[cInd][tInd]);
        });
      } else {
        singleRunPromChain.then(() => {
          return runOneTest(cInd, tInd).then((val) => {
            socket.emit('rerunResult', testResults[cInd][tInd]);
          });
        })
      }
    });
    socket.on('initConnect', function(connection:any){
      socket.emit('currentTests', testResults);
      eventBus.on('singleTestFinish', function () {
        socket.emit('singleTestFinish', testResults[classIndex][testIndex]);
      })
    });
  });
  const server = http.listen(9909, function() {
    console.log("test-suite backend listening on *:9909");
  });
  serverStarted = true;
}


let getMethods = (obj: any) => Object.getOwnPropertyNames(obj).filter(item => typeof obj[item] === 'function' && obj[item].name.toString().toLowerCase().includes("test")).map(item => obj[item] as Function);

async function start(doTerminalLogging: boolean) {
  doTestLog = doTerminalLogging;
  doTestSetup();
  if(!doTerminalLogging){
    if(!serverStarted){
      startServer();
    }
  }
  await runTest();
}

export function doTestSetup(){
  testsOver = false;
  testClasses = [];
  testClassTests = [];
  testClassNames = [];
  classIndex = 0;
  testIndex = 0;
  testResults = [];
  passedTests = [];
  failedTests = [];

  let files = fs.readdirSync(__dirname + '/tests/');
  for (let i = 0; i < files.length; i++) {
    let imported = require('./tests/' + files[i].replace(".ts", ""));
    let methods = getMethods(imported);
    if (methods.length > 0) {
      testClasses.push(imported);
      testClassTests.push(methods);
      testClassNames.push(files[i]);
    }
  }
  for(let n = 0; n < testClasses.length; n++){
    testResults.push([]);
    for(let x = 0; x < testClassTests[n].length; x++){
      testResults[n].push({ hasRun: false, expectations: [], testClass: testClasses[n], testClassName: testClassNames[n], testFuncName: testClassTests[n][x].name, passed: true, cInd: n, tInd: x});
    }
  }
}

const varToString = (varObj: any) => Object.keys(varObj)[0];

async function runTest() {
  printLine();
  testResults[classIndex][testIndex].expectations = [];
  currentlyRunningTest = testClassTests[classIndex][testIndex];
  restrainedLog("│");
  restrainedLog("│");
  restrainedLog("│ " + chalk.cyan("Module") + ": " + chalk.yellow(testClassNames[classIndex]));
  restrainedLog("│ " + chalk.cyan("Running test") + ": " + chalk.magenta(currentlyRunningTest.name));
  restrainedLog("│");
  await currentlyRunningTest.apply(null, [db]);
  nextTest();
  if (!testsOver) {
    await runTest();
  }
}

async function runOneTest(cInd: number, tInd: number) {
  testResults[cInd][tInd].expectations = [];
  printLine();
  classIndex = cInd;
  testIndex = tInd;
  currentlyRunningTest = testClassTests[cInd][tInd];
  restrainedLog("│");
  restrainedLog("│");
  restrainedLog("│ " + chalk.cyan("Module") + ": " + chalk.yellow(testClassNames[classIndex]));
  restrainedLog("│ " + chalk.cyan("Running test") + ": " + chalk.magenta(currentlyRunningTest.name));
  restrainedLog("│");
  return currentlyRunningTest.apply(null, [db]);
}

function nextTest() {
  testResults[classIndex][testIndex].hasRun = true;
  eventBus.emit('singleTestFinish');
  let testClass = testClasses[classIndex];
  if (testIndex == testClassTests[classIndex].length - 1) {
    if (classIndex == testClasses.length - 1) {
      endTests();
      testsOver = true;
    }
    testIndex = 0;
    classIndex++;
  } else {
    testIndex++;
  }
}

function endTests() {
  lastLine = true;
  if (doTestLog) {
    printLine();
    console.log("\n\nALL TESTS COMPLETED");
    console.log("\n ── Tests " + FgGreen + "passed" + FgWhite + ": " + passedTests.length);
    console.log("\n ── Tests " + FgRed + "failed" + FgWhite + ": " + failedTests.length);
    console.log("\n\n");
  }
}

let maxValPrintLen = 25;

export function triggerReturn(exp: testExtensions.Expectation) {
  let expStr;
  if (exp.expectVal == undefined) {
    expStr = "undefined";
  } else {
    expStr = (exp.expectVal.toString().length > maxValPrintLen ? exp.expectVal.toString().slice(0, 15) + "..." : exp.expectVal.toString());
  }
  let actStr = (!isUndefined(exp.actualVal) ? " " + (exp.actualVal.toString().length > maxValPrintLen ? exp.actualVal.toString().slice(0, 15) + "..." : exp.actualVal.toString()) : "")
  restrainedLog("│ ┌─ " + chalk.blueBright(exp.description));
  restrainedLog("│ ├─ Expect " + expStr + " " + exp.operator.constructor.name + " " + exp.functionName + actStr + " " + (exp.passed ? chalk.magenta("passed!") : chalk.red("failed!")));
  restrainedLog("│ " + "└" + (exp.passed ? "─── " : "─┬─ ") + chalk.yellow("Status") + ": " + (exp.passed ? chalk.green("PASSED") : chalk.red("FAILED")));
  if (!exp.passed) {
    restrainedLog("│   └─── " + chalk.red("FAILED") + ": Expected " + expStr + " " + exp.operator.constructor.name + " " + exp.functionName + actStr + "!");
    failedTests.push(currentlyRunningTest);
    testResults[classIndex][testIndex].passed = false;
  } else {
    passedTests.push(currentlyRunningTest);
  }
  testResults[classIndex][testIndex].expectations.push(getExpRep(exp));
  restrainedLog("│");
}

if (typeof require !== 'undefined' && require.main === module) {
  let x = start(process.argv.slice(2)[0] === "log");
}

function printLine() {
  if (!doTestLog) return;
  let line = "";
  if (firstLine) {
    firstLine = false;
    line += "┌";
    for (let i = 0; i <= pageWidth - 2; i++) {
      line = line + "─";
    }
    line += "┐";
  } else if (lastLine) {
    restrainedLog("│");
    line += "└";
    for (let i = 0; i <= pageWidth - 2; i++) {
      line = line + "─";
    }
    line += "┘";
  } else {
    restrainedLog("│");
    line += "├";
    for (let i = 0; i <= pageWidth - 2; i++) {
      line = line + "─";
    }
    line += "┤";
  }
  console.log(line);
}

function restrainedLog(s: string, args?: string[]) {
  if (!doTestLog) return;
  let totalColRef = (s.length - s.replace(new RegExp('[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]', 'g'), "").length) / 10;
  if (s.length > pageWidth + (10 * totalColRef)) {
    let cut = s.slice(0, pageWidth + (10 * totalColRef));
    if (isUndefined(args)) {
      console.log(cut + "│");
    } else {
      console.log(cut + "│", ...args);
    }
  }
  else {
    let padding = "";
    let padAmt = (pageWidth - s.length) + (10 * totalColRef);
    for (let i = 0; i < padAmt; i++) {
      padding = padding + " ";
    }
    if (isUndefined(args)) {
      console.log(s + padding + "│");
    } else {
      console.log(s + padding + "│", ...args);
    }
  }
}