// This file is the entry point of the app and also routes the urls to specific
// handling methods in the handler.

import { Request, Response, NextFunction } from "express-serve-static-core";
import { Express } from "express";
// import * as handler from "./handler";
import * as userHandler from "./userHandler";
import { firestore } from "firebase";
import { User } from "./types";
const jwt = require('jsonwebtoken');
const NodeRSA = require('node-rsa');

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
let auth = admin.auth();
// -----------------------------------------------------------------------------


const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
    res.status(403).json({ error: "No auth header." });
  } else {
    let parsed: string[] = req.headers.authorization.split(' ');
    let token: string = parsed.length == 2 ? parsed[1] : "";
    let publicKey = new NodeRSA().importKey(serviceAccount.private_key, "pkcs8-private-pem").exportKey("pkcs8-public-pem");
    jwt.verify(token, publicKey, (error: Error, decoded_token: any ) => {
      if(error != null) {
        res.status(400).json
      }
      db.collection('users').doc(decoded_token.uid).get()
      .then((doc: firestore.QueryDocumentSnapshot) => {
        if(!doc.exists){
          res.status(400).json({ error: "Error finding user." });
        } else {
          req.body.user = doc.data() as User;
          next();
        }
      })
      .catch((err: Error) => {
        res.status(400).json({ error: "Error querying database." });
      });
    });
  }
};

function main() {
  app.use(express.json())
  app.post('/createUser/', (req: Request, res: Response) => userHandler.createUser(db, req, res, auth))
  app.get('/getUser/', (req: Request, res: Response) => userHandler.getUser(db, req, res))
  app.delete('/deleteUser/', authenticate, (req: Request, res: Response) => userHandler.deleteUser(db, req, res))

  app.listen(port, () => console.log(`Backend running on http://localhost:${port}`))
}
main();

