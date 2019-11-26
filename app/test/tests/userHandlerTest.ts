import * as userHandler from '../../userHandler';
import { firestore } from 'firebase';
import { expect } from '../testExtensions';
var MockExpressRequest = require('mock-express-request');
var MockExpressResponse = require('mock-express-response');

// Required Test Values --------------------------------------------------------

export function getScriptName() {
  var path = require('path');
  var scriptName = path.basename(__filename);
  return scriptName;
};

// The tests to be run, in order.
export let tests: Function[] = [runDeleteTest, runCreateTest, runGetTest];


// Begin Tests -----------------------------------------------------------------

async function runCreateTest(db: firestore.Firestore) {
  let mockRequest = new MockExpressRequest(
    {
      method: 'POST',
      url: '/createUser/',
      cookies: { token: "MYTOKEN" },
      headers: {
        'Accept': 'text/plain'
      },
      body: {
        name: "Jagger",
        email: "jaggerbrulato@gmail.com",
        isOrgUser: true
      }
    }
  );
  let mockRespsonse = new MockExpressResponse();
  await userHandler.createUser(db, mockRequest, mockRespsonse);
  let orgUserResp: any;
  await db.collection('orgUsers').doc("jaggerbrulato@gmail.com").get()
    .then(doc => {
      orgUserResp = doc.data();
    });
  expect(orgUserResp.name).toBe.equalTo("Jagger");
  expect(orgUserResp.email).toBe.equalTo("jaggerbrulato@gmail.com");
}

async function runGetTest(db: firestore.Firestore) {
  let mockRequest = new MockExpressRequest(
    {
      method: 'GET',
      url: '/getUser/',
      cookies: { token: "MYTOKEN" },
      headers: {
        'Accept': 'text/plain'
      },
      body: {
        email: "jaggerbrulato@gmail.com",
        isOrgUser: true
      }
    }
  );
  let mockRespsonse = new MockExpressResponse();
  await userHandler.getUser(db, mockRequest, mockRespsonse);
  let orgUserResp: any;
  await db.collection('orgUsers').doc("jaggerbrulato@gmail.com").get()
    .then(doc => {
      orgUserResp = doc.data();
    });
  expect(orgUserResp.name).is.defined();
  expect(orgUserResp.email).toBe.equalTo("jaggerbrulato@gmail.com");
}

async function runDeleteTest(db: firestore.Firestore) {

  let mockRequest = new MockExpressRequest(
    {
      method: 'POST',
      url: '/deleteUser/',
      cookies: { token: "MYTOKEN" },
      headers: {
        'Accept': 'text/plain'
      },
      body: {
        email: "jaggerbrulato@gmail.com",
        isOrgUser: true
      }
    }
  );
  let mockRespsonse = new MockExpressResponse();
  await userHandler.deleteUser(db, mockRequest, mockRespsonse);
  let docExists;
  await db.collection('orgUsers').doc(mockRequest.body.email).get().then(doc => {
    docExists = doc.exists;
  });
  expect(mockRespsonse._getJSON().deleted).toBe.equalTo(true);
  expect(docExists).toBe.equalTo(false);
}