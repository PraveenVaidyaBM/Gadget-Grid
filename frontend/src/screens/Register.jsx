import { Row, Col, Button, Form } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import { STRONG_PASSWORD_PATTERN } from "../utils/constant";
import useRegisterForm from "../hooks/useRegisterForm";

function Register() {
  const { values, handleChange, submitHandler, isLoading, redirect } =
    useRegisterForm();

  return (
    <FormContainer>
      <h1>Sign Up</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="name" className="my-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            placeholder="John Doe"
            type="text"
            name="name"
            value={values.name}
            autoComplete="off"
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="email" className="my-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            placeholder="john@example.com"
            type="email"
            name="email"
            value={values.email}
            autoComplete="off"
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="password" className="my-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            placeholder="Enter password"
            type="password"
            name="password"
            value={values.password}
            autoComplete="new-password"
            required
            minLength={8}
            pattern={STRONG_PASSWORD_PATTERN.source}
            title="Use at least 8 characters, including uppercase and lowercase letters, a number, and a special character."
            onChange={handleChange}
          />
          <Form.Text className="text-muted">
            At least 8 characters, with uppercase and lowercase letters, a
            number, and a special character.
          </Form.Text>
        </Form.Group>
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
        <Row className="align-items-center mt-3">
          <Col>
            Already have an account?{" "}
            <LinkContainer
              to={{
                pathname: "/login",
                search: redirect
                  ? `?redirect=${encodeURIComponent(redirect)}`
                  : "",
              }}
            >
              <Button variant="link">Login</Button>
            </LinkContainer>
          </Col>
          <Col xs="auto">
            <Button type="submit" variant="primary" disabled={isLoading}>
              Register
            </Button>
          </Col>
        </Row>
        {isLoading && <Loader />}
      </Form>
    </FormContainer>
  );
}

export default Register;
