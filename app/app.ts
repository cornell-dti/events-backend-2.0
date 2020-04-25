// This file is the entry point of the app and also routes the urls to specific
// handling methods in the handler.

import { Request, Response } from "express-serve-static-core";
import { Express } from "express";
import * as Logger from "./logging/logger";
// import * as handler from "./handler";
import * as userHandler from "./handlers/userHandler";
import * as orgHandler from "./handlers/orgHandler";
import { db } from "./util/firebase";
import { authenticate } from "./auth";

// Express ---------------------------------------------------------------------
const express = require("express");
const app: Express = express();
const port = process.env.PORT || 8080;
// -----------------------------------------------------------------------------

const shell = async (
  thisArg: any,
  f: Function,
  checkAuth: boolean,
  req: Request,
  res: Response,
  args?: any[]
) => {
  if (req.get("eve-pk") != process.env.EVE_PK) {
    let eve_pk_json = {
      error:
        'The header "eve-pk" was undefined or incorrect. To obtain the pk value, consult a TPM or dev lead.',
    };
    res.status(401).json(eve_pk_json);
    return;
  }
  if (checkAuth) {
    try {
      [req, res] = await authenticate(req, res);
    } catch (e) {
      let error = { error: `Authentication error: ${e}` }
      res.status(400).json(error);
      return;
    }
  }
  let promise: Promise<any> = f.apply(thisArg, args);
  if (req.url.toLowerCase() !== "/logs/") {
    promise
      .then((val) => {
        Logger.doLog(val, true, thisArg, f, req, res, args);
        res.status(200).json(val);
      })
      .catch((reason) => {
        let error = { error: "Promise rejected for: " + reason };
        Logger.doLog(error, false, thisArg, f, req, res, args);
        res.status(400).json(error);
      });
  } else {
    Logger.doLog(null, true, thisArg, f, req, res, args);
    promise
      .then((val) => {
        res.status(200).send(val);
      })
      .catch((reason) => {
        let error = { error: "Promise rejected for: " + reason };
        res.status(400).json(error);
      });
  }
};

function main() {
  app.use(express.json());
  app.get("/", (req, res) =>
    shell(
      undefined,
      (dbv: any, reqv: Request, resv: Response) => {
        resv.json({ test: "up!" });
      },
      false,
      req,
      res,
      [db, req, res]
    )
  );
  app.get("/logs/", (req, res) =>
    shell(Logger, Logger.getLogs, false, req, res, [db, req, res])
  );

  app.post("/createUser/", (req, res) =>
    shell(userHandler, userHandler.createUser, true, req, res, [db, req, res])
  );
  app.get("/getUser/", (req, res) =>
    shell(userHandler, userHandler.getUser, false, req, res, [db, req, res])
  );
  app.delete("/deleteUser/", (req, res) =>
    shell(userHandler, userHandler.deleteUser, false, req, res, [db, req, res])
  );

  app.post("/createOrg/", (req, res) =>
    shell(orgHandler, orgHandler.createOrg, false, req, res, [db, req, res])
  );
  app.get("/getOrg/", (req, res) =>
    shell(orgHandler, orgHandler.getOrg, false, req, res, [db, req, res])
  );
  app.post("/updateOrg/:orgID", (req, res) =>
    shell(orgHandler, orgHandler.updateOrg, false, req, res, [db, req, res])
  );

  app.listen(port, () =>
    console.log(`Backend running on http://localhost:${port}`)
  );
}

main();
