// external libraries
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetProductByIdQuery } from "../slices/productSlice";
import { Row, Col, Image, ListGroup, Button, Form } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
// components
import Rating from "../components/Rating";
import Loader from "../components/Loader";
import Message from "../components/Message";
import ProductReviews from "../components/ProductReviews";
import useProductDetails from "../hooks/useProductDetails";

const ProductDetails = () => {
  const { id: productId } = useParams();

  const { userInfo } = useSelector((state) => state.auth);
  const {
    data: product,
    isLoading,
    error,
    refetch,
  } = useGetProductByIdQuery(productId);

  const image = useMemo(
    () => product?.image || product?.thumbnail || product?.images?.[0],
    [product],
  );
  const { qty, setQty, addToCartHandler } = useProductDetails(product);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <LinkContainer to="/">
            <Button variant="light" className="my-3">
              Go Back
            </Button>
          </LinkContainer>
          <Row>
            <Col md={5}>
              <Image
                src={image}
                alt={product.name}
                fluid
                className="product-detail-image"
              />
            </Col>
            <Col md={4}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                  />
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Price:</strong> ${product.price}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Description:</strong> {product.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <ListGroup>
                <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
                <ListGroup.Item>
                  Stock Status:{" "}
                  {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
                </ListGroup.Item>
                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <Row>
                      <Col>Qty</Col>
                      <Col>
                        <Form.Control
                          as="select"
                          value={qty}
                          onChange={(e) => setQty(Number(e.target.value))}
                        >
                          {[...Array(product.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </Form.Control>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )}
                <ListGroup.Item>
                  <Button
                    className="btn-block"
                    type="button"
                    disabled={product.countInStock === 0}
                    onClick={addToCartHandler}
                  >
                    Add to Cart
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
          <ProductReviews
            product={product}
            userInfo={userInfo}
            refetch={refetch}
          />
        </>
      )}
    </>
  );
};

export default ProductDetails;
