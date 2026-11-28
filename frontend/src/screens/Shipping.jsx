import { Form, Button } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import PageTitle from "../components/PageTitle";
import useShippingForm from "../hooks/useShippingForm";

function Shipping() {
  const { values, handleChange, submitHandler, isComplete } = useShippingForm();

  return (
    <FormContainer>
      <PageTitle title="Shipping" />
      <CheckoutSteps step1 step2 />
      <h1>Shipping</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="address" className="my-3">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter address"
            name="address"
            required
            value={values.address}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="city" className="my-3">
          <Form.Label>City</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter city"
            name="city"
            required
            value={values.city}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="postalCode" className="my-3">
          <Form.Label>Postal Code</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter postal code"
            name="postalCode"
            required
            value={values.postalCode}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="country" className="my-3">
          <Form.Label>Country</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter country"
            name="country"
            required
            value={values.country}
            onChange={handleChange}
          />
        </Form.Group>
        <Button
          type="submit"
          variant="primary"
          className="mt-3"
          disabled={!isComplete}
        >
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
}

export default Shipping;
