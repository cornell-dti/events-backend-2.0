// This file contains the firebase implementations of the endpoints.


import { Request, Response } from "express-serve-static-core";
import { firestore } from "firebase";
import { Event, Org, OrgUser, StudentUser } from "../types"
import { EventRequest, CreateUserRequest, GetUserRequest, DeleteUserRequest } from "../requestTypes";
import { v4 as uuid } from 'uuid';
import { materialize } from "../util/commonOps";

export async function createUser(db: firestore.Firestore, req: Request, res: Response): Promise<any> {
  let request = req.body as CreateUserRequest;
  if (request.isOrgUser) {
    let orgUser: OrgUser = {
      name: request.name,
      uuid: uuid(),
      email: request.email.toLowerCase()
    }
    let orgUserRef: firestore.DocumentReference = db.collection('orgUsers').doc(`${orgUser.email}`)
    return orgUserRef.get().then(
      async doc => {
        let orgUserDoc = doc;
        if (orgUserDoc.exists) {
          return { error: "OrgUser already exists!" };
        } else {
          return orgUserRef.set(orgUser).then((val) => {
            return (orgUser);
          });
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
    return studentUserRef.get().then(
      async doc => {
        let studentUserDoc = doc;
        if (studentUserDoc.exists) {
          return { error: "StudentUser already exists!" };
        } else {
          studentUserRef.set(studentUser).then(() => {
            return (studentUser);
          });
        }
      }
    );
  }
}

export async function getUser(db: firestore.Firestore, req: Request, res: Response): Promise<any> {
  let request = req.body as GetUserRequest;
  if (request.isOrgUser) {
    let orgUserDocRef = db.collection('orgUsers').doc(`${request.email.toLowerCase()}`);
    return orgUserDocRef.get().then(async doc => {
      if (doc.exists) {
        res.status(200).json(await materialize(doc.data()));
      } else {
        res.status(404).json({ error: "OrgUser with email: " + `${request.email.toLowerCase()}` + " not found!" });
      }
    });
  } else {
    let studentUserDocRef = db.collection('studentUsers').doc(`${request.email.toLowerCase()}`);
    return studentUserDocRef.get().then(async doc => {
      if (doc.exists) {
        return await materialize(doc.data());
      } else {
        return { error: "StudentUser with email: " + `${request.email.toLowerCase()}` + " not found!" };
      }
    });
  }
}

export async function deleteUser(db: firestore.Firestore, req: Request, res: Response): Promise<any> {
  let request = req.body as DeleteUserRequest;
  if (request.isOrgUser) {
    let orgUserDocRef = db.collection('orgUsers').doc(`${request.email.toLowerCase()}`);
    return orgUserDocRef.delete().then((val) => {
      return { deleted: true };
    });
  } else {
    let studentUserDocRef = db.collection('studentUsers').doc(`${request.email.toLowerCase()}`);
    return studentUserDocRef.delete().then((val) => {
      return { deleted: true };
    });
  }
}