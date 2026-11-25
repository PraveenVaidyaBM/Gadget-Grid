import { PRODUCTS_URL } from "../utils/constant";
import { apiSlice } from "./apiSlices";

export const productApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: ({pageNumber}) => ({
                url: PRODUCTS_URL,
                params: { pageNumber }
            }),
            keepUnusedDataFor: 5,
        }),
        getProductById: builder.query({
            query: (productId) => ({
                url: `${PRODUCTS_URL}/${productId}`,
            }),
            keepUnusedDataFor: 5,
        }),
        createProductReview: builder.mutation({
            query: (data) => ({
                url: `${PRODUCTS_URL}/${data.productId}/reviews`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Product'],
        }),
    })
});

export const { useGetProductsQuery, useGetProductByIdQuery, useCreateProductReviewMutation } = productApiSlice;