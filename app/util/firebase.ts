import * as admin from 'firebase-admin'
import dotenv from 'dotenv'

// Read .env file
dotenv.config();

let serviceAccount = require('../../secrets/eventsbackenddatabase-firebase-adminsdk-ukak2-d1b3a5ef55.json');
function updateServiceAccountWithSecrets() {
  serviceAccount["private_key_id"] = process.env.PK_ID ? process.env.PK_ID : "null";
  if (serviceAccount["private_key_id"] == "null" || !serviceAccount["private_key_id"]) {
    console.log("ERROR: No PK_ID in .env, pk val is: " + serviceAccount["private_key_id"]);
    throw new Error("No PK_ID in .env");
  }
  serviceAccount["private_key"] = process.env.PK_PWD ? process.env.PK_PWD : "null";
  if (serviceAccount["private_key"] == "null" || !serviceAccount["private_key"]) {
    console.log("ERROR: No PK_PWD in .env, pk_pwd val is: " + serviceAccount["private_key"]);
    throw new Error("No PK_PWD in .env");
  }
  // Now init app w/ full service account object
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://eventsbackenddatabase.firebaseio.com"
  });
}
updateServiceAccountWithSecrets();

let db = admin.firestore();
let auth = admin.auth();

export { db, auth }