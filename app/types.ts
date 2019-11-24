// Models
import { firestore } from "firebase";

export interface Event {

  name: string;
  id: number;
  // nums: number[];
  ref: firestore.DocumentReference;
  collectionRef: firestore.DocumentReference[];

}
export default Event;

export class Org {

  name: string;
  id: number;

  constructor(name: string, id: number, refs: firestore.DocumentReference) {
    this.name = name;
    this.id = id;
  }
}