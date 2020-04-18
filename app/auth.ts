import { auth } from "./util/firebase";

export const authenticate = async (
  req: Request,
  res: Response,
  next: Function
) => {
  try {
    const header = req.headers.get("Authentication");
    if (!header) throw "invalid header";

    const [authType, authToken] = header.split(" ");
    if (authType !== "Bearer") throw "invalid auth type";

    req.authInfo = await auth.verifyIdToken(authToken);
    next();
  } catch (e) {
    return { error: "Not Authorized" };
  }
};
