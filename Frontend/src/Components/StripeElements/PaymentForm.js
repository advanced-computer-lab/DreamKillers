import { Button } from "@mui/material";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import React, { useState } from "react";
import ButtonDK from "../ButtonDK/ButtonDK";

const CARD_OPTIONS = {
  iconStyle: "solid",
  style: {
    base: {
      iconColor: "goldrod",
      color: "black",
      fontWeight: 500,
      fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
      fontSize: "16px",
      fontSmoothing: "antialiased",
      ":-webkit-autofill": { color: "black" },
      "::placeholder": { color: "goldenrod" },
    },
    invalid: {
      iconColor: "red",
      color: "red",
    },
  },
};

export default function PaymentForm({ reserveFunc, email, price }) {
  const [success, setSuccess] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    const { id } = paymentMethod;
    const response = await axios
      .post("http://localhost:8000/payment/charge", {
        price: price,
        receipt_email: email,
      })
      .then((res) => {
        console.log("Successful payment");
        setSuccess(true);
        reserveFunc(res.data.charge.receipt_url);
      })
      .catch((err) => {
        console.log("Error", error);
      });
  };

  return (
    <>
      {!success ? (
        <form onSubmit={handleSubmit}>
          <h1>{price + " USD"}</h1>
          <fieldset className="FormGroup">
            <div className="FormRow">
              <CardElement options={CARD_OPTIONS} />
            </div>
          </fieldset>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "darkOrange",
              color: "black",
              ":hover": { backgroundColor: "orange" },
            }}
            type="submit"
          >
            {"Pay"}
          </Button>
        </form>
      ) : (
        <div>
          <h2>
            Thank you for your purchase. An Email will be sent to you shortly
            for confirmation.
          </h2>
        </div>
      )}
    </>
  );
}
