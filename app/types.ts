// Models

import { firestore } from "firebase";

export type Event = {

  name: string;
  id: number;
  nums: number[];
  ref: firestore.DocumentReference;
  collectionRef: firestore.DocumentReference[];

}

export class Org {

  name: string;
  id: number;

  constructor(name: string, id: number, refs: firestore.DocumentReference) {
    this.name = name;
    this.id = id;
  }
}