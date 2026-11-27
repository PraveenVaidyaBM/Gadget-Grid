import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import Message from "./Message";

function CreateProductModal({
  show,
  onHide,
  product,
  productForm,
  onChange,
  onSubmit,
  isSaving,
  error,
}) {
  const isEditing = Boolean(product);

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Form onSubmit={onSubmit}>
        <Modal.Header closeButton={!isSaving}>
          <Modal.Title>{isEditing ? "Edit Product" : "Create Product"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Message variant="danger">{error}</Message>}
          <Form.Group controlId="productName" className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              name="name"
              value={productForm.name}
              onChange={onChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="productImageFile" className="mb-3">
            <Form.Label>Product image</Form.Label>
            <Form.Control
              key={productForm.imageFile?.name || "no-image-selected"}
              type="file"
              name="imageFile"
              accept="image/jpeg,image/png,image/webp,image/gif"
              required={!isEditing}
              onChange={onChange}
            />
            {productForm.imageFile && (
              <Form.Text className="text-muted">
                Selected: {productForm.imageFile.name}
              </Form.Text>
            )}
            <Form.Text className="text-muted d-block">
              {isEditing
                ? "Leave blank to keep the current image."
                : "Upload a JPEG, PNG, WebP, or GIF image (maximum 5 MB)."}
            </Form.Text>
          </Form.Group>
          <Row>
            <Col md={6}>
              <Form.Group controlId="productBrand" className="mb-3">
                <Form.Label>Brand</Form.Label>
                <Form.Control
                  name="brand"
                  value={productForm.brand}
                  onChange={onChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="productCategory" className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  name="category"
                  value={productForm.category}
                  onChange={onChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="productPrice" className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={productForm.price}
                  onChange={onChange}
                  min="0"
                  step="0.01"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="productStock" className="mb-3">
                <Form.Label>Stock</Form.Label>
                <Form.Control
                  type="number"
                  name="countInStock"
                  value={productForm.countInStock}
                  onChange={onChange}
                  min="0"
                  step="1"
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group controlId="productDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="description"
              value={productForm.description}
              onChange={onChange}
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button type="button" variant="secondary" onClick={onHide} disabled={isSaving}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
          {isSaving
            ? "Saving..."
            : isEditing
              ? "Save Changes"
              : "Create Product"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default CreateProductModal;
