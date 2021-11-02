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
      res.header("x-admin-auth-token", token);
      res.status(200).send();
    } else res.send("Error");
  } else res.send("Error");
});
module.exports = router;
