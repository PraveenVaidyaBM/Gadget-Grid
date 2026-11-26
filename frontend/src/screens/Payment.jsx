import { useEffect, useState } from "react";
import { Form, Button, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import PageTitle from "../components/PageTitle";
import usePayment from "../hooks/usePayment";

function Payment() {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const { paymentMethod, paymentMethodChangeHandler, submitHandler } =
    usePayment();

  useEffect(() => {
    if (!shippingAddress) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);

  return (
    <FormContainer>
      <PageTitle title="Payment" />
      <CheckoutSteps step1 step2 step3 />
      <h1>Payment Method</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as="legend">Select Method</Form.Label>
          <Col>
            <Form.Check
              type="radio"
              className="my-2"
              label="PayPal or Credit Card"
              name="paymentMethod"
              id="PayPal"
              value="PayPal"
              checked={paymentMethod === "PayPal"}
              onChange={paymentMethodChangeHandler}
            />
          </Col>
        </Form.Group>
        <Button type="submit" variant="primary" className="my-3">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
}

export default Payment;
