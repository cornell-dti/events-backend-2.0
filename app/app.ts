// This file is the entry point of the app and also routes the urls to specific
// handling methods in the handler.

// Read .env file --------------------------------------------------------------
const dotenv = require('dotenv').config();
// -----------------------------------------------------------------------------

import { Request, Response } from "express-serve-static-core";
import { Express } from "express";
import * as Logger from "./logging/logger";
// import * as handler from "./handler";
import * as userHandler from "./handlers/userHandler";
import uuid from "uuid";

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
  // Now init app w/ full service account object
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://eventsbackenddatabase.firebaseio.com"
  });
}
updateServiceAccountWithSecrets();

let db = admin.firestore();
// -----------------------------------------------------------------------------

function shell(thisArg: any, f: Function, req: Request, res: Response, args?: any[]) {
  if (req.get('eve-pk') != process.env.EVE_PK) {
    let eve_pk_json = { "error": "The header \"eve-pk\" was undefined or incorrect. To obtain the pk value, consult a TPM or dev lead." };
    res.status(401).json(eve_pk_json);
    return;
  } else {
    let promise: Promise<any> = f.apply(thisArg, args);
    if (req.url.toLowerCase() !== "/logs/") {
      promise.then((val) => {
        Logger.doLog(val, true, thisArg, f, req, res, args);
        res.status(200).json(val);
      }).catch((reason) => {
        let error = { "error": "Promise rejected for: " + reason };
        Logger.doLog(error, false, thisArg, f, req, res, args);
        res.status(400).json(error);
      });
    } else {
      Logger.doLog(null, true, thisArg, f, req, res, args);
      promise.then((val) => {
        res.status(200).send(val);
      }).catch((reason) => {
        let error = { "error": "Promise rejected for: " + reason };
        res.status(400).json(error);
      });
    }
  }
}

function main() {
  app.use(express.json());
  app.get('/', (req: Request, res: Response) => shell(undefined, (dbv: any, reqv: Request, resv: Response) => { resv.json({ "test": "up!" }) }, req, res, [db, req, res]));
  app.get('/logs/', (req: Request, res: Response) => shell(Logger, Logger.getLogs, req, res, [db, req, res]));
  app.post('/createUser/', (req: Request, res: Response) => shell(userHandler, userHandler.createUser, req, res, [db, req, res]));
  app.get('/getUser/', (req: Request, res: Response) => shell(userHandler, userHandler.getUser, req, res, [db, req, res]));
  app.delete('/deleteUser/', (req: Request, res: Response) => shell(userHandler, userHandler.deleteUser, req, res, [db, req, res]));

  app.listen(port, () => console.log(`Backend running on http://localhost:${port}`))
}
main();

