import {fetchBaseQuery, createApi} from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../utils/constant";

const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
});

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery,
    tagTypes: ["Product", "User", "Order"],
    endpoints: (builder) => ({}),
});

