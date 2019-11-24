import { Request, Response } from "express-serve-static-core";
import { Express } from "express";
import * as handler from "./handler";

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
  app.get('/testPut/', (req: Request, res: Response) => handler.doTestPut(db, req, res))
  app.get('/testGet/', (req: Request, res: Response) => handler.doTestGet(db, req, res))
  app.get('/testGet2/', (req: Request, res: Response) => handler.doTestGet2(db, req, res))

  app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}

main();

