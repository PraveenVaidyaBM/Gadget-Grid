import { Row, Col, Button, Form } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import PageTitle from "../components/PageTitle";
import useLoginForm from "../hooks/useLoginForm";

function Login() {
  const { values, handleChange, submitHandler, isLoading, redirect } =
    useLoginForm();

  return (
    <FormContainer>
      <PageTitle title="Sign In" />
      <h1>Sign In</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="email" className="my-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            placeholder="Enter email"
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
            autoComplete="off"
            onChange={handleChange}
          />
        </Form.Group>
        <Row className="align-items-center mt-3">
          <Col>
            New Customer?{" "}
            <LinkContainer
              to={{
                pathname: "/register",
                search: redirect
                  ? `?redirect=${encodeURIComponent(redirect)}`
                  : "",
              }}
            >
              <Button variant="link" className="p-0">
                Register
              </Button>
            </LinkContainer>
          </Col>
          <Col xs="auto">
            <Button type="submit" variant="primary" disabled={isLoading}>
              Sign In
            </Button>
          </Col>
        </Row>
        {isLoading && <Loader />}
      </Form>
    </FormContainer>
  );
}

export default Login;
