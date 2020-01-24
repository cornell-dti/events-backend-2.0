// This file is the entry point of the app and also routes the urls to specific
// handling methods in the handler.

// Read .env file --------------------------------------------------------------
let porttt = process.env.PORT || 8081;
console.log(porttt +
  "\n");
const dotenv = require('dotenv').config();
// -----------------------------------------------------------------------------

import { Request, Response } from "express-serve-static-core";
import { Express } from "express";
// import * as handler from "./handler";
import * as userHandler from "./userHandler";

// Express ---------------------------------------------------------------------
const express = require('express');
const app: Express = express()
const port = process.env.PORT || 8080;
// -----------------------------------------------------------------------------

// Firebase --------------------------------------------------------------------
let admin = require('firebase-admin');
let serviceAccount = require('../secrets/eventsbackenddatabase-firebase-adminsdk-ukak2-d1b3a5ef55.json');
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

function main() {
  app.use(express.json())
  app.post('/createUser/', (req: Request, res: Response) => userHandler.createUser(db, req, res))
  app.get('/getUser/', (req: Request, res: Response) => userHandler.getUser(db, req, res))
  app.delete('/deleteUser/', (req: Request, res: Response) => userHandler.deleteUser(db, req, res))

  app.listen(port, () => console.log(`Backend running on http://localhost:${port}`))
}
main();

