// This file is the entry point of the app and also routes the urls to specific
// handling methods in the handler.

import { Request, Response } from "express-serve-static-core";
import { Express } from "express";
// import * as handler from "./handler";
import * as testHandler from "./test_handler";

// Express ---------------------------------------------------------------------
const express = require('express');
const app: Express = express()
const port = 3000;
// -----------------------------------------------------------------------------

// Firebase --------------------------------------------------------------------
let admin = require('firebase-admin');
let serviceAccount = require('../secrets/eventsbackenddatabase-firebase-adminsdk-ukak2-d1b3a5ef55.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://eventsbackenddatabase.firebaseio.com"
});
let db = admin.firestore();
// -----------------------------------------------------------------------------

function main() {
  app.get('/testPut/', (req: Request, res: Response) => testHandler.doTestPut(db, req, res))
  app.get('/testGet/', (req: Request, res: Response) => testHandler.doTestGet(db, req, res))
  app.get('/testGet2/', (req: Request, res: Response) => testHandler.doTestGet2(db, req, res))
  app.get('/testGet3/', (req: Request, res: Response) => testHandler.doTestGet3(db, req, res))

  app.listen(port, () => console.log(`Backend running on http://localhost:${port}`))
}

main();

