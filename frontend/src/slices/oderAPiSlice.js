import { ORDERS_URL } from "../utils/constant";
import { apiSlice } from "./apiSlices";

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({
        url: `${ORDERS_URL}`,
        method: "POST",
        body: {...order},
      }),
    }),
    getOrderDetails: builder.query({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}`,
        method: "GET",
      }),
    }),
    getMyOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/myorders`,
        method: "GET",
      }),
    }),
    updateOrderToPaid: builder.mutation({
      query: (id) => ({
        url: `${ORDERS_URL}/${id}/pay`,
        method: "PUT",
      }),
    }),
    updateOrderToDelivered: builder.mutation({
      query: (id) => ({
        url: `${ORDERS_URL}/${id}/delivered`,
        method: "PUT",
      }),
    }),
    getOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}`,
      }),
      keepUnusedDataFor: 5,
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateOrderMutation,
  useGetMyOrdersQuery,
  useGetOrderDetailsQuery,
  useUpdateOrderToPaidMutation,
  useUpdateOrderToDeliveredMutation,
  useGetOrdersQuery
} = orderApiSlice;