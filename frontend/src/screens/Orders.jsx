import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import { Row, Col, Card, ListGroup, Image, Button } from "react-bootstrap";

import Message from "../components/Message";
import Loader from "../components/Loader";
import PageTitle from "../components/PageTitle";
import useOrderDetails from "../hooks/useOrderDetails";

function Order() {
  const {
    order,
    isLoading,
    error,
    isDelivering,
    orderDeliveryHandler,
  } = useOrderDetails();
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <>
      <PageTitle title={order?._id ? `Order ${order._id}` : "Order"} />
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error?.error || "Could not load order."}
        </Message>
      ) : (
        <>
          <h1>Order: {order._id}</h1>
          <Row>
            <Col md={8}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h2>Shipping</h2>
                  <p>
                    <strong>Name:</strong> {order.user.name}
                  </p>
                  <p>
                    <strong>Email:</strong>
                    {order.user.email}
                  </p>
                  <p>
                    <strong>Address:</strong>
                    {order.shippingAddress.address},{" "}
                    {order.shippingAddress.city},{" "}
                    {order.shippingAddress.postalCode},{" "}
                  </p>
                  {order.isDelivered ? (
                    <Message variant="success">
                      Delivered on{" "}
                      {new Date(order.deliveredAt).toLocaleDateString()}
                    </Message>
                  ) : (
                    <Message variant="warning">Not delivered yet</Message>
                  )}
                </ListGroup.Item>
                <ListGroup.Item>
                  <h2>Payment Method</h2>
                  <p>
                    <strong>Method:</strong> {order.paymentMethod}
                  </p>
                  {order.isPaid ? (
                    <Message variant="success">
                      Paid on {new Date(order.paidAt).toLocaleDateString()}
                    </Message>
                  ) : (
                    <Message variant="warning">Not paid yet</Message>
                  )}
                </ListGroup.Item>
                <ListGroup.Item>
                  <h2>Order Items</h2>
                  {order.orderItems.length === 0 ? (
                    <Message>Order is empty</Message>
                  ) : (
                    <ListGroup variant="flush">
                      <Card>
                        {order.orderItems.map((item, index) => (
                          <ListGroup.Item key={index}>
                            <Row>
                              <Col md={1}>
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fluid
                                  rounded
                                />
                              </Col>
                              <Col>
                                <Link to={`/product/${item.product}`}>
                                  {item.name}
                                </Link>
                              </Col>
                              <Col md={4}>
                                {item.qty} x ${item.price} = $
                                {(item.qty * item.price).toFixed(2)}
                              </Col>
                            </Row>
                          </ListGroup.Item>
                        ))}
                      </Card>
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
                      <Col>${order.itemsPrice.toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Shipping</Col>
                      <Col>${order.shippingPrice.toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Tax</Col>
                      <Col>${order.taxPrice.toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>
                        <strong>Total</strong>
                      </Col>
                      <Col>
                        <strong>${order.totalPrice.toFixed(2)}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  {isDelivering && <Loader />}
                  {userInfo &&
                    userInfo.isAdmin &&
                    order.isPaid &&
                    !order.isDelivered && (
                      <ListGroup.Item>
                        <Button
                          type="button"
                          className="btn btn-block"
                          disabled={isDelivering}
                          onClick={orderDeliveryHandler}
                        >
                          Mark as Delivered
                        </Button>
                      </ListGroup.Item>
                    )}
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </>
  );
}

export default Order;
