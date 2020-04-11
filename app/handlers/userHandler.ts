// This file contains the firebase implementations of the endpoints.


import { Request, Response } from "express-serve-static-core";
import { firestore } from "firebase";
import { Event, Org, UserInfo } from "../types"
import { EventRequest, CreateUserRequest, GetUserRequest, DeleteUserRequest } from "../requestTypes";
import { v4 as uuid } from 'uuid';
import { materialize } from "../util/commonOps";
import { auth } from '../util/firebase';

export async function createUser(db: firestore.Firestore, req: Request, res: Response): Promise<any> {
  let request = req.body as CreateUserRequest;
  let id = request.email.toLowerCase();
  let user: UserInfo = {
    tags: request.tags || []
  };
  let userRef: firestore.DocumentReference = db.collection('users').doc(id);
  return userRef.get().then(
    async doc => {
      let userDoc = doc;
      if (userDoc.exists) {
        return { error: "User already exists!" };
      } else {
        return userRef.set(user).then((val) => {
          return "User successfully created!";
        });
      }
    }
  );
}

export async function getUser(db: firestore.Firestore, req: Request, res: Response): Promise<any> {
  let request = req.body as GetUserRequest;
  let id = request.email.toLowerCase();
  let userDocRef = db.collection('users').doc(id);
  return auth.getUserByEmail(id)
    .then(async ({ uid, email, displayName, photoURL }) => {
      const doc = await userDocRef.get();
      if (!doc.exists) {
        throw `User with email: ${id} not found!`;
      }
      return {
        uid, email, displayName, photoURL, ...await materialize(doc.data())
      };
    })
    .catch((error) => {
      console.log('Error fetching user data:', error);
      return { error: error };
    });
}

export async function deleteUser(db: firestore.Firestore, req: Request, res: Response): Promise<any> {
  let request = req.body as DeleteUserRequest;
  let id = request.email.toLowerCase();
  let userDocRef = db.collection('users').doc(id);
  return userDocRef.delete().then((val) => {
    return { deleted: true };
  });
}