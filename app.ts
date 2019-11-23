import { Request, Response } from "express-serve-static-core";
import { Express } from "express";

// Express ---------------------------------------------------------------------
const express = require('express');
const app: Express = express()
const port = 3000;
// -----------------------------------------------------------------------------

// Firebase --------------------------------------------------------------------
let admin = require('firebase-admin');
// let serviceAccount = require('path/to/serviceAccountKey.json');

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });
// let db = admin.firestore();
// -----------------------------------------------------------------------------

function main() {
  app.get('/', (req: Request, res: Response) => res.send('Hello World!'))

  app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}

main();

