// This file is the entry point of the app and also routes the urls to specific
// handling methods in the handler.

// Read .env file --------------------------------------------------------------
const dotenv = require('dotenv').config();
// -----------------------------------------------------------------------------

import { Request, Response } from "express-serve-static-core";
import { Express } from "express";
// import * as handler from "./handler";
import * as userHandler from "./handlers/userHandler";
import fs from 'fs';
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

let tabSpaceSize = 2;
let tabStr = "  ";

function shell(thisArg: any, f: Function, req: Request, res: Response, args?: any[]) {
  requestBoxLog("REQUEST TO: " + req.url);
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    ((req.connection as any)['socket'] ? (req.connection as any)['socket'].remoteAddress : null);
  console.log(tabStr + "├─── BY: " + ip);
  console.log(tabStr + "├─── AT: " + new Date().toString());
  if (req.get('eve-pk') != process.env.EVE_PK) {
    console.log(tabStr + "├─── STATUS: REJECTED");
    let eve_pk_json = { "error": "The header \"eve-pk\" was undefined or incorrect. To obtain the pk value, consult a TPM or dev lead." };
    res.status(401).json(eve_pk_json);
    return;
  } else {
    console.log(tabStr + "├─── STATUS: ACCEPTED");
    console.log(tabStr + (req.url.toLowerCase() != "/logs/" ? "├" : "└") + "─── CALLED: " + f.name);
    f.apply(thisArg, args);
  }
}

function printOnResponse(req: Request, res: Response, next: any) {
  // var oldSend = res.send;
  var oldJSON = res.json;

  // res.send = function (data: any) {
  //   if (data != undefined && req.url.trim().toLowerCase() != "/logs/") {
  //     let str: string = JSON.stringify(data, null, 2);
  //     responseBoxLog(str);
  //   }
  //   return oldSend.apply(res, arguments as any);
  // }

  res.json = function (data: any) {
    if (data != undefined && req.url.trim().toLowerCase() != "/logs/") {
      let str: string = JSON.stringify(data, null, 2);
      responseBoxLog(str);
    }
    return oldJSON.apply(res, arguments as any);
  }
  next();
}
app.use(printOnResponse);

let requestBoxLog = (msg: string) => {
  let msgFin = "│ " + msg + " │";
  let msgTop = "┌" + ((msgFinIn: string) => {
    let str = "";
    for (let i = 0; i < msgFinIn.length - 2; i++) {
      str += "─";
    }
    return str;
  })(msgFin) + "┐";
  let msgBottom = "└" + ((msgFinIn: string) => {
    let str = "";
    for (let i = 0; i < msgFinIn.length - 2; i++) {
      if (i == tabSpaceSize - 1) {
        str += "┬";
      } else {
        str += "─";
      }
    }
    return str;
  })(msgFin) + "┘";
  console.log(msgTop);
  console.log(msgFin);
  console.log(msgBottom);
};

let responseBoxLog = (msg: string) => {
  let maxMsgLen = 60;
  let msgFin = "";
  let msgLen = Math.min(msg.length, maxMsgLen);
  if (msg.length + 4 < maxMsgLen && !msg.includes("\n")) {
    msgFin = "│ " + msg + ((value: string) => {
      let concatStr = "";
      for (let i = 0; i < msgLen - value.length - 4; i++) {
        concatStr += " ";
      }
      return concatStr;
    })(msg) + " │";
  } else {
    let strs = msg.split('\n');
    if (strs.length <= 1) {
      strs = [];
      strs.unshift("RESPONSE OF:");
      for (let i = 0; i < msg.length; i += maxMsgLen) {
        strs.push(((msgFinIn: string) => {
          let str = "│ ";
          str += msg.substr(i, Math.min(i + maxMsgLen - 4, msgFinIn.length));
          let fin = " │";
          return str + fin;
        })(msg));
      }
    } else {
      strs.unshift("RESPONSE OF:");
      for (let i = 0; i < strs.length; i++) {
        let line = strs[i];
        if (line.length > maxMsgLen - 4) {
          strs.splice(i, 1, line.substr(0, maxMsgLen - 4), line.substr(maxMsgLen - 4, line.length));
        }
        if (i > 50)
          break
      }
      strs.forEach((val: any, ind: number) => {
        strs[ind] = "│ " + val + ((value: string) => {
          let concatStr = "";
          for (let i = 0; i < msgLen - value.length - 4; i++) {
            concatStr += " ";
          }
          return concatStr;
        })(val) + " │";
      });
    }
    msgFin = strs.reduce((prev: string, curr: string, currInd: number, arr: string[]) => {
      if (currInd == arr.length - 1) {
        return prev += curr;
      } else {
        return prev += (curr + "\n");
      }
    }, "");
  }
  let msgTop = "┌" + ((msgFinIn: string) => {
    let str = "";
    for (let i = 0; i < msgLen - 2; i++) {
      if (i == tabSpaceSize - 1) {
        str += "┴";
      } else {
        str += "─";
      }
    }
    return str;
  })(msg) + "┐";
  let msgBottom = "└" + ((msgFinIn: string) => {
    let str = "";
    for (let i = 0; i < msgLen - 2; i++) {
      str += "─";
    }
    return str;
  })(msg) + "┘";
  console.log(msgTop);
  console.log(msgFin);
  console.log(msgBottom);
};

let getLogs = (dbv: any, reqv: Request, resv: Response) => {
  fs.readFile('logs.txt', { encoding: null, flag: undefined }, (err: any, data: Buffer) => {
    if (err) {
      console.log("\nUnable to retrieve logs!");
      resv.send("Unable to retrieve logs!");
    } else {
      resv.send(data);
    }
  });
};

function main() {
  app.use(express.json());
  app.get('/', (req: Request, res: Response) => shell(undefined, (dbv: any, reqv: Request, resv: Response) => { resv.json({ "test": "up!" }) }, req, res, [db, req, res]));
  app.get('/logs/', (req: Request, res: Response) => shell(undefined, getLogs, req, res, [db, req, res]));
  app.post('/createUser/', (req: Request, res: Response) => shell(userHandler, userHandler.createUser, req, res, [db, req, res]));
  app.get('/getUser/', (req: Request, res: Response) => shell(userHandler, userHandler.getUser, req, res, [db, req, res]));
  app.delete('/deleteUser/', (req: Request, res: Response) => shell(userHandler, userHandler.deleteUser, req, res, [db, req, res]));

  app.listen(port, () => console.log(`Backend running on http://localhost:${port}`))
}
main();

