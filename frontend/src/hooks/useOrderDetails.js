import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetOrderDetailsQuery,
  useUpdateOrderToDeliveredMutation,
} from "../slices/oderAPiSlice";

const useOrderDetails = () => {
  const { id: orderId } = useParams();
    const [updateOrderToDelivered, { isLoading: isDelivering }] =
    useUpdateOrderToDeliveredMutation();
  const {
    data: order,
    isLoading,
    error,
    refetch,
  } = useGetOrderDetailsQuery(orderId);


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

  return { order, isLoading, error, isDelivering, orderDeliveryHandler };
};

export default useOrderDetails;
