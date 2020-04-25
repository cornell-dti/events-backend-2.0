import { Request, Response } from "express-serve-static-core";
import { auth } from "./util/firebase";

export const authenticate = async (
  req: Request,
  res: Response
): Promise<[Request, Response]> => {
  const header = req.get("Authentication");
  if (header) {
    const [authType, authToken] = header.split(" ");
    if (authType === "Bearer") {
      req.authInfo = await auth.verifyIdToken(authToken);
    }
  }
  return [req, res];
};
