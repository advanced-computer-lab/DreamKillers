const express = require("express");
const router = express.Router();

const Admin = require("../Models/admin.model");

router.post("/login", async (req, res) => {
  const adminEmail = req.body.email;
  const adminPass = req.body.password;
  const admin = await Admin.findOne({ email: adminEmail });

  if (admin != null) {
    if (adminPass === admin.password) {
      const token = admin.generateAuthToken();
      res.header("admin-token", token);
      res.status(200).send();
    } else res.status(401).send("Error");
  } else res.status(401).send("Error");
});
module.exports = router;
