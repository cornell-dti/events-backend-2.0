// This file contains the firebase implementations of the endpoints.


import { Request, Response } from "express-serve-static-core";
import { firestore } from "firebase";
import { Event, Org, OrgUser, StudentUser } from "../types"
import { EventRequest, CreateUserRequest, GetUserRequest, DeleteUserRequest } from "../requestTypes";
import * as commonOps from "../util/commonOps";
import { v4 as uuid } from 'uuid';
import { materialize } from "../util/commonOps";

export async function createUser(db: firestore.Firestore, req: Request, res: Response) {
  let request = req.body as CreateUserRequest;
  if (request.isOrgUser) {
    let orgUser: OrgUser = {
      name: request.name,
      uuid: uuid(),
      email: request.email.toLowerCase()
    }
    let orgUserRef: firestore.DocumentReference = db.collection('orgUsers').doc(`${orgUser.email}`)
    await orgUserRef.get().then(
      async doc => {
        let orgUserDoc = doc;
        if (orgUserDoc.exists) {
          res.status(400).json({ error: "OrgUser already exists!" });
        } else {
          await orgUserRef.set(orgUser);
          res.status(200).json(orgUser);
        }
      }
    );
  } else {
    let studentUser: StudentUser = {
      name: request.name,
      uuid: uuid(),
      email: request.email.toLowerCase()
    }
    let studentUserRef: firestore.DocumentReference = db.collection('studentUsers').doc(`${studentUser.email}`)
    await studentUserRef.get().then(
      async doc => {
        let studentUserDoc = doc;
        if (studentUserDoc.exists) {
          res.status(400).json({ error: "StudentUser already exists!" });
        } else {
          await studentUserRef.set(studentUser);
          res.status(200).json(studentUser);
        }
      }
    );
  }
}

export async function getUser(db: firestore.Firestore, req: Request, res: Response) {
  let request = req.body as GetUserRequest;
  if (request.isOrgUser) {
    let orgUserDocRef = db.collection('orgUsers').doc(`${request.email.toLowerCase()}`);
    await orgUserDocRef.get().then(async doc => {
      if (doc.exists) {
        res.status(200).json(await materialize(doc.data()));
      } else {
        res.status(404).json({ error: "OrgUser with email: " + `${request.email.toLowerCase()}` + " not found!" });
      }
    });
  } else {
    let studentUserDocRef = db.collection('studentUsers').doc(`${request.email.toLowerCase()}`);
    await studentUserDocRef.get().then(async doc => {
      if (doc.exists) {
        res.status(200).json(await materialize(doc.data()));
      } else {
        res.status(404).json({ error: "StudentUser with email: " + `${request.email.toLowerCase()}` + " not found!" });
      }
    });
  }
}

export async function deleteUser(db: firestore.Firestore, req: Request, res: Response) {
  let request = req.body as DeleteUserRequest;
  if (request.isOrgUser) {
    let orgUserDocRef = db.collection('orgUsers').doc(`${request.email.toLowerCase()}`);
    await orgUserDocRef.delete();
    res.status(200).json({ deleted: true });
  } else {
    let studentUserDocRef = db.collection('studentUsers').doc(`${request.email.toLowerCase()}`);
    await studentUserDocRef.delete();
    res.status(200).json({ deleted: true });
  }
}