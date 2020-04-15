import * as eventHandler from "../../handlers/eventHandler";
import { firestore } from "firebase";
import { describe } from "../testExtensions";
import { CreateEventRequest } from "../../requestTypes";

var MockExpressRequest = require("mock-express-request");
var MockExpressResponse = require("mock-express-response");

// BEGIN TESTS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

export async function runCreateTest(db: firestore.Firestore) {
  let mockBody: CreateEventRequest = {
    email: "stacy@gmail.com",
    name: "social distance please",
    description: "hope you guys are staying healthy",
    startDate: new Date(),
    endDate: new Date(),
    location: {
      room: "stay home",
      placeId: "123-456-789",
      building: "stay home",
    },
    tags: ["#social distance", "#six feet apart"],
    media: ""
  };
  let mockRequest = new MockExpressRequest({
    method: "POST",
    url: "/createEvent",
    body: mockBody
  });
  let mockResponse = new MockExpressResponse();

  // Simulate the app's sending of handler output to response
  mockResponse.json(
    await eventHandler.createEvent(db, mockRequest, mockResponse)
  );

  // Check actual Firebase data
  let eventResult = await db
    .collection("events")
    .doc('event').get()
    .then(doc => {
      describe("Expect event to exist").expect(doc.exists).toBe.equalTo(true);
      return doc.data();
    });
    describe("Event description should be correct")
    .expect(eventResult?.description).toBe.equalTo("hope you guys are staying healthy");
    describe("Event has an organizer").expect(eventResult?.organizer).is.defined();
}

