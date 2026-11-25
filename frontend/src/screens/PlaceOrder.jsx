import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { usePlaceOrder } from "../hooks/usePlaceOrder";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";

import CheckoutSteps from "../components/CheckoutSteps";
import Loader from "../components/Loader";
import Message from "../components/Message";

function PlaceOrder() {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const { placeOrderHandler, isLoading, error } = usePlaceOrder();

  useEffect(() => {
    if (!cart.shippingAddress || !cart.paymentMethod) {
      navigate("/shipping");
    }
  }, [cart.shippingAddress, cart.paymentMethod, navigate]);

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              {cart.shippingAddress && (
                <p>
                  <strong>Address: </strong>
                  {cart.shippingAddress.address}, {cart.shippingAddress.city}{" "}
                  {cart.shippingAddress.postalCode},{" "}
                  {cart.shippingAddress.country}
                </p>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <strong>Method: </strong>
              {cart.paymentMethod}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {cart.cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {cart.cartItems.map((item) => (
                    <ListGroup.Item key={item._id}>
                      <Row className="align-items-center small">
                        <Col md={2}>
                          <div className="ratio ratio-1x1 w-50">
                            <Image
                              src={item.image}
                              alt={item.name}
                              className="w-100 h-100 object-fit-contain rounded"
                            />
                          </div>
                        </Col>
                        <Col md={6}>
                          <Link to={`/product/${item._id}`}>{item.name}</Link>
                        </Col>
                        <Col md={4} className="text-end">
                          {item.qty} x ${item.price} = $
                          {Number(item.price * item.qty).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col className="text-end">
                    {cart.cartItems.reduce((acc, item) => acc + item.qty, 0)}
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col className="text-end">
                    ${Number(cart.shippingPrice).toFixed(2)}
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col className="text-end">
                    ${Number(cart.taxPrice).toFixed(2)}
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col className="text-end">
                    $
                    {Number(
                      cart.cartItems.reduce(
                        (acc, item) =>
                          acc + Number(item.qty) * Number(item.price),
                        0,
                      ) +
                        Number(cart.shippingPrice) +
                        Number(cart.taxPrice),
                    ).toFixed(2)}
                  </Col>
                </Row>
              </ListGroup.Item>
              {error && (
                <ListGroup.Item>
                  <Message variant="danger">
                    {error.data.message || error.error}
                  </Message>
                </ListGroup.Item>
              )}
              <ListGroup.Item>
                <Button
                  type="button"
                  className="w-100 btn-block"
                  disabled={cart.cartItems.length === 0}
                  onClick={placeOrderHandler}
                >
                  Place Order
                </Button>
                {isLoading && <Loader />}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default PlaceOrder;
