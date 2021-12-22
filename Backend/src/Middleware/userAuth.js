const jwt = require("jsonwebtoken");
const RevokedUserToken = require("../Models/revokedUserToken.model");

async function userAuth(req, res, next) {
  const userToken = req.header("user-token");
  if (!userToken) return res.status(401).send({ error: "Unauthorized" });

  const revokedToken = await RevokedUserToken.findOne({ token: userToken });
  if (revokedToken)
    return res.status(401).send({ error: "Unauthorized, token revoked" });

  try {
    const decoded = jwt.verify(userToken, process.env.userAuthSecretKey);
    req.user = decoded;
    next();
  } catch (ex) {
    return res.status(401).send({ error: "Unauthorized" });
  }
}

module.exports = userAuth;
