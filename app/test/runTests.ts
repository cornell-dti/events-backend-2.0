import * as testExtensions from './testExtensions';
import { isUndefined } from 'util';
const chalk = require('chalk');
var fs = require('fs');

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

let testClasses: any[] = [];
let testClassTests: Function[][] = [];
let testClassNames: string[] = [];
let classIndex = 0;
let testIndex = 0;

let passedTests = [];
let failedTests = [];

let testsOver = false;

let currentlyRunningTest: Function;

// Constants -------------------------------------------------------------------
let pageWidth = 100;
let firstLine = true;
let lastLine = false;
let doTestLog = false;


let getMethods = (obj: any) => Object.getOwnPropertyNames(obj).filter(item => typeof obj[item] === 'function' && obj[item].name.toString().toLowerCase().includes("test")).map(item => obj[item] as Function);

async function start(doTerminalLogging: boolean) {
  doTestLog = doTerminalLogging;
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
  await runTest();
}

const varToString = (varObj: any) => Object.keys(varObj)[0];

async function runTest() {
  printLine();
  currentlyRunningTest = testClassTests[classIndex][testIndex];
  restrainedLog("│");
  restrainedLog("│");
  restrainedLog("│ " + chalk.cyan("Module") + ": " + chalk.yellow(testClassNames[classIndex]));
  restrainedLog("│ " + chalk.cyan("Running test") + ": " + chalk.magenta(currentlyRunningTest.name));
  restrainedLog("│");
  let promise = currentlyRunningTest.apply(null, [db]);
  promise.then(async () => {
    nextTest();
    if (!testsOver) {
      await runTest();
    }
  });
}

function nextTest() {
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
  } else {
    passedTests.push(currentlyRunningTest);
  }
  restrainedLog("│");
}

if (typeof require !== 'undefined' && require.main === module) {
  start(true);
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