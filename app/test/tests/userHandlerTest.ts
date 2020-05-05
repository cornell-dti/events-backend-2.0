import * as userHandler from "../../handlers/userHandler";
import { firestore } from "firebase";
import { describe } from "../testExtensions";
import * as runTests from "../runTests";
import {
  CreateUserRequest,
  GetUserRequest,
  DeleteUserRequest
} from "../../requestTypes";

var MockExpressRequest = require("mock-express-request");
var MockExpressResponse = require("mock-express-response");

// Begin Tests -----------------------------------------------------------------

export async function runDeleteTest(db: firestore.Firestore) {
  let mockBody: DeleteUserRequest = {
    email: "sirenochen@gmail.com"
  };
  let mockRequest = new MockExpressRequest({
    method: "POST",
    url: "/deleteUser/",
    body: mockBody,
    authInfo: {
      email: "sirenochen@gmail.com"
    }
  });
  let mockResponse = new MockExpressResponse();
  let preDoc = db.collection("users").doc("sirenochen@gmail.com");
  await preDoc.get().then(async snap => {
    if (snap.exists) {
      return;
    }
    await preDoc.set({
      tags: ["freefood", "positivity"]
    });
  });
  // Simulate the app's sending of handler output to response
  mockResponse.json(
    await userHandler.deleteUser(db, mockRequest, mockResponse)
  );
  let docExists;
  await db
    .collection("orgUsers")
    .doc(mockRequest.body.email)
    .get()
    .then(doc => {
      docExists = doc.exists;
    });
  describe("User deleted returned true")
    .expect(mockResponse._getJSON().deleted)
    .toBe.equalTo(true);
  describe("Expect doc not to exist")
    .expect(docExists)
    .toBe.equalTo(false);
}

export async function runCreateTest(db: firestore.Firestore) {
  let mockBody: CreateUserRequest = {
    email: "sirenochen@gmail.com",
    tags: ["freefood", "positivity"]
  };
  let mockRequest = new MockExpressRequest({
    method: "POST",
    url: "/createUser/",
    body: mockBody,
    authInfo: {
      email: "sirenochen@gmail.com"
    }
  });
  let mockResponse = new MockExpressResponse();
  let preDoc = db.collection("users").doc("sirenochen@gmail.com");
  await preDoc.get().then(async snap => {
    if (snap.exists) {
      await snap.ref.delete();
      return;
    }
  });
  // Simulate the app's sending of handler output to response
  mockResponse.json(
    await userHandler.createUser(db, mockRequest, mockResponse)
  );
  
  // Check actual Firebase data
  let userResult = await db
    .collection("users")
    .doc("sirenochen@gmail.com")
    .get()
    .then(doc => {
      describe("Expect user sirenochen@gmail.com doc to exist")
        .expect(doc.exists)
        .toBe.equalTo(true);
      return doc.data();
    });
  describe("User tags should be correct")
    .expect(userResult?.tags)
    .is.defined();
}

export async function runGetTest(db: firestore.Firestore) {
  let mockBody: GetUserRequest = {
    email: "sirenochen@gmail.com"
  };
  let mockRequest = new MockExpressRequest({
    method: "GET",
    url: "/getUser/",
    body: mockBody,
    authInfo: {
      email: "sirenochen@gmail.com"
    }
  });
  let mockResponse = new MockExpressResponse();
  let preDoc = db.collection("users").doc("sirenochen@gmail.com");
  await preDoc.get().then(async snap => {
    if (snap.exists) {
      return;
    }
    await preDoc.set({
      tags: ["freefood", "positivity"]
    });
  });

  // Simulate the app's sending of handler output to response
  mockResponse.json(await userHandler.getUser(db, mockRequest, mockResponse));
  let mockResult = mockResponse._getJSON();
  describe("User displayName should be defined")
    .expect(mockResult.displayName)
    .is.defined();
  describe("User email should be sirenochen@gmail.com")
    .expect(mockResult.email)
    .toBe.equalTo("sirenochen@gmail.com");
  
  // Check actual Firebase data
  let userResult = await db
    .collection("users")
    .doc("sirenochen@gmail.com")
    .get()
    .then(doc => {
      describe("Expect user sirenochen@gmail.com doc to exist")
        .expect(doc.exists)
        .toBe.equalTo(true);
      return doc.data();
    });
  describe("User tags should be correct")
    .expect(userResult?.tags)
    .is.defined();
}
