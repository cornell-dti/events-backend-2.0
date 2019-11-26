import * as userHandlerTest from './tests/userHandlerTest';
import * as testExtensions from './testExtensions';
import { isUndefined } from 'util';
const chalk = require('chalk');

// Firebase --------------------------------------------------------------------
let admin = require('firebase-admin');
let serviceAccount = require('../../secrets/eventsbackenddatabase-firebase-adminsdk-ukak2-d1b3a5ef55.json');

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

let testClasses = [userHandlerTest];
let classIndex = 0;
let testIndex = 0;

let passedTests = [];
let failedTests = [];

let testsOver = false;

let currentlyRunningTest: Function;

async function start() {
  await runTest();
}

function printLine() {
  console.log("-----------------------------------------------------------------------------------------------------");
}

const varToString = (varObj: any) => Object.keys(varObj)[0];

async function runTest() {
  printLine();
  currentlyRunningTest = testClasses[classIndex].tests[testIndex];
  restrainedLog("|");
  restrainedLog("| " + chalk.cyan("Module") + ": " + chalk.yellow(testClasses[classIndex].getScriptName()));
  restrainedLog("| " + chalk.cyan("Running test") + ": " + chalk.magenta(currentlyRunningTest.name));
  restrainedLog("| ");
  await currentlyRunningTest.apply(null, [db]);
  nextTest();
  if (!testsOver) {
    await runTest();
  }
}

function nextTest() {
  let testClass = testClasses[classIndex];
  if (testIndex == testClass.tests.length - 1) {
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
  printLine();
  console.log("\n\nALL TESTS COMPLETED");
  console.log("\n -- Tests " + FgGreen + "passed" + FgWhite + ": " + passedTests.length);
  console.log("\n -- Tests " + FgRed + "failed" + FgWhite + ": " + failedTests.length);
  console.log("\n\n");
}

export function triggerReturn(exp: testExtensions.Expectation) {
  restrainedLog("| -- Expect " + exp.expectVal + " " + exp.operator.constructor.name + " " + exp.functionName + (!isUndefined(exp.actualVal) ? " " + exp.actualVal : "") + chalk.magenta(" passed!"));
  restrainedLog("| ---- " + chalk.yellow("Status") + ": " + (exp.passed ? FgGreen + "PASSED" + FgWhite : FgRed + "FAILED" + FgWhite));
  if (!exp.passed) {
    restrainedLog("| -------- FAILED: Expected " + exp.expectVal + " " + exp.operator.constructor.name + " " + exp.functionName + " " + exp.actualVal + "!");
    failedTests.push(currentlyRunningTest);
  } else {
    passedTests.push(currentlyRunningTest);
  }
  restrainedLog("| ");
}

if (typeof require !== 'undefined' && require.main === module) {
  start();
}

function restrainedLog(s: string, args?: string[]) {
  let totalColRef = (s.length - s.replace(new RegExp('[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]', 'g'), "").length) / 10;
  if (s.length > 100 + totalColRef) {
    let cut = s.slice(0, 100 + totalColRef);
    if (isUndefined(args)) {
      console.log(cut + "|");
    } else {
      console.log(cut + "|", ...args);
    }
  }
  else {
    let padding = "";
    let padAmt = (100 - s.length) + (10 * totalColRef);
    for (let i = 0; i < padAmt; i++) {
      padding = padding + " ";
    }
    if (isUndefined(args)) {
      console.log(s + padding + "|");
    } else {
      console.log(s + padding + "|", ...args);
    }
  }
}