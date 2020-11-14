import * as orgHandler from "../../handlers/orgHandler";
import { firestore } from 'firebase';
import { describe } from '../testExtensions';
import * as runTests from '../runTests';
import { DeleteOrgRequest, CreateOrgRequest } from '../../requestTypes';
var MockExpressRequest = require('mock-express-request');
var MockExpressResponse = require('mock-express-response');

export async function runCreateOrgTest(db: firestore.Firestore) {
  let mockBody : CreateOrgRequest = {
    name: "dti",
    email: "dti@gmail.com",
    // is firebase searching by email or useremail?
    userEmail: "gz78@cornell.edu",
    bio: "I got to Cornell, ever heard of it?",
    media: "google.com/images",
    tags:["social"],
    website:"https://www.cornelldti.org/"
  }
  
  let mockRequest = new MockExpressRequest(
    {
      method: 'POST',
      url: '/createOrg/',
      body: mockBody
    });
  
  let mockResponse = new MockExpressResponse();
  let preDoc = db.collection('organizations').doc('dti@gmail.com')
  // do we plan on searching orgs by their email or useremail?
  // can one account email create multiple orgs?
  
  mockResponse.json(
    await orgHandler.createOrg(db, mockRequest, mockResponse)
  );
  
  let mockresult = mockResponse._getJSON();
  let orgResult = await db
    .collection("organizations")
    .doc(mockresult.orgId)
    .get()
    .then(doc => {
      describe("Expect user dti@gmail.com doc to exist")
        .expect(doc.exists)
        .toBe.equalTo(true);
      return doc.data();
    });
  describe("Useremail is correct")
    .expect(orgResult?.userEmail)
    .toBe.equalTo("gz78@cornell.edu");
  
    describe("bio is correct")
    .expect(orgResult?.bio)
    .toBe.equalTo("I got to Cornell, ever heard of it?");
  

  // Simulate the app's sending of handler output to resposne

}

export async function runDeleteOrgTest(db: firestore.Firestore) {
  let mockBody : DeleteOrgRequest = {
    id: "7JZuSw9xgQVUI5JAJMiz"
  }
  
  let mockRequest = new MockExpressRequest(
    {
      method: 'DELETE',
      url: '/deleteOrg/',
      body: mockBody
    });
  
  let mockResponse = new MockExpressResponse();
  //let preDoc = db.collection('organizations').doc('dti@gmail.com')
  // do we plan on searching orgs by their email or useremail?
  // can one account email create multiple orgs?
  
  mockResponse.json(
    await orgHandler.deleteOrg(db, mockRequest, mockResponse)
  );
  
  let mockresult = mockResponse._getJSON();
  const orgRef = await db.collection('organizations').doc("7JZuSw9xgQVUI5JAJMiz").get();
 
    describe("Expect org user 7JZuSw9xgQVUI5JAJMiz to be deleted ")
    .expect(orgRef.exists).toBe.equalTo(false);
    
  }


  // Simulate the app's sending of handler output to resposne






