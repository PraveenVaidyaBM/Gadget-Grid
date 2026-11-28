import { Button, Col, Form, FormGroup, Row } from "react-bootstrap";
import Loader from "../components/Loader";
import OrderHistory from "../components/OrderHistory";
import PageTitle from "../components/PageTitle";
import { STRONG_PASSWORD_PATTERN } from "../utils/constant";
import useProfile from "../hooks/useProfile";

function Profile() {
  const { values, handleChange, submitHandler, isLoading } = useProfile();

  return (
    <Row>
      <PageTitle title="Profile" />
      <Col md={3}>
        <FormGroup controlId="name" className="my-2">
          <Form.Label>Name</Form.Label>
          <Form.Control
            placeholder="John Doe"
            type="text"
            name="name"
            value={values.name}
            autoComplete="off"
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup controlId="email" className="my-2">
          <Form.Label>Email</Form.Label>
          <Form.Control
            placeholder="test@example.com"
            type="email"
            name="email"
            value={values.email}
            autoComplete="off"
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup controlId="password" className="my-2">
          <Form.Label>Password</Form.Label>
          <Form.Control
            placeholder="Enter password"
            type="password"
            name="password"
            value={values.password}
            autoComplete="new-password"
            minLength={8}
            pattern={STRONG_PASSWORD_PATTERN.source}
            title="Use at least 8 characters, including uppercase and lowercase letters, a number, and a special character."
            onChange={handleChange}
          />
          <Form.Text className="text-muted">
            At least 8 characters, with uppercase and lowercase letters, a
            number, and a special character.
          </Form.Text>
        </FormGroup>
        <Form.Group controlId="confirmPassword" className="my-3">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            placeholder="Confirm password"
            type="password"
            name="confirmPassword"
            value={values.confirmPassword}
            autoComplete="new-password"
            required
            onChange={handleChange}
          />
        </Form.Group>
        <Button
          type="submit"
          variant="primary"
          className="my-3"
          onClick={submitHandler}
          disabled={isLoading}
        >
            Update
        </Button>
        {isLoading && <Loader />}
      </Col>
      <Col md={9}>
        <OrderHistory />
      </Col>
    </Row>
  );
}

export default Profile;
