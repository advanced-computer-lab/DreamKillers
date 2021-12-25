const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.post("/charge", async (req, res) => {
  try {
    const { price, receipt_email } = req.body;
    let amount = price * 100;

    const charge = await stripe.charges.create({
      amount,
      currency: "usd",
      source: "tok_visa",
      receipt_email,
    });

    if (!charge) throw new Error("charge unsuccessful");

    res.status(200).json({
      charge,
      message: "charge posted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
