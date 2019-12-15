// This file contains the firebase implementations of the endpoints.

import { Request, Response } from "express-serve-static-core";
import { auth } from "firebase-admin";
import { firestore, auth as Auth } from "firebase";
import { Event, Org, OrgUser, StudentUser, User } from "./types"
import { EventRequest, CreateUserRequest, GetUserRequest, DeleteUserRequest } from "./requestTypes";
import * as commonOps from "./util/commonOps";
import { v4 as uuid } from 'uuid';
import { materialize } from "./util/commonOps";
const bcrypt = require('bcrypt');

export async function createUser(db: firestore.Firestore, req: Request, res: Response, auth: auth.Auth) {
  let request = req.body as CreateUserRequest;
  if (request.password !== request.confirm_password) {
    res.status(400).json({ error: "Passwords do not match."})
  }
  let userRef: firestore.DocumentReference = db.collection('users').doc(`${request.email}`)
  await userRef.get().then(
    async doc => {
      let userDoc = doc;
      if (userDoc.exists) {
        res.status(400).json({ error: "User already exists!" });
      } else {
        let user: User = {
          name: request.name,
          uuid: uuid(),
          email: request.email.toLowerCase(),
          hash: bcrypt.hashSync(request.password, 10),
          token: await auth.createCustomToken(request.email.toLowerCase()),
          isOrgUser: request.isOrgUser
        }
        await userRef.set(user);
        res.status(200).json({ token: user.token });
      }
    }
  );
}

export async function getUser(db: firestore.Firestore, req: Request, res: Response) {
  let request = req.body as GetUserRequest;
  let userDocRef = db.collection('users').doc(`${request.email.toLowerCase()}`);
  await userDocRef.get().then(async doc => {
    if (doc.exists) {
      let data = await materialize(doc.data());
      let user = data as User;
      if (bcrypt.compareSync(request.password, user.hash)) {
        res.status(200).json({ token: user.token });
      } else {
        res.status(400).json({ error: "Incorrect password." });
      }
    } else {
      res.status(404).json({ error:  `User with email: ${request.email.toLowerCase()} not found!` });
    }
  });
}

export async function deleteUser(db: firestore.Firestore, req: Request, res: Response) {
  let user: User = req.body.user;
  let userDocRef = db.collection('users').doc(`${user.email}`);
  await userDocRef.delete();
  res.status(200).json({ deleted: true });}