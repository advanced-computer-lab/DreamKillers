const jwt = require("jsonwebtoken");
const RevokedUserToken = require("../Models/revokedUserToken.model");

async function adminAuth(req, res, next) {
  const adminToken = req.header("admin-token");
  if (!adminToken) return res.status(401).send({ error: "Unauthorized" });

  const revokedToken = await RevokedUserToken.findOne({ token: adminToken });
  if (revokedToken)
    return res.status(401).send({ error: "Unauthorized, token revoked" });

  try {
    const decoded = jwt.verify(adminToken, process.env.adminAuthSecretKey);
    req.admin = decoded;
    next();
  } catch (ex) {
    return res.status(401).send({ error: "Unauthorized" });
  }
}

module.exports = adminAuth;
