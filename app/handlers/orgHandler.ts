// This file contains the firebase implementations of the endpoints.

import { Request, Response } from "express-serve-static-core";
import { firestore } from "firebase";
import { Org } from "../types";
import { UpdateOrgRequest, GetOrgRequest, CreateOrgRequest, GetAllOrgsRequest } from "../requestTypes";
import { materialize } from "../util/commonOps";

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
  return orgRef.set(org).then(
    async doc => {
      return { orgId : orgRef.id };
    }).catch(
    async error => {
      return { error : error };
    });
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

export const getAllOrgs = async(
  db: firestore.Firestore,
  req: Request,
  res: Response
): Promise<any> => {
  let {id } = req.body as GetAllOrgsRequest;

  const orgs_snapshot = await db.collection("organizations").get();
  return orgs_snapshot.docs.map(org=>materialize(org.data()));


}

export const updateOrg = async (
  db: firestore.Firestore,
  req: Request,
  res: Response
): Promise<any> => {
  let request = req.body as UpdateOrgRequest;
  const orgRef = db.collection("organizations").doc(req.params.orgID);
  return await orgRef.update(request);
};