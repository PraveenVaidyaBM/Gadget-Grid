import { useParams } from "react-router-dom";
import { useGetOrderDetailsQuery } from "../slices/oderAPiSlice";

const useOrderDetails = () => {
    const { id: orderId } = useParams();
    const { data: order, isLoading, error } = useGetOrderDetailsQuery(orderId);
  
};
