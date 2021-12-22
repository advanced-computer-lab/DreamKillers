const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");

const revokedUserTokenSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const RevokedUserToken = mongoose.model(
  "RevokedUserToken",
  revokedUserTokenSchema
);

module.exports = RevokedUserToken;
