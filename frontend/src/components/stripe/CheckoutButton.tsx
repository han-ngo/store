import React from "react";

import { Button } from "@/components/ui/button";

import {loadStripe} from '@stripe/stripe-js';

import { STRIPE_PUBLISHABLE_KEY, BACKEND_URL } from "../../lib/constants/env";

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY)

const CheckoutButton: React.FC<{productId: string; label?: string}> = ({ 
  productId,
  label = "Order Now", 
}) => {


  const handleCheckout = async () => {
    console.log(`key = ${STRIPE_PUBLISHABLE_KEY}`)
    if (!stripePromise) {
      console.error("Stripe configuration is missing");
      // Add alert for missing configuration
    }

    const stripe = await stripePromise;

    if (!stripe) {
      throw new Error("Stripe configuration is missing");
    }
  
    try {
      // Make a request to your backend to create the checkout session
      const response = await fetch(`${BACKEND_URL}/stripe/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: productId,
          // cancel_url: location.pathname,
        }),
      });
  
      const data = await response.json();
      console.log(data)
      debugger;

      if (!response.ok || !data.sessionId) {
        throw new Error(data.detail || "Failed to create checkout session");
      }

      // Redirect the user to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (result.error) {
        throw result.error;
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };


  return (
    <Button type="submit" onClick={handleCheckout}>
      {label}
    </Button>
  );
};

CheckoutButton.displayName = "CheckoutButton";

export default CheckoutButton;
