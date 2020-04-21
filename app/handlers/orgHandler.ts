// This file contains the firebase implementations of the endpoints.

import { Request, Response } from "express-serve-static-core";
import { firestore } from "firebase";
import { Org } from "../types";
import { UpdateOrgRequest, GetOrgRequest, CreateOrgRequest } from "../requestTypes";

export const createOrg = async (
  db: firestore.Firestore,
  req: Request,
  res: Response
): Promise<any> => {
  let request = req.body as CreateOrgRequest;
  let userID = request.userEmail.toLowerCase();
  let userRef = db.collection("users").doc(userID);
  let org: Org = {
    ...request,
    orgUser: userRef,
  };
  const orgRef = db.collection("organizations").doc();
  await orgRef.set(org);
  return "Org successfully created!";
};

export const getOrg = async (
  db: firestore.Firestore,
  req: Request,
  res: Response
): Promise<any> => {
  let { id } = req.body as GetOrgRequest;
  const orgRef = db.collection("organizations").doc(id);
  return await orgRef.get();
};

export const updateOrg = async (
  db: firestore.Firestore,
  req: Request,
  res: Response
): Promise<any> => {
  let request = req.body as UpdateOrgRequest;
  const orgRef = db.collection("organizations").doc();
  return await orgRef.update(request);
};