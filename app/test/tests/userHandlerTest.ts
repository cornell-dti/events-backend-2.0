import * as userHandler from '../../handlers/userHandler';
import { firestore } from 'firebase';
import { describe } from '../testExtensions';
import * as runTests from '../runTests';
var MockExpressRequest = require('mock-express-request');
var MockExpressResponse = require('mock-express-response');


// Begin Tests -----------------------------------------------------------------

export async function runDeleteTest(db: firestore.Firestore) {

  let mockRequest = new MockExpressRequest(
    {
      method: 'POST',
      url: '/deleteUser/',
      body: {
        email: "jaggerbrulato@gmail.com",
        isOrgUser: true
      }
    }
  );
  let mockResponse = new MockExpressResponse();
  // Simulate the app's sending of handler output to response
  mockResponse.json(await userHandler.deleteUser(db, mockRequest, mockResponse));
  let docExists;
  await db.collection('orgUsers').doc(mockRequest.body.email).get().then(doc => {
    docExists = doc.exists;
  });
  describe("User deleted returned true").expect(mockResponse._getJSON().deleted).toBe.equalTo(true);
  describe("Expect doc not to exist").expect(docExists).toBe.equalTo(false);
}

export async function runCreateTest(db: firestore.Firestore) {
  let mockRequest = new MockExpressRequest(
    {
      method: 'POST',
      url: '/createUser/',
      body: {
        name: "Jagger",
        email: "jaggerbrulato@gmail.com",
        isOrgUser: true
      }
    }
  );
  let mockResponse = new MockExpressResponse();
  // Simulate the app's sending of handler output to resposne
  mockResponse.json(await userHandler.createUser(db, mockRequest, mockResponse));
  let orgUserResp: any;
  await db.collection('orgUsers').doc("jaggerbrulato@gmail.com").get()
    .then(doc => {
      orgUserResp = doc.data();
    });
  describe("Orguser name should be Jagger").expect(orgUserResp.name).toBe.equalTo("Jagger");
  describe("Orguser email should be jaggerbrulato@gmail.com").expect(orgUserResp.email).toBe.equalTo("jaggerbrulato@gmail.com");
}

export async function runGetTest(db: firestore.Firestore) {
  let mockRequest = new MockExpressRequest(
    {
      method: 'GET',
      url: '/getUser/',
      body: {
        email: "jaggerbrulato@gmail.com",
        isOrgUser: true
      }
    }
  );
  let mockResponse = new MockExpressResponse();
  // Simulate the app's sending of handler output to resposne
  mockResponse.json(await userHandler.getUser(db, mockRequest, mockResponse));
  let orgUserResp: any;
  await db.collection('orgUsers').doc("jaggerbrulato@gmail.com").get()
    .then(doc => {
      describe("Expect orguser jaggerbrulato@gmail.com doc to exist").expect(doc.exists).toBe.equalTo(true);
      orgUserResp = doc.data();
    });
  describe("Expect OrgUser name to be defined").expect(orgUserResp.name).is.defined();
  describe("Orguser email should be jaggerbrulato@gmail.com").expect(orgUserResp.email).toBe.equalTo("jaggerbrulato@gmail.com");
}