import jwt from "jsonwebtoken";

export default (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");

  if (token) {
    try {
      const decoded = jwt.verify(token, "secret123");

      req.userId = decoded._id;

      next();
    } catch (err) {
      console.log(err);
      return res.status(404).json({ message: "Can't get the user token" });
    }
  } else {
    return res.status(403).json({
      message: "No access",
    });
  }
};
