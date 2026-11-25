import { Link } from "react-router-dom";
import { Button, Col, Form, ListGroup, Row } from "react-bootstrap";
import Rating from "./Rating";
import Loader from "./Loader";
import Message from "./Message";
import useProductReviewForm from "../hooks/useProductReviewForm";

const ProductReviews = ({ product, userInfo, refetch }) => {
  const {
    rating,
    comment,
    handleRatingChange,
    handleCommentChange,
    submitHandler,
    isLoading: loadingProductReview,
  } = useProductReviewForm(refetch);

  return (
    <Row className="review">
      <Col md={6}>
        <h4>Write a Review</h4>
        {product?.reviews?.length === 0 && <Message>No Reviews</Message>}
        <ListGroup variant="flush">
          {product?.reviews?.map((review) => (
            <ListGroup.Item key={review._id}>
              <strong>{review.name}</strong>
              <Rating value={review.rating} />
              <p>{review.createdAt.substring(0, 10)}</p>
              <p>{review.comment}</p>
            </ListGroup.Item>
          ))}
          {product?.reviews?.length === 0 && (
            <ListGroup.Item>
              <h2>Write a Review</h2>
              {loadingProductReview && <Loader />}
              {userInfo ? (
                <Form onSubmit={submitHandler}>
                  <Form.Group controlId="rating">
                    <Form.Label>Rating</Form.Label>
                    <Form.Control
                      as="select"
                      value={rating}
                      onChange={handleRatingChange}
                    >
                      <option value="">Select...</option>
                      <option value="1">1 - Poor</option>
                      <option value="2">2 - Fair</option>
                      <option value="3">3 - Good</option>
                      <option value="4">4 - Very Good</option>
                      <option value="5">5 - Excellent</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="comment">
                    <Form.Label>Comment</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows="3"
                      value={comment}
                      onChange={handleCommentChange}
                    />
                  </Form.Group>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loadingProductReview}
                  >
                    Submit
                  </Button>
                </Form>
              ) : (
                <Message>
                  Please <Link to="/login">sign in</Link> to write a review
                </Message>
              )}
            </ListGroup.Item>
          )}
        </ListGroup>
      </Col>
    </Row>
  );
};

export default ProductReviews;
