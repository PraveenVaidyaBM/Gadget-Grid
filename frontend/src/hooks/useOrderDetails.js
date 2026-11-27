import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { usePayPalScriptReducer } from "@paypal/react-paypal-js";
import {
  useGetPayPalConfigQuery,
  useGetOrderDetailsQuery,
  useUpdateOrderToPaidMutation,
  useUpdateOrderToDeliveredMutation,
} from "../slices/orderSlice";

const useOrderDetails = () => {
  const { id: orderId } = useParams();
  const { userInfo } = useSelector((state) => state.auth);
  const [updateOrderToDelivered, { isLoading: isDelivering }] =
    useUpdateOrderToDeliveredMutation();
  const [updateOrderToPaid, { isLoading: isPaying }] =
    useUpdateOrderToPaidMutation();
  const {
    data: order,
    isLoading,
    error,
    refetch,
  } = useGetOrderDetailsQuery(orderId);
  const {
    data: paypal,
    isLoading: loadingPaypal,
    isError: errorPaypal,
    error: paypalError,
  } = useGetPayPalConfigQuery(undefined, {
    skip:
      !userInfo ||
      !order ||
      order.isPaid ||
      order.paymentMethod !== "PayPal",
  });
  const [{ isPending, options }, paypalDispatch] = usePayPalScriptReducer();

  useEffect(() => {
    if (
      userInfo &&
      order &&
      !order.isPaid &&
      order.paymentMethod === "PayPal" &&
      !loadingPaypal &&
      !errorPaypal &&
      !isPending &&
      paypal?.clientId &&
      options.clientId !== paypal.clientId
    ) {
      paypalDispatch({
        type: "resetOptions",
        value: {
          ...options,
          clientId: paypal.clientId,
          currency: "USD",
          intent: "capture",
        },
      });
    }
  }, [
    errorPaypal,
    isPending,
    loadingPaypal,
    options,
    order,
    paypal?.clientId,
    paypalDispatch,
    userInfo,
  ]);

  const orderDeliveryHandler = async () => {
    try {
      await updateOrderToDelivered(orderId).unwrap();
      await refetch();
      toast.success("Order marked as delivered.");
    } catch (error) {
      toast.error(
        error?.data?.message ||
          error?.error ||
          "Could not mark the order as delivered.",
      );
    }
  };

  const paymentSuccessHandler = async (paymentResult) => {
    await updateOrderToPaid({ id: orderId, paymentResult }).unwrap();
    await refetch();
    toast.success("Payment completed successfully.");
  };

  return {
    order,
    isLoading,
    error,
    isDelivering,
    orderDeliveryHandler,
    isPaying,
    paypal,
    loadingPaypal,
    errorPaypal,
    paypalError,
    isPending,
    paymentSuccessHandler,
  };
};

export default useOrderDetails;
