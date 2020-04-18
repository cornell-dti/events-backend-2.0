import admin from "firebase-admin";

declare global {
  export interface Request {
    authInfo: admin.auth.DecodedIdToken;
  }
  export interface Response {}
}
