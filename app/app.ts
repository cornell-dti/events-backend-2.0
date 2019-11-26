// This file is the entry point of the app and also routes the urls to specific
// handling methods in the handler.

import { Request, Response } from "express-serve-static-core";
import { Express } from "express";
// import * as handler from "./handler";
import * as userHandler from "./userHandler";

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
  app.use(express.json())
  app.post('/createUser/', (req: Request, res: Response) => userHandler.createUser(db, req, res))
  app.get('/getUser/', (req: Request, res: Response) => userHandler.getUser(db, req, res))
  app.delete('/deleteUser/', (req: Request, res: Response) => userHandler.deleteUser(db, req, res))

  app.listen(port, () => console.log(`Backend running on http://localhost:${port}`))
}
main();

