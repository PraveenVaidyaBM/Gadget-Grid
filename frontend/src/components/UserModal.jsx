import { Button, Form, Modal } from "react-bootstrap";
import { STRONG_PASSWORD_PATTERN } from "../utils/constant";
import Message from "./Message";

function UserModal({
  show,
  onHide,
  userForm,
  onChange,
  onSubmit,
  isSaving,
  error,
}) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Form onSubmit={onSubmit}>
        <Modal.Header closeButton={!isSaving}>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Message variant="danger">{error}</Message>}
          <Form.Group controlId="userName" className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              name="name"
              value={userForm.name}
              onChange={onChange}
              autoComplete="name"
              required
            />
          </Form.Group>
          <Form.Group controlId="userEmail" className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={userForm.email}
              onChange={onChange}
              autoComplete="email"
              required
            />
          </Form.Group>
          <Form.Group controlId="userPassword" className="mb-3">
            <Form.Label>Password (optional)</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={userForm.password}
              onChange={onChange}
              autoComplete="new-password"
              minLength={8}
              pattern={STRONG_PASSWORD_PATTERN.source}
              title="Use at least 8 characters, including uppercase and lowercase letters, a number, and a special character."
            />
            <Form.Text className="text-muted">
              Leave blank to keep the current password.
            </Form.Text>
          </Form.Group>
          <Form.Group controlId="userConfirmPassword" className="mb-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              value={userForm.confirmPassword}
              onChange={onChange}
              autoComplete="new-password"
              required={Boolean(userForm.password)}
            />
          </Form.Group>
          <Form.Check
            type="checkbox"
            id="userIsAdmin"
            name="isAdmin"
            label="Administrator"
            checked={userForm.isAdmin}
            onChange={onChange}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="button"
            variant="secondary"
            onClick={onHide}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default UserModal;
