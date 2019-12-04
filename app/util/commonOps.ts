// This file contains common operations that will need to be performed often.

import { firestore } from "firebase";
import { isUndefined } from "util";

/**
 * This function takes a collection reference and turns it into an array
 * of its constituent document references
 * 
 * @param coll the collection to convert into a docref array
 */
export async function docRefArrayFromCollectionRef(coll: firestore.CollectionReference) {
  // Init array
  let insArr: firestore.DocumentReference[] = [];
  // Go through each doc and add their reference
  await coll.get().then(snapshot => {
    snapshot.forEach(element => {
      insArr.push(element.ref);
    })
  });
  // Return the array
  return insArr;
}

const maxDepthDefault = 5;

/**
 * This function takes in a JS struct, and recursively flattens out all the
 * references into their actual data values.
 * 
 * Essentially, it converts all the references to their values so that the data
 * can be passed in json.
 * 
 * @param object The object to materialize
 */
export async function materialize(object: any, maxDepth?: number, depth?: number) {
  let depthVal;
  let maxDepthVal;
  if (!isUndefined(depth) && !isUndefined(maxDepth)) {
    depthVal = depth;
    maxDepthVal = maxDepth;
  } else if (isUndefined(depth) && !isUndefined(maxDepth)) {
    depthVal = 0;
    maxDepthVal = maxDepth;
  } else if (!isUndefined(depth) && isUndefined(maxDepth)) {
    depthVal = depth;
    maxDepthVal = maxDepthDefault;
  } else {
    depthVal = 0;
    maxDepthVal = maxDepthDefault;
  }

  if (depthVal >= maxDepthVal) {
    return object;
  }

  let objectStruct: any = Object.assign({}, object);

  for (var prop1 in objectStruct) {
    if (Object.prototype.hasOwnProperty.call(objectStruct, prop1)) {

      if (isDocRef(objectStruct[prop1])) {
        let docRef: firestore.DocumentReference = objectStruct[prop1] as firestore.DocumentReference;
        let docData;
        await docRef.get().then(val => {
          docData = val.data();
        })
        objectStruct[prop1] = await materialize(docData, maxDepthVal, depthVal + 1)
      }
      else if (objectStruct[prop1] instanceof Array && objectStruct[prop1].length > 0
        && isDocRef(objectStruct[prop1][0])) {
        let arr = objectStruct[prop1] as Array<firestore.DocumentReference>;
        let retArr: any = [];
        for (let i = 0; i < arr.length; i++) {
          let val = arr[i];
          let newObj;
          await val.get().then(valRet => newObj = valRet.data());
          retArr.push(await materialize(newObj, maxDepthVal, depthVal + 1))
        }
        objectStruct[prop1] = retArr;
      }
      else if (isCollRef(objectStruct[prop1])) {
        let collection: firestore.CollectionReference = objectStruct[prop1] as firestore.CollectionReference;
        objectStruct[prop1] = await materialize(await docRefArrayFromCollectionRef(collection), maxDepthVal, depthVal + 1);
      }
    }
  }
  return objectStruct;
}

function isDocRef(val: any) {
  return typeof (val.collection) === 'function'
    && typeof (val.doc) === 'undefined'
    && typeof (val.startAfter) === 'undefined'
}

function isCollRef(val: any) {
  return typeof (val.collection) === 'undefined'
    && typeof (val.doc) === 'function'
    && typeof (val.startAfter) === 'function'
}