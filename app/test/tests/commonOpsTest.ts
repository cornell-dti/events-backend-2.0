import { firestore } from "firebase";
import { describe } from "../testExtensions";
import { materialize } from "../../util/commonOps";

// Begin Tests -----------------------------------------------------------------

//Tests that the materialize function works up to specified depth
export async function runMaterializeDepthTest(db: firestore.Firestore) {
  const depth = 7;
  const str = "enoch";
  const mockChain = (str: string) => {
    let temp: { ref: any } = { ref: str };
    for (let i = 0; i < depth; i++) {
      temp = { ref: temp };
    }
    return temp;
  };

  let ref = db.collection("test").doc(`materializeDepth0`);
  await ref.set({ ref: str });
  for (let i = 1; i <= depth; i++) {
    let temp = ref;
    ref = db.collection("test").doc(`materializeDepth${i}`);
    await ref.set({ ref: temp });
  }

  const res = await ref.get().then(doc => materialize(doc.data(), depth));
  describe(`Doc should exist`)
    .expect(res)
    .is.defined();

  const resJson = JSON.stringify(res);
  const mockJson = JSON.stringify(mockChain(str));
  describe(`Response should be fully flattened`)
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
