import * as eventHandler from "../../handlers/eventHandler";
import { firestore } from "firebase";
import { describe } from "../testExtensions";
import { CreateEventRequest, GetEventRequest, GetEventsRequest, DeleteEventRequest, EditEventRequest } from "../../requestTypes";

var MockExpressRequest = require("mock-express-request");
var MockExpressResponse = require("mock-express-response");

// BEGIN TESTS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export async function runCreateTest(db: firestore.Firestore) {
  let mockBody: CreateEventRequest = {
    orgId: "stacy@gmail.com",
    name: "barb-eve",
    description: "eve is the best",
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
  let mockResult = mockResponse._getJSON();
  let eventResult = await db.collection("events").doc(mockResult.eventId).get()
    .then(doc => {
      describe("Expect event to exist").expect(doc.exists).toBe.equalTo(true);
      return doc.data();
    });
    describe("Event description should be correct")
    .expect(eventResult?.description).toBe.equalTo("eve is the best");
    describe("Event has an organizer").expect(eventResult?.organizer).is.defined();
}

// Edit Event
export async function runEditTest(db: firestore.Firestore) {
  let mockBody: EditEventRequest = {
    eventId: "event",
    event: {
      name: "new name",
      description: "new description",
      media: "new media link"
    }
  };

  let mockRequest = new MockExpressRequest({
    method: "GET",
    url: "/editEvent/",
    body: mockBody
  });

  let mockResponse = new MockExpressResponse();

  // Simulate the app's sending of handler output to response
  mockResponse.json(
    await eventHandler.editEvent(db, mockRequest, mockResponse)
  );

  let mockResult = mockResponse._getJSON();
  describe("Event name should have changed").expect(mockResult?.name).toBe.equalTo("new name");
  describe("Event description should have changed").expect(mockResult?.description).toBe.equalTo("new description");
  describe("Event media link should have changed").expect(mockResult?.media).toBe.equalTo("new media link");
}

// Get Event Test
export async function runGetTest(db: firestore.Firestore) {
  let mockBody: GetEventRequest = {
    eventId: "event-1"
  };

  let mockRequest = new MockExpressRequest({
    method: "GET",
    url: "/getEvent/",
    body: mockBody
  });
  let mockResponse = new MockExpressResponse();

  // Simulate the app's sending of handler output to response
  mockResponse.json(
    await eventHandler.getEvent(db, mockRequest, mockResponse)
  );

  let mockResult = mockResponse._getJSON();
  describe("Event name should be correct").expect(mockResult?.name).toBe.equalTo("social distance please");
  describe("Event description should be correct").expect(mockResult?.description).toBe.equalTo("hope you guys are staying healthy");
  describe("Event has a room").expect(mockResult?.location.room).toBe.equalTo("stay home");
  describe("Event has an organizer").expect(mockResult?.organizer).is.defined();
  describe("Event has no media").expect(mockResult?.media).toBe.equalTo("");
  describe("Event tags has two tags").expect(mockResult?.tags.length).toBe.equalTo(2);
}

// Get All Events for an Organization Test
export async function runGetAllTest(db: firestore.Firestore) {
  let mockBody: GetEventsRequest = {
    orgId: "stacy@gmail.com"
  };

  let mockRequest = new MockExpressRequest({
    method: "GET",
    url: "/getEvents/",
    body: mockBody
  });

  let mockResponse = new MockExpressResponse();

  // Simulate the app's sending of handler output to response
  mockResponse.json(
    await eventHandler.getEvents(db, mockRequest, mockResponse)
  );

  let mockResult = mockResponse._getJSON();
  describe("Events returned is defined").expect(mockResult).is.defined();
}

// Get Events for the Feed
export async function runGetEventFeedTest(db: firestore.Firestore) {

  let mockRequest = new MockExpressRequest({
    method: "GET",
    url: "/getEventFeed/",
    body: {}
  });

  let mockResponse = new MockExpressResponse();

  // Simulate the app's sending of handler output to response
  mockResponse.json(
    await eventHandler.getEventFeed(db, mockRequest, mockResponse)
  );

  let mockResult = mockResponse._getJSON();
  describe("Event feed is defined").expect(mockResult).is.defined();
}

// Delete Event
export async function runDeleteTest(db: firestore.Firestore) {
  let mockBody: DeleteEventRequest = {
    eventId: "event-2",
    orgId: ""
  }

  let mockRequest = new MockExpressRequest({
    method: "DELETE",
    url: "/deleteEvent/",
    body: mockBody
  });

  let mockResponse = new MockExpressResponse();

   // Simulate the app's sending of handler output to response
  mockResponse.json(
    await eventHandler.deleteEvent(db, mockRequest, mockResponse)
  );

  let docExists;
  await db.collection("events").doc(mockRequest.body.eventId).get().then(
    doc => {
      docExists = doc.exists;
    });
  describe("Event deleted returned true").expect(mockResponse._getJSON().deleted).toBe.equalTo(true);
  describe("Event document does not exist").expect(docExists).toBe.equalTo(false);
}

