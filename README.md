# EventsBackend



## How to install

First, clone the repository.

Create a folder in the root of the project called <code>secrets</code>

Get the private key credential json file from a TPM or PM, and place that file in the <code>secrets</code> directory.

Then, get the .env file for Eve from a TPM or PM, and place that on the same level as <code>.gitignore</code>.

Run <code>npm run installAll</code>

## How to run

Run <code>npm start</code>


## How to test

This project uses a custom test suite. In order to add a test, simply add a .ts file to the <code>app/test/tests/</code> folder.

Any functions exported from this .ts file that include the substring "test" (case-insensitive) in the function name will be registered as a test by the testing suite.

The tests are run using expectation statements, which can be performed by including <code>import { describe } from "../testExtensions";</code> in your test file and then writing expect functions in the form:

<code>descibe("name of test").expect(val1).verb.comparison(?val2)</code>

where val2 is optional depending on the comparison made. Some examples are included below:

<code>describe("1 equals 1").expect(1).toBe.equalTo(1)</code>
would evaulate to **true**

<code>describe("1 equals 2").expect(1).toBe.equalTo(2)</code>
would evaulate to **false**

<code>describe("1 is defined").expect(1).is.defined()</code>
would evaulate to **true**

<code>describe("1 is undefined").expect(1).is.undefined()</code>
would evaulate to **false**

These expectation statements will automatically be registered and run by the testing file and will appear in the testing output. The descriptions will be printed along with the tests to identify them should one fail. There is no need to return anything or register anything, so long as all the expect statements pass, the test will be considered to have passed!

Then in order to run the testing script in the command line, simply call:

<code>npm run terminalTest</code>

Or, use the _**custom test suite**_ which allows you to edit the source files of the endpoint handlers and tests in real time, then re-run them with the new code (without restarting the server or testing script). It also lets you run individual tests, so you can change the console output in the test and endpoint handler and re-run that test over and over while developing.

To do this, simply run:

<code>npm test</code>

#### Contributors
2019, 2020 - Jagger Brulato (architecture, test suite, Logger, DevOps)
2020 - Enoch Chen
