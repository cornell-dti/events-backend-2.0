import * as orgHandler from "../../handlers/orgHandler";
import { firestore } from 'firebase';
import { describe } from '../testExtensions';
import * as runTests from '../runTests';
import { CreateOrgRequest } from '../../requestTypes';
var MockExpressRequest = require('mock-express-request');
var MockExpressResponse = require('mock-express-response');

export async function runCreateOrgTest(db: firestore.Firestore) {
  let mockBody : CreateOrgRequest = {
    name: "dti",
    email: "dti@gmail.com",
    // is firebase searching by email or useremail?
    userEmail:"gz78@cornell.edu",
    tags: ["social"],
    bio: "I got to Cornell, ever heard of it?",
    media: "google.com/images",
    website:"https://www.cornelldti.org/"
  }
  
  let mockRequest = new MockExpressRequest(
    {
      method: 'POST',
      url: '/createOrgUser/',
      body: mockBody
    });
  
  let mockResponse = new MockExpressResponse();
  let preDoc = db.collection('orgs').doc('dti@gmail.com')
  // do we plan on searching orgs by their email or useremail?
  // can one account email create multiple orgs?
  await preDoc.get().then(async snap => {
    if (snap.exists) {
      await snap.ref.delete();
      return;
    }
  });
  mockResponse.json(
    await orgHandler.createOrg(db, mockRequest, mockResponse)
  );
  
  let orgResult = await db
    .collection("orgs")
    .doc("dti@gmail.com")
    .get()
    .then(doc => {
      describe("Expect user dti@gmail.com doc to exist")
        .expect(doc.exists)
        .toBe.equalTo(true);
      return doc.data();
    });
  describe("User tags should be correct")
    .expect(orgResult?.tags)
    .is.defined();

  // Simulate the app's sending of handler output to resposne

}


export async function runGetOrgTest(db: firestore.Firestore) {
  let mockBody: GetOrgRequest = {
    email: "dti@gmail.com"
  };
  let mockRequest = new MockExpressRequest({
    method: "GET",
    url: "/getOrg/",
    body: mockBody
  });
  let mockResponse = new MockExpressResponse();
  let preDoc = db.collection("orgs").doc("dti@gmail.com");
  await preDoc.get().then(async snap => {
    if (snap.exists) {
      return;
    }
    await preDoc.set({
      tags: ["freefood", "positivity"]
    });
  });

  mockResponse.json(await orgHandler.getOrg(db, mockRequest, mockResponse));
  // is getOrg the function defined ?
  let mockResult = mockResponse._getJSON();
  describe("Org displayName should be defined")
  // what is displayname for orgs??
    .expect(mockResult.displayName)
    .is.defined();
  describe("org email should be dti@gmail.com")
    .expect(mockResult.email)
    .toBe.equalTo("dti@gmail.com");
  
  // Check actual Firebase data
  let orgResult = await db
    .collection("orgs")
    .doc("dti@gmail.com")
    .get()
    .then(doc => {
      describe("Expect user dti@gmail.com doc to exist")
        .expect(doc.exists)
        .toBe.equalTo(true);
      return doc.data();
    });
  describe("User tags should be correct")
    .expect(orgResult?.tags)
    .is.defined();
}
