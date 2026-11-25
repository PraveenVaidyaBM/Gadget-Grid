import { useReducer } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useCreateProductReviewMutation } from "../slices/productSlice";

const initialState = { rating: 0, comment: "" };

const reviewFormReducer = (state, action) => {
  switch (action.type) {
    case "ratingChanged":
      return { ...state, rating: action.value };
    case "commentChanged":
      return { ...state, comment: action.value };
    case "reset":
      return initialState;
    default:
      return state;
  }
};

const useProductReviewForm = (refetch) => {
  const { id: productId } = useParams();
  const [values, dispatch] = useReducer(reviewFormReducer, initialState);
  const [createProductReview, { isLoading }] =
    useCreateProductReviewMutation();

  const handleRatingChange = (event) =>
    dispatch({
      type: "ratingChanged",
      value: Number(event.target.value),
    });
  const handleCommentChange = (event) =>
    dispatch({
      type: "commentChanged",
      value: event.target.value,
    });

  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      await createProductReview({
        productId,
        rating: values.rating,
        comment: values.comment,
      }).unwrap();
      refetch();
      toast.success("Review submitted successfully");
      dispatch({ type: "reset" });
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return {
    ...values,
    handleRatingChange,
    handleCommentChange,
    submitHandler,
    isLoading,
  };
};

export default useProductReviewForm;
