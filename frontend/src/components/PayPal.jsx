import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { toast } from "react-toastify";
import Loader from "./Loader";
import Message from "./Message";

function PayPal({
  orderId,
  amount,
  isProcessing,
  isLoadingConfig,
  configError,
  clientId,
  onPaymentSuccess,
}) {
  const [{ isPending, isRejected, options }] = usePayPalScriptReducer();

  const createPayPalOrder = (_, actions) =>
    actions.order.create({
      purchase_units: [
        {
          custom_id: orderId,
          amount: {
            currency_code: "USD",
            value: Number(amount).toFixed(2),
          },
        },
      ],
    });

  const approvePayPalOrder = async (_, actions) => {
    try {
      const paymentResult = await actions.order.capture();
      await onPaymentSuccess(paymentResult);
    } catch (error) {
      console.error("PayPal payment failed:", error);
      toast.error(
        error?.data?.message || "PayPal payment could not be completed.",
      );
    }
  };

  const handlePayPalError = (error) => {
    console.error("PayPal checkout error:", error);
    toast.error("PayPal checkout could not be loaded. Please try again.");
  };

  if (isLoadingConfig) {
    return <Loader />;
  }
  if (configError) {
    return (
      <Message variant="danger">
        {configError?.data?.message ||
          configError?.error ||
          "Could not load PayPal configuration."}
      </Message>
    );
  }
  if (!clientId) {
    return (
      <Message variant="danger">
        PayPal is not configured. Set PAYPAL_CLIENT_ID on the server.
      </Message>
    );
  }
  if (isRejected) {
    return (
      <Message variant="danger">
        PayPal could not load. Check the PayPal client ID and try again.
      </Message>
    );
  }
  if (isPending || options.clientId !== clientId) {
    return <Loader />;
  }

  return (
    <div className="w-100">
      <PayPalButtons
        style={{ layout: "vertical" }}
        disabled={isProcessing}
        createOrder={createPayPalOrder}
        onApprove={approvePayPalOrder}
        onError={handlePayPalError}
      />
    </div>
  );
}

export default PayPal;
