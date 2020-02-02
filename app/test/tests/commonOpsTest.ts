import { firestore } from "firebase";
import { describe } from "../testExtensions";
import { materialize } from "../../util/commonOps";

// Begin Tests -----------------------------------------------------------------

//Tests that the materialize function works up to specified depth
export async function runMaterializeDepthTest(db: firestore.Firestore) {
  const depth = 7;
  let mockChain = (str: string) => {
    let temp: { ref: any } = { ref: str };
    for (let i = 0; i < depth; i++) {
      temp = { ref: temp };
    }
    return temp;
  };

  let testStr = "enoch";
  let ref = db.collection("test").doc(`materializeDepth0`);
  await ref.set({ ref: testStr });
  for (let i = 1; i <= depth; i++) {
    let temp = ref;
    ref = db.collection("test").doc(`materializeDepth${i}`);
    await ref.set({ ref: temp });
  }

  let res = await ref.get().then(doc => materialize(doc.data(), depth));
  describe(`Doc should exist`)
    .expect(res)
    .is.defined();

  let resJson = JSON.stringify(res);
  let mockJson = JSON.stringify(mockChain(testStr));
  describe(`Responses should be equal`)
    .expect(resJson)
    .toBe.equalTo(mockJson);

  let exists = true;
  for (let i = 0; i <= depth; i++) {
    let delRef = db.collection("test").doc(`materializeDepth${i}`);
    await delRef.delete();
    exists = exists && (await delRef.get()).exists;
  }
  describe(`Test docs should be removed`)
    .expect(exists)
    .toBe.equalTo(false);
}
