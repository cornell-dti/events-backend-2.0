import admin from "firebase-admin";

declare module "express-serve-static-core" {
  export interface Request {
    authInfo ?: admin.auth.DecodedIdToken;
  }
  export interface Response {}
}
