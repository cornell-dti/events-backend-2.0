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
 * @param depth The maximum depth of materialization (maxDepthDefault = 5)
 */
export async function materialize(object?: firestore.DocumentData, depth = maxDepthDefault) {

  if (depth <= 0) {
    return object;
  }

  let objectStruct = Object.assign({}, object);

  for (let prop in objectStruct) {
    if (Object.prototype.hasOwnProperty.call(objectStruct, prop)) {

      if (isDocRef(objectStruct[prop])) {
        let ref = objectStruct[prop] as firestore.DocumentReference;
        let data = await ref.get().then(val => val.data());
        objectStruct[prop] = await materialize(data, depth - 1);
      }
      else if (objectStruct[prop] instanceof Array && objectStruct[prop].length > 0
        && isDocRef(objectStruct[prop][0])) {
        let refArr = objectStruct[prop] as Array<firestore.DocumentReference>;
        let dataArr = [];
        for (let i = 0; i < refArr.length; i++) {
          let ref = refArr[i];
          let data = await ref.get().then(valRet => valRet.data());
          dataArr.push(await materialize(data, depth - 1))
        }
        objectStruct[prop] = dataArr;
      }
      else if (isCollRef(objectStruct[prop])) {
        let collection = objectStruct[prop] as firestore.CollectionReference;
        objectStruct[prop] = await materialize(await docRefArrayFromCollectionRef(collection), depth - 1);
      }
    }
  }
  return objectStruct;
}

export async function docRefArrayFromCollectionRefProm(coll: firestore.CollectionReference) {
  // Init array
  let insArr: firestore.DocumentReference[] = [];
  // Go through each doc and add their reference
  return coll.get().then(snapshot => {
    snapshot.forEach(element => {
      insArr.push(element.ref);
    });
    return insArr;
  });
}

/**
 * This function takes in a JS struct, and recursively flattens out all the
 * references into their actual data values.
 *
 * Essentially, it converts all the references to their values so that the data
 * can be passed in json.
 *
 * @param object The object to materialize
 * @param depth The maximum depth of materialization (maxDepthDefault = 5)
 */
export async function materializeProm(object?: firestore.DocumentData, depth = maxDepthDefault) : Promise<any> {
  return new Promise((res, rej) => {
    if (depth <= 0) {
       res(object);
    }

    let objectStruct = Object.assign({}, object);

    let propToProm: [string, Promise<any>][] = [];

    let foundAProp = false;

    for (let prop in objectStruct) {
      if (Object.prototype.hasOwnProperty.call(objectStruct, prop)) {
        if (isDocRef(objectStruct[prop])) {
          let ref = objectStruct[prop] as firestore.DocumentReference;
          let dataProm = ref.get().then(val => val.data()).then((data) => {
            return materializeProm(data, depth - 1);
          });
          propToProm.push([prop, dataProm]);
          foundAProp = true;
        }
        else if (objectStruct[prop] instanceof Array && objectStruct[prop].length > 0
            && isDocRef(objectStruct[prop][0])) {
          let refArr = objectStruct[prop] as Array<firestore.DocumentReference>;
          let groupProm = [];
          for (let i = 0; i < refArr.length; i++) {
            let ref = refArr[i];
            let dataProm = ref.get().then(valRet => valRet.data()).then(data => {
              return materializeProm(data, depth - 1);
            });
            groupProm.push(dataProm);
          }
          propToProm.push([prop, Promise.all(groupProm)]);
          foundAProp = true;
        }
        else if (isCollRef(objectStruct[prop])) {
          let collection = objectStruct[prop] as firestore.CollectionReference;
          let promRet = docRefArrayFromCollectionRefProm(collection).then(colAsArr => {
            return materializeProm(colAsArr, depth - 1);
          });
          propToProm.push([prop, promRet]);
          foundAProp = true;
        }
      }
    }

    if(!foundAProp){
      res(objectStruct);
    }

    let waitForThese : Promise<any>[] = propToProm.map(([k, v]) => v);

    return Promise.all(waitForThese).then((values) => {
      for(let i = 0; i < values.length; i++){
        objectStruct[propToProm[i][0]] = materializeProm(values[i], depth - 1);
      }
      return objectStruct;
    });
  });
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