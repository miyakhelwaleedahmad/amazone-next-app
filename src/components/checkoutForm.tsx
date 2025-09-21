// File: W:\Amazone-clone2\my-app\src\components\CheckoutForm.tsx
import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

interface CheckoutFormProps {
  amount: number; // amount in cents
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      // 1️⃣ Create PaymentIntent on backend
      const res = await fetch("/api/payment_intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();

      if (!data.clientSecret) throw new Error("PaymentIntent creation failed");

      // 2️⃣ Confirm card payment
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("CardElement not found");

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card: cardElement },
      });

      if (result.error) {
        setError(result.error.message || "Payment failed");
        setLoading(false);
      } else if (result.paymentIntent?.status === "succeeded") {
        setSuccess(true);
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded shadow">
      <h2 className="text-xl font-semibold">Payment</h2>

      <div className="p-2 border rounded">
        <CardElement options={{ hidePostalCode: true }} />
      </div>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">Payment successful!</p>}

      <button
        type="submit"
        disabled={!stripe || loading || success}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Processing..." : success ? "Paid" : `Pay $${(amount / 100).toFixed(2)}`}
      </button>
    </form>
  );
};

export default CheckoutForm;
