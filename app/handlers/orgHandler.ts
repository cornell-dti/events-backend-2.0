// This file contains the firebase implementations of the endpoints.

import { Request, Response } from "express-serve-static-core";
import { firestore } from "firebase";
import { Org } from "../types";
import { UpdateOrgRequest, GetOrgRequest, CreateOrgRequest, GetAllOrgsRequest, DeleteOrgRequest } from "../requestTypes";
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
    async () => {
      return { orgId : orgRef.id };
    }).catch(
    async error => {
     return { error : error} ;
    });
};

export const getOrg = async (
  db: firestore.Firestore,
  req: Request,
  res: Response
): Promise<any> => {
  let { id } = req.body as GetOrgRequest;
  const orgRef = db.collection("organizations").doc(id);
  return orgRef
    .get()
    .then(async (doc) => {
      return await materialize(doc.data());
    })
    .catch(async (error) => {
      return { error: error || "Unable to retrieve org" };
    });
};

export const getAllOrgs = async(
  db: firestore.Firestore,
  req: Request,
  res: Response
): Promise<any> => {
  const snapshot = await db.collection("organizations").get();
  const docs = snapshot.docs.map(doc => materialize(doc.data()));
  return Promise.all(docs);

}

export const deleteOrg = async (
  db: firestore.Firestore,
  req: Request,
  res: Response
): Promise<any> => {
  let {id} = req.body as DeleteOrgRequest; 
  let orgRef= db.collection("organizations").doc(id);
  return orgRef.delete().then(
    async doc =>{
      return {status: "Org deleted successfully"}
    }).catch(async error => {
      return { error : error  || "Unable to delete org" };
     });

};

export const updateOrg = async (
  db: firestore.Firestore,
  req: Request,
  res: Response
): Promise<any> => {
  let request = req.body as UpdateOrgRequest;
  const orgRef = db.collection("organizations").doc(request.id);
  return orgRef
    .update(request)
    .then(() => {
      return { status: "Org updated successfully" };
    })
    .catch(async (error) => {
      return { error: error || "Unable to update org" };
    });
};

