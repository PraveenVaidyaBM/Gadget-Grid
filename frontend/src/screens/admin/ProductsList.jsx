import { Link } from "react-router-dom";
import { FaTimes, FaEdit, FaTrash } from "react-icons/fa";
import { Button, Col, Image, Row, Table } from "react-bootstrap";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import Paginate from "../../components/Paginate";
import PageTitle from "../../components/PageTitle";
import CreateProductModal from "../../components/CreateProductModal";
import useProductDetails from "../../hooks/useProductDetails";

function ProductsList() {
  const {
    data,
    isLoading,
    error,
    saveProduct,
    isSaving,
    deleteProduct,
    isDeleting,
    editingProduct,
    productForm,
    productFormErrorMessage,
    showCreateProductModal,
    openCreateProductModal,
    openEditProductModal,
    closeCreateProductModal,
    handleProductFormChange,
  } = useProductDetails();

  return (
    <>
      <PageTitle title="Products | Admin" />
      <Row className="align-items-center mb-3">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-end">
          <Button
            className="btn-sm"
            onClick={openCreateProductModal}
          >
            <FaEdit /> Create Product
          </Button>
        </Col>
      </Row>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error?.error || "Could not load products."}
        </Message>
      ) : (
        <>
        <Table striped hover responsive className="table-sm">
          <thead>
            <tr>
              <th className="bg-white">Image</th>
              <th className="bg-white">Product #</th>
              <th className="bg-white">Name</th>
              <th className="bg-white">Brand</th>
              <th className="bg-white">Price</th>
              <th className="bg-white">Category</th>
              <th className="bg-white">Stock</th>
              <th className="bg-white">Rating</th>
              <th className="bg-white" />
            </tr>
          </thead>
          <tbody>
            {data?.products?.map((product) => (
              <tr key={product._id}>
                <td>
                  <Link to={`/product/${product._id}`}>
                    <Image
                      src={product.image}
                      alt={product.name}
                      rounded
                      className="admin-product-thumbnail"
                    />
                  </Link>
                </td>
                <td>{product._id}</td>
                <td>
                  <Link to={`/product/${product._id}`}>{product.name}</Link>
                </td>
                <td>{product.brand || "-"}</td>
                <td>${Number(product.price).toFixed(2)}</td>
                <td>{product.category}</td>
                <td>
                  {product.countInStock > 0 ? (
                    product.countInStock
                  ) : (
                    <FaTimes
                      aria-label="Out of stock"
                      className="text-danger"
                    />
                  )}
                </td>
                <td>{product.rating}</td>
                <td>
                  <Button
                    type="button"
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    aria-label={`Edit ${product.name}`}
                    onClick={() => openEditProductModal(product)}
                  >
                    <FaEdit className="me-1" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline-danger"
                    size="sm"
                    aria-label={`Delete ${product.name}`}
                    disabled={isDeleting}
                    onClick={() => deleteProduct(product)}
                  >
                    <FaTrash className="text-danger m-1" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Paginate
          pages={data.pages}
          pageNumber={data.pageNumber}
          isAdmin
        />
        </>
      )}
      <CreateProductModal
        show={showCreateProductModal}
        onHide={closeCreateProductModal}
        product={editingProduct}
        productForm={productForm}
        onChange={handleProductFormChange}
        onSubmit={saveProduct}
        isSaving={isSaving}
        error={productFormErrorMessage}
      />
    </>
  );
}

export default ProductsList;
